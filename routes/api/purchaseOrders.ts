import express, { Request, Response, Router } from 'express';
import passport from 'passport';
import PurchaseOrder, {
  IPurchaseOrder,
  PurchaseOrderStatus,
  VendorType
} from '../../models/PurchaseOrder';
import { AuthenticatedRequest } from '../../types';
import { getVendorService } from '../../services/vendors';

const router: Router = express.Router();

// Middleware for authentication
const authenticate = passport.authenticate('jwt', { session: false });

// Helper to cast request to AuthenticatedRequest
const getAuthReq = (req: Request): AuthenticatedRequest => req as AuthenticatedRequest;

/**
 * Advanced filtering interface
 */
interface PurchaseOrderFilter {
  status?: PurchaseOrderStatus | PurchaseOrderStatus[];
  vendorType?: VendorType | VendorType[];
  vendorName?: string;
  createdBy?: string;
  department?: string;
  projectCode?: string;
  minTotal?: number;
  maxTotal?: number;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  hasQuickbooksSync?: boolean;
}

/**
 * Build MongoDB query from filter parameters
 */
function buildFilterQuery(filter: PurchaseOrderFilter) {
  const query: Record<string, unknown> = {};

  // Status filter (can be single or array)
  if (filter.status) {
    if (Array.isArray(filter.status)) {
      query.status = { $in: filter.status };
    } else {
      query.status = filter.status;
    }
  }

  // Vendor type filter
  if (filter.vendorType) {
    if (Array.isArray(filter.vendorType)) {
      query.vendorType = { $in: filter.vendorType };
    } else {
      query.vendorType = filter.vendorType;
    }
  }

  // Vendor name (case-insensitive partial match)
  if (filter.vendorName) {
    query.vendorName = { $regex: filter.vendorName, $options: 'i' };
  }

  // Created by user
  if (filter.createdBy) {
    query.createdBy = filter.createdBy;
  }

  // Department
  if (filter.department) {
    query.department = { $regex: filter.department, $options: 'i' };
  }

  // Project code
  if (filter.projectCode) {
    query.projectCode = { $regex: filter.projectCode, $options: 'i' };
  }

  // Total amount range
  if (filter.minTotal !== undefined || filter.maxTotal !== undefined) {
    query.total = {};
    if (filter.minTotal !== undefined) {
      (query.total as Record<string, number>).$gte = filter.minTotal;
    }
    if (filter.maxTotal !== undefined) {
      (query.total as Record<string, number>).$lte = filter.maxTotal;
    }
  }

  // Date range
  if (filter.startDate || filter.endDate) {
    query.createdAt = {};
    if (filter.startDate) {
      (query.createdAt as Record<string, Date>).$gte = filter.startDate;
    }
    if (filter.endDate) {
      (query.createdAt as Record<string, Date>).$lte = filter.endDate;
    }
  }

  // QuickBooks sync status
  if (filter.hasQuickbooksSync !== undefined) {
    if (filter.hasQuickbooksSync) {
      query.quickbooksId = { $exists: true, $ne: null };
    } else {
      query.quickbooksId = { $exists: false };
    }
  }

  // Full-text search
  if (filter.search) {
    query.$text = { $search: filter.search };
  }

  return query;
}

