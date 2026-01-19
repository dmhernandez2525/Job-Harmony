import { IPurchaseOrderLineItem, VendorType } from '../../models/PurchaseOrder';

/**
 * Vendor Product Search Result
 */
export interface VendorProductSearchResult {
  partNumber: string;
  vendorPartNumber: string;
  description: string;
  unitPrice: number;
  currency: string;
  availability: 'in_stock' | 'limited' | 'out_of_stock' | 'unknown';
  leadTime?: string;
  minimumQuantity?: number;
  category?: string;
  manufacturer?: string;
  imageUrl?: string;
  productUrl?: string;
}

/**
 * Vendor Order Status
 */
export interface VendorOrderStatus {
  vendorOrderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumbers?: string[];
  estimatedDelivery?: Date;
  lastUpdated: Date;
  items?: {
    partNumber: string;
    quantityOrdered: number;
    quantityShipped: number;
    status: string;
  }[];
}

/**
 * Vendor Order Request
 */
export interface VendorOrderRequest {
  items: {
    vendorPartNumber: string;
    quantity: number;
    description?: string;
  }[];
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  purchaseOrderNumber: string;
  notes?: string;
  requestedDeliveryDate?: Date;
}

/**
 * Vendor Order Response
 */
export interface VendorOrderResponse {
  success: boolean;
  vendorOrderNumber?: string;
  estimatedDelivery?: Date;
  orderTotal?: number;
  errors?: string[];
}

/**
 * Vendor Configuration
 */
export interface VendorConfig {
  apiKey?: string;
  apiSecret?: string;
  accountId?: string;
  baseUrl?: string;
  environment: 'sandbox' | 'production';
}

/**
 * Abstract Base Vendor Service
 * All vendor integrations should extend this class
 */
export abstract class BaseVendorService {
  protected config: VendorConfig;
  protected vendorType: VendorType;
  protected vendorName: string;

  constructor(vendorType: VendorType, vendorName: string, config: VendorConfig) {
    this.vendorType = vendorType;
    this.vendorName = vendorName;
    this.config = config;
  }

  /**
   * Get the vendor type
   */
  getVendorType(): VendorType {
    return this.vendorType;
  }

  /**
   * Get the vendor name
   */
  getVendorName(): string {
    return this.vendorName;
  }

  /**
   * Check if the service is properly configured
   */
  abstract isConfigured(): boolean;

  /**
   * Test the connection to the vendor API
   */
  abstract testConnection(): Promise<boolean>;

  /**
   * Search for products by keyword or part number
   */
  abstract searchProducts(query: string, options?: {
    category?: string;
    maxResults?: number;
    page?: number;
  }): Promise<VendorProductSearchResult[]>;

  /**
   * Get product details by vendor part number
   */
  abstract getProductDetails(vendorPartNumber: string): Promise<VendorProductSearchResult | null>;

  /**
   * Get real-time pricing for a list of items
   */
  abstract getPricing(items: { vendorPartNumber: string; quantity: number }[]): Promise<{
    vendorPartNumber: string;
    unitPrice: number;
    totalPrice: number;
    currency: string;
    availability: string;
  }[]>;

  /**
   * Submit an order to the vendor
   */
  abstract submitOrder(orderRequest: VendorOrderRequest): Promise<VendorOrderResponse>;

  /**
   * Get the status of an order
   */
  abstract getOrderStatus(vendorOrderNumber: string): Promise<VendorOrderStatus | null>;

  /**
   * Cancel an order (if supported)
   */
  abstract cancelOrder(vendorOrderNumber: string): Promise<{ success: boolean; message: string }>;

  /**
   * Convert vendor search result to internal line item format
   */
  convertToLineItem(product: VendorProductSearchResult, quantity: number, lineNumber: number): IPurchaseOrderLineItem {
    return {
      lineNumber,
      partNumber: product.partNumber,
      description: product.description,
      quantity,
      unitPrice: product.unitPrice,
      totalPrice: product.unitPrice * quantity,
      vendorPartNumber: product.vendorPartNumber,
      leadTime: product.leadTime,
      category: product.category
    };
  }

  /**
   * Log vendor operation (for debugging and auditing)
   */
  protected log(operation: string, details?: unknown): void {
    console.log(`[${this.vendorName}] ${operation}`, details ? JSON.stringify(details) : '');
  }
}

export default BaseVendorService;
