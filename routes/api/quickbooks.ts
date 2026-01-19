import express, { Request, Response, Router } from 'express';
import passport from 'passport';
import { createQuickBooksService, QuickBooksService } from '../../services/QuickBooksService';
import PurchaseOrder from '../../models/PurchaseOrder';
import { AuthenticatedRequest } from '../../types';

// Helper to cast request to AuthenticatedRequest
const getAuthReq = (req: Request): AuthenticatedRequest => req as AuthenticatedRequest;

const router: Router = express.Router();

// Middleware for authentication
const authenticate = passport.authenticate('jwt', { session: false });

// Store QuickBooks service instance (in production, use proper session/user storage)
let quickBooksService: QuickBooksService | null = null;

/**
 * Get or create QuickBooks service instance
 */
function getQuickBooksService(): QuickBooksService {
  if (!quickBooksService) {
    quickBooksService = createQuickBooksService();
  }
  return quickBooksService;
}

/**
 * @route   GET /api/quickbooks/status
 * @desc    Get QuickBooks connection status
 * @access  Private
 */
router.get('/status', authenticate, async (req: Request, res: Response) => {
  try {
    const service = getQuickBooksService();

    const status = {
      isConnected: service.isAuthenticated(),
      hasTokens: service.getTokens() !== null,
      environment: process.env.QUICKBOOKS_ENVIRONMENT || 'sandbox'
    };

    if (service.isAuthenticated()) {
      try {
        const companyInfo = await service.getCompanyInfo();
        Object.assign(status, { companyInfo });
      } catch (error) {
        // Ignore errors getting company info
      }
    }

    res.json(status);
  } catch (error) {
    console.error('Error getting QuickBooks status:', error);
    res.status(500).json({ error: 'Failed to get QuickBooks status' });
  }
});

/**
 * @route   GET /api/quickbooks/authorize
 * @desc    Get QuickBooks OAuth2 authorization URL
 * @access  Private
 */
router.get('/authorize', authenticate, async (req: Request, res: Response) => {
  const authReq = getAuthReq(req);
  try {
    const service = getQuickBooksService();

    // Generate a unique state for CSRF protection
    const state = `${authReq.user!._id}-${Date.now()}`;

    // In production, store this state in session or database
    // to verify the callback

    const authUrl = service.getAuthorizationUrl(state);

    res.json({
      authorizationUrl: authUrl,
      state
    });
  } catch (error) {
    console.error('Error generating authorization URL:', error);
    res.status(500).json({ error: 'Failed to generate authorization URL' });
  }
});

/**
 * @route   GET /api/quickbooks/callback
 * @desc    Handle QuickBooks OAuth2 callback
 * @access  Public (OAuth callback)
 */
router.get('/callback', async (req: Request, res: Response) => {
  try {
    const { code, state, realmId, error } = req.query;

    if (error) {
      // Redirect to frontend with error
      return res.redirect(`/settings/integrations?error=${encodeURIComponent(error as string)}`);
    }

    if (!code || !state || !realmId) {
      return res.redirect('/settings/integrations?error=missing_parameters');
    }

    const service = getQuickBooksService();

    // Exchange code for tokens
    const tokens = await service.exchangeCodeForTokens(code as string);

    // Store realmId with tokens
    tokens.realmId = realmId as string;

    // In production, store tokens securely in database associated with user

    // Redirect to frontend success page
    res.redirect('/settings/integrations?quickbooks=connected');
  } catch (error) {
    console.error('Error in QuickBooks callback:', error);
    res.redirect('/settings/integrations?error=token_exchange_failed');
  }
});

/**
 * @route   POST /api/quickbooks/disconnect
 * @desc    Disconnect from QuickBooks
 * @access  Private
 */
router.post('/disconnect', authenticate, async (req: Request, res: Response) => {
  try {
    const service = getQuickBooksService();

    await service.revokeTokens();

    res.json({ message: 'Successfully disconnected from QuickBooks' });
  } catch (error) {
    console.error('Error disconnecting from QuickBooks:', error);
    res.status(500).json({ error: 'Failed to disconnect from QuickBooks' });
  }
});

/**
 * @route   POST /api/quickbooks/sync/:poId
 * @desc    Sync a single purchase order to QuickBooks
 * @access  Private
 */