/**
 * @route   GET /api/purchase-orders
 * @desc    Get all purchase orders with advanced filtering
 * @access  Private
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const {
      status,
      vendorType,
      vendorName,
      department,
      projectCode,
      minTotal,
      maxTotal,
      startDate,
      endDate,
      search,
      hasQuickbooksSync,
      page = '1',
      limit = '20',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter: PurchaseOrderFilter = {};

    if (status) {
      filter.status = Array.isArray(status)
        ? status as PurchaseOrderStatus[]
        : status as PurchaseOrderStatus;
    }

    if (vendorType) {
      filter.vendorType = Array.isArray(vendorType)
        ? vendorType as VendorType[]
        : vendorType as VendorType;
    }

    if (vendorName) filter.vendorName = vendorName as string;
    if (department) filter.department = department as string;
    if (projectCode) filter.projectCode = projectCode as string;
    if (minTotal) filter.minTotal = parseFloat(minTotal as string);
    if (maxTotal) filter.maxTotal = parseFloat(maxTotal as string);
    if (startDate) filter.startDate = new Date(startDate as string);
    if (endDate) filter.endDate = new Date(endDate as string);
    if (search) filter.search = search as string;
    if (hasQuickbooksSync !== undefined) {
      filter.hasQuickbooksSync = hasQuickbooksSync === 'true';
    }

    // Build query
    const query = buildFilterQuery(filter);

    // Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [purchaseOrders, total] = await Promise.all([
      PurchaseOrder.find(query)
        .populate('createdBy', 'fName lName email')
        .populate('approvedBy', 'fName lName email')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      PurchaseOrder.countDocuments(query)
    ]);

    res.json({
      purchaseOrders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({ error: 'Failed to fetch purchase orders' });
  }
});

/**
 * @route   GET /api/purchase-orders/:id
 * @desc    Get a single purchase order by ID
 * @access  Private
 */
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id)
      .populate('createdBy', 'fName lName email')
      .populate('approvedBy', 'fName lName email');

    if (!purchaseOrder) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    res.json(purchaseOrder);
  } catch (error) {
    console.error('Error fetching purchase order:', error);
    res.status(500).json({ error: 'Failed to fetch purchase order' });
  }
});

/**
 * @route   POST /api/purchase-orders
 * @desc    Create a new purchase order
 * @access  Private
 */
router.post('/', authenticate, async (req: Request, res: Response) => {
  const authReq = getAuthReq(req);
  try {
    const {
      vendorName,
      vendorType,
      department,
      projectCode,
      lineItems,
      notes,
      shippingAddress
    } = req.body;

    // Calculate totals
    const subtotal = lineItems.reduce((sum: number, item: { totalPrice: number }) => sum + item.totalPrice, 0);
    const tax = parseFloat(req.body.tax) || 0;
    const shipping = parseFloat(req.body.shipping) || 0;
    const total = subtotal + tax + shipping;

    const purchaseOrder = new PurchaseOrder({
      vendorName,
      vendorType: vendorType || 'other',
      createdBy: authReq.user!._id,
      department,
      projectCode,
      lineItems: lineItems.map((item: Record<string, unknown>, index: number) => ({
        ...item,
        lineNumber: index + 1
      })),
      subtotal,
      tax,
      shipping,
      total,
      notes,
      shippingAddress,
      status: 'draft'
    });

    await purchaseOrder.save();

    const populated = await PurchaseOrder.findById(purchaseOrder._id)
      .populate('createdBy', 'fName lName email');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Error creating purchase order:', error);
    res.status(500).json({ error: 'Failed to create purchase order' });
  }
});

/**
 * @route   PUT /api/purchase-orders/:id
 * @desc    Update a purchase order
 * @access  Private
 */
router.put('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id);

    if (!purchaseOrder) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    // Only allow updates to drafts and pending approval
    if (!['draft', 'pending_approval'].includes(purchaseOrder.status)) {
      return res.status(400).json({
        error: 'Cannot modify purchase order with status: ' + purchaseOrder.status
      });
    }

    const updates = req.body;

    // Recalculate totals if line items changed
    if (updates.lineItems) {
      updates.subtotal = updates.lineItems.reduce(
        (sum: number, item: { totalPrice: number }) => sum + item.totalPrice,
        0
      );
      updates.total = updates.subtotal + (updates.tax || purchaseOrder.tax) + (updates.shipping || purchaseOrder.shipping);
    }

    const updated = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('createdBy', 'fName lName email')
     .populate('approvedBy', 'fName lName email');

    res.json(updated);
  } catch (error) {
    console.error('Error updating purchase order:', error);
    res.status(500).json({ error: 'Failed to update purchase order' });
  }
});

/**
 * @route   PATCH /api/purchase-orders/:id/status
 * @desc    Update purchase order status
 * @access  Private
 */
