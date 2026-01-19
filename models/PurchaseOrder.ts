import mongoose, { Schema, Model, Document, Types } from 'mongoose';

// Purchase Order Line Item Interface
export interface IPurchaseOrderLineItem {
  lineNumber: number;
  partNumber: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  vendorPartNumber?: string;
  leadTime?: string;
  category?: string;
}

// Purchase Order Status Type
export type PurchaseOrderStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'ordered'
  | 'partially_received'
  | 'received'
  | 'cancelled';

// Vendor Type
export type VendorType = 'amazon' | 'mcmaster-carr' | 'digikey' | 'cdw' | 'other';

// Purchase Order Document Interface
export interface IPurchaseOrder extends Document {
  _id: Types.ObjectId;
  poNumber: string;
  vendorName: string;
  vendorType: VendorType;
  vendorOrderNumber?: string;
  status: PurchaseOrderStatus;
  createdBy: Types.ObjectId;
  approvedBy?: Types.ObjectId;
  department?: string;
  projectCode?: string;
  lineItems: IPurchaseOrderLineItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  notes?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  quickbooksId?: string;
  quickbooksSyncedAt?: Date;
  orderDate?: Date;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  trackingNumbers?: string[];
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Line Item Schema
const LineItemSchema = new Schema<IPurchaseOrderLineItem>({
  lineNumber: {
    type: Number,
    required: true
  },
  partNumber: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  vendorPartNumber: {
    type: String
  },
  leadTime: {
    type: String
  },
  category: {
    type: String
  }
});

// Shipping Address Schema
const ShippingAddressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, default: 'USA' }
});

// Purchase Order Schema
const PurchaseOrderSchema = new Schema<IPurchaseOrder>(
  {
    poNumber: {
      type: String,
      required: true,
      unique: true
    },
    vendorName: {
      type: String,
      required: true
    },
    vendorType: {
      type: String,
      enum: ['amazon', 'mcmaster-carr', 'digikey', 'cdw', 'other'],
      default: 'other'
    },
    vendorOrderNumber: {
      type: String
    },
    status: {
      type: String,
      enum: ['draft', 'pending_approval', 'approved', 'ordered', 'partially_received', 'received', 'cancelled'],
      default: 'draft'
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    department: {
      type: String
    },
    projectCode: {
      type: String
    },
    lineItems: {
      type: [LineItemSchema],
      required: true,
      validate: {
        validator: function(items: IPurchaseOrderLineItem[]) {
          return items && items.length > 0;
        },
        message: 'At least one line item is required'
      }
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    shipping: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    notes: {
      type: String
    },
    shippingAddress: {
      type: ShippingAddressSchema
    },
    quickbooksId: {
      type: String
    },
    quickbooksSyncedAt: {
      type: Date
    },
    orderDate: {
      type: Date
    },
    expectedDeliveryDate: {
      type: Date
    },
    actualDeliveryDate: {
      type: Date
    },
    trackingNumbers: {
      type: [String],
      default: []
    },
    attachments: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Indexes for efficient querying
PurchaseOrderSchema.index({ status: 1 });
PurchaseOrderSchema.index({ vendorType: 1 });
PurchaseOrderSchema.index({ createdBy: 1 });
PurchaseOrderSchema.index({ createdAt: -1 });
PurchaseOrderSchema.index({ poNumber: 'text', vendorName: 'text', 'lineItems.description': 'text' });

// Pre-save hook to generate PO number
PurchaseOrderSchema.pre('save', async function(next) {
  if (!this.poNumber) {
    const count = await PurchaseOrder.countDocuments();
    const year = new Date().getFullYear();
    this.poNumber = `PO-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

const PurchaseOrder: Model<IPurchaseOrder> = mongoose.model<IPurchaseOrder>('purchaseorders', PurchaseOrderSchema);

export default PurchaseOrder;