router.post('/sync/:poId', authenticate, async (req: Request, res: Response) => {
  try {
    const service = getQuickBooksService();

    if (!service.isAuthenticated()) {
      return res.status(401).json({ error: 'Not connected to QuickBooks' });
    }

    const purchaseOrder = await PurchaseOrder.findById(req.params.poId);

    if (!purchaseOrder) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    let result;
    if (purchaseOrder.quickbooksId) {
      // Update existing
      result = await service.updatePurchaseOrder(purchaseOrder);
    } else {
      // Create new
      result = await service.createPurchaseOrder(purchaseOrder);

      // Update our record with QuickBooks ID
      await PurchaseOrder.findByIdAndUpdate(req.params.poId, {
        $set: {
          quickbooksId: result.quickbooksId,
          quickbooksSyncedAt: new Date()
        }
      });
    }

    res.json({
      message: 'Purchase order synced to QuickBooks',
      quickbooksId: result.quickbooksId || purchaseOrder.quickbooksId
    });
  } catch (error) {
    console.error('Error syncing to QuickBooks:', error);
    res.status(500).json({ error: 'Failed to sync to QuickBooks' });
  }
});

/**
 * @route   POST /api/quickbooks/sync/bulk
 * @desc    Bulk sync purchase orders to QuickBooks
 * @access  Private
 */
router.post('/sync/bulk', authenticate, async (req: Request, res: Response) => {
  try {
    const { poIds } = req.body;
    const service = getQuickBooksService();

    if (!service.isAuthenticated()) {
      return res.status(401).json({ error: 'Not connected to QuickBooks' });
    }

    let purchaseOrders;
    if (poIds && Array.isArray(poIds) && poIds.length > 0) {
      purchaseOrders = await PurchaseOrder.find({ _id: { $in: poIds } });
    } else {
      // Sync all unsynced approved or ordered POs
      purchaseOrders = await PurchaseOrder.find({
        status: { $in: ['approved', 'ordered', 'partially_received', 'received'] },
        $or: [
          { quickbooksId: { $exists: false } },
          { quickbooksId: null }
        ]
      });
    }

    const result = await service.syncPurchaseOrders(purchaseOrders);

    // Update synced records
    for (const po of purchaseOrders) {
      if (!po.quickbooksId) {
        await PurchaseOrder.findByIdAndUpdate(po._id, {
          $set: {
            quickbooksSyncedAt: new Date()
          }
        });
      }
    }

    res.json({
      message: 'Bulk sync completed',
      ...result
    });
  } catch (error) {
    console.error('Error in bulk sync:', error);
    res.status(500).json({ error: 'Failed to perform bulk sync' });
  }
});

/**
 * @route   GET /api/quickbooks/purchase-orders
 * @desc    Get purchase orders from QuickBooks
 * @access  Private
 */
router.get('/purchase-orders', authenticate, async (req: Request, res: Response) => {
  try {
    const service = getQuickBooksService();

    if (!service.isAuthenticated()) {
      return res.status(401).json({ error: 'Not connected to QuickBooks' });
    }

    const { query } = req.query;

    const purchaseOrders = await service.queryPurchaseOrders(query as string);

    res.json({ purchaseOrders });
  } catch (error) {
    console.error('Error fetching QuickBooks purchase orders:', error);
    res.status(500).json({ error: 'Failed to fetch from QuickBooks' });
  }
});

/**
 * @route   DELETE /api/quickbooks/purchase-orders/:qbId
 * @desc    Delete a purchase order from QuickBooks
 * @access  Private
 */
router.delete('/purchase-orders/:qbId', authenticate, async (req: Request, res: Response) => {
  try {
    const service = getQuickBooksService();

    if (!service.isAuthenticated()) {
      return res.status(401).json({ error: 'Not connected to QuickBooks' });
    }

    await service.deletePurchaseOrder(req.params.qbId);

    // Also update local record to remove QuickBooks reference
    await PurchaseOrder.findOneAndUpdate(
      { quickbooksId: req.params.qbId },
      { $unset: { quickbooksId: 1, quickbooksSyncedAt: 1 } }
    );

    res.json({ message: 'Purchase order deleted from QuickBooks' });
  } catch (error) {
    console.error('Error deleting from QuickBooks:', error);
    res.status(500).json({ error: 'Failed to delete from QuickBooks' });
  }
});

export default router;