router.patch('/:id/status', authenticate, async (req: Request, res: Response) => {
  const authReq = getAuthReq(req);
  try {
    const { status } = req.body;
    const purchaseOrder = await PurchaseOrder.findById(req.params.id);

    if (!purchaseOrder) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    // Validate status transitions
    const validTransitions: Record<PurchaseOrderStatus, PurchaseOrderStatus[]> = {
      draft: ['pending_approval', 'cancelled'],
      pending_approval: ['approved', 'draft', 'cancelled'],
      approved: ['ordered', 'cancelled'],
      ordered: ['partially_received', 'received', 'cancelled'],
      partially_received: ['received', 'cancelled'],
      received: [],
      cancelled: []
    };

    if (!validTransitions[purchaseOrder.status].includes(status)) {
      return res.status(400).json({
        error: `Cannot transition from ${purchaseOrder.status} to ${status}`
      });
    }

    // Set approved by if transitioning to approved
    const updateData: Record<string, unknown> = { status };
    if (status === 'approved') {
      updateData.approvedBy = authReq.user!._id;
    }
    if (status === 'ordered') {
      updateData.orderDate = new Date();
    }
    if (status === 'received') {
      updateData.actualDeliveryDate = new Date();
    }

    const updated = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).populate('createdBy', 'fName lName email')
     .populate('approvedBy', 'fName lName email');

    res.json(updated);
  } catch (error) {
    console.error('Error updating purchase order status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

/**
 * @route   DELETE /api/purchase-orders/:id
 * @desc    Delete a purchase order (only drafts)
 * @access  Private
 */
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id);

    if (!purchaseOrder) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    if (purchaseOrder.status !== 'draft') {
      return res.status(400).json({
        error: 'Only draft purchase orders can be deleted'
      });
    }

    await PurchaseOrder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Purchase order deleted successfully' });
  } catch (error) {
    console.error('Error deleting purchase order:', error);
    res.status(500).json({ error: 'Failed to delete purchase order' });
  }
});

// ==================== BULK OPERATIONS ====================

/**
 * @route   POST /api/purchase-orders/bulk/edit
 * @desc    Bulk edit multiple purchase orders
 * @access  Private
 */
router.post('/bulk/edit', authenticate, async (req: Request, res: Response) => {
  try {
    const { ids, updates } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No purchase order IDs provided' });
    }

    // Fetch all POs to validate
    const purchaseOrders = await PurchaseOrder.find({ _id: { $in: ids } });

    // Check if all are in editable state
    const nonEditable = purchaseOrders.filter(
      po => !['draft', 'pending_approval'].includes(po.status)
    );

    if (nonEditable.length > 0) {
      return res.status(400).json({
        error: 'Some purchase orders cannot be edited',
        nonEditableIds: nonEditable.map(po => po._id)
      });
    }

    // Perform bulk update
    const result = await PurchaseOrder.updateMany(
      { _id: { $in: ids } },
      { $set: updates }
    );

    res.json({
      message: 'Bulk update successful',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error in bulk edit:', error);
    res.status(500).json({ error: 'Failed to perform bulk edit' });
  }
});

/**
 * @route   POST /api/purchase-orders/bulk/delete
 * @desc    Bulk delete multiple purchase orders
 * @access  Private
 */
router.post('/bulk/delete', authenticate, async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No purchase order IDs provided' });
    }

    // Only delete drafts
    const result = await PurchaseOrder.deleteMany({
      _id: { $in: ids },
      status: 'draft'
    });

    res.json({
      message: 'Bulk delete successful',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error in bulk delete:', error);
    res.status(500).json({ error: 'Failed to perform bulk delete' });
  }
});

/**
 * @route   POST /api/purchase-orders/bulk/status
 * @desc    Bulk update status for multiple purchase orders
 * @access  Private
 */
router.post('/bulk/status', authenticate, async (req: Request, res: Response) => {
  const authReq = getAuthReq(req);
  try {
    const { ids, status } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No purchase order IDs provided' });
    }

    // Update all with the new status
    const updateData: Record<string, unknown> = { status };
    if (status === 'approved') {
      updateData.approvedBy = authReq.user!._id;
    }

    const result = await PurchaseOrder.updateMany(
      { _id: { $in: ids } },
      { $set: updateData }
    );

    res.json({
      message: 'Bulk status update successful',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error in bulk status update:', error);
    res.status(500).json({ error: 'Failed to perform bulk status update' });
  }
});

/**
 * @route   POST /api/purchase-orders/bulk/export
 * @desc    Export multiple purchase orders
 * @access  Private
 */
router.post('/bulk/export', authenticate, async (req: Request, res: Response) => {
  try {
    const { ids, format = 'json' } = req.body;

    let query = {};
    if (ids && Array.isArray(ids) && ids.length > 0) {
      query = { _id: { $in: ids } };
    }

    const purchaseOrders = await PurchaseOrder.find(query)
      .populate('createdBy', 'fName lName email')
      .populate('approvedBy', 'fName lName email')
      .lean();

    if (format === 'csv') {
      // Return data suitable for CSV conversion on frontend
      const csvData = purchaseOrders.map(po => ({
        poNumber: po.poNumber,
        vendorName: po.vendorName,
        vendorType: po.vendorType,
        status: po.status,
        department: po.department || '',
        projectCode: po.projectCode || '',
        subtotal: po.subtotal,
        tax: po.tax,
        shipping: po.shipping,
        total: po.total,
        orderDate: po.orderDate?.toISOString() || '',
        createdAt: po.createdAt.toISOString(),
        lineItemCount: po.lineItems.length
      }));

      res.json({ format: 'csv', data: csvData });
    } else {
      res.json({ format: 'json', data: purchaseOrders });
    }
  } catch (error) {
    console.error('Error in bulk export:', error);
    res.status(500).json({ error: 'Failed to export purchase orders' });
  }
});

// ==================== VENDOR INTEGRATION ====================

/**
 * @route   GET /api/purchase-orders/vendors/search
 * @desc    Search products across vendors
 * @access  Private
 */
router.get('/vendors/search', authenticate, async (req: Request, res: Response) => {
  try {
    const { query, vendorType, maxResults = '10' } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const service = getVendorService(vendorType as VendorType);

    if (!service) {
      return res.status(400).json({ error: 'Invalid or unsupported vendor type' });
    }

    const results = await service.searchProducts(query as string, {
      maxResults: parseInt(maxResults as string, 10)
    });

    res.json({
      vendorType,
      results
    });
  } catch (error) {
    console.error('Error searching vendor products:', error);
    res.status(500).json({ error: 'Failed to search vendor products' });
  }
});

/**
 * @route   GET /api/purchase-orders/vendors/pricing
 * @desc    Get pricing from vendor
 * @access  Private
 */
router.post('/vendors/pricing', authenticate, async (req: Request, res: Response) => {
  try {
    const { vendorType, items } = req.body;

    if (!vendorType || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Vendor type and items are required' });
    }

    const service = getVendorService(vendorType as VendorType);

    if (!service) {
      return res.status(400).json({ error: 'Invalid or unsupported vendor type' });
    }

    const pricing = await service.getPricing(items);

    res.json({
      vendorType,
      pricing
    });
  } catch (error) {
    console.error('Error getting vendor pricing:', error);
    res.status(500).json({ error: 'Failed to get vendor pricing' });
  }
});

/**
 * @route   GET /api/purchase-orders/analytics
 * @desc    Get purchase order analytics
 * @access  Private
 */
router.get('/analytics', authenticate, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter: Record<string, Date> = {};
    if (startDate) dateFilter.$gte = new Date(startDate as string);
    if (endDate) dateFilter.$lte = new Date(endDate as string);

    const matchStage: Record<string, unknown> = {};
    if (Object.keys(dateFilter).length > 0) {
      matchStage.createdAt = dateFilter;
    }

    const [
      statusSummary,
      vendorSummary,
      monthlySummary,
      totals
    ] = await Promise.all([
      // Status summary
      PurchaseOrder.aggregate([
        { $match: matchStage },
        { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$total' } } }
      ]),

      // Vendor summary
      PurchaseOrder.aggregate([
        { $match: matchStage },
        { $group: { _id: '$vendorType', count: { $sum: 1 }, total: { $sum: '$total' } } },
        { $sort: { total: -1 } }
      ]),

      // Monthly summary
      PurchaseOrder.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 },
            total: { $sum: '$total' }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ]),

      // Overall totals
      PurchaseOrder.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalValue: { $sum: '$total' },
            avgOrderValue: { $avg: '$total' }
          }
        }
      ])
    ]);

    res.json({
      statusSummary,
      vendorSummary,
      monthlySummary,
      totals: totals[0] || { totalOrders: 0, totalValue: 0, avgOrderValue: 0 }
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

export default router;
