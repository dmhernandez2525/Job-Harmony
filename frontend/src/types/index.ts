// User and Session Types
export interface User {
  id: string;
  email: string;
  fName: string;
  lName: string;
  role: 'employer' | 'employee';
  zipCode: string;
  date?: string;
  resume?: Resume[];
  preference?: Preference;
  pendingOnePages?: string[];
}

export interface CurrentUser extends User {
  iat?: number;
  exp?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  fName: string;
  lName: string;
  password2: string;
  zipCode: string;
  role: string;
}

// Resume Types
export interface Resume {
  _id: string;
  userId: string;
  jobHistory: string;
  jobField: string;
  jobSkills: string;
}

export interface ResumeFormData {
  _id?: string;
  userId?: string;
  jobHistory: string;
  jobField: string;
  jobSkills: string;
}

// OnePage Types
export interface OnePage {
  _id: string;
  userId: string;
  companyName: string;
  position: string;
  jobField: string;
  jobSkills: string;
  description: string;
  location: string;
}

export interface OnePageFormData {
  _id?: string;
  userId?: string;
  companyName: string;
  position: string;
  jobField: string;
  jobSkills: string;
  description: string;
  location: string;
}

// Preference Types
export interface Preference {
  _id?: string;
  id?: string;
  userId: string;
  jobField: string;
  location: string;
  salary?: string;
}

export interface PreferenceFormData {
  id?: string;
  userId?: string;
  jobField: string;
  location: string;
  salary?: string;
}

// Like Types
export interface Like {
  _id: string;
  userId: string;
  onePageId: string;
  onePage?: OnePage;
}

// Redux State Types
export interface SessionState {
  isAuthenticated: boolean;
  isSignedIn?: boolean;
  user: CurrentUser | Record<string, never>;
  onePage?: OnePage;
}

export interface EntitiesState {
  users: Record<string, User>;
  resumes: Record<string, Resume>;
  onePages: Record<string, OnePage>;
  likes: Record<string, OnePage>;
  preferences: Preference | Record<string, never>;
}

export interface UIState {
  modal: ModalType | null;
  currentMain: {
    currentMain: OnePage | null;
  };
}

export interface ErrorsState {
  session: SessionErrors;
  resumes: string[];
  onePages: string[];
}

export interface SessionErrors {
  email?: string;
  password?: string;
  password2?: string;
  fName?: string;
  lName?: string;
  zipCode?: string;
  role?: string;
}

export interface RootState {
  entities: EntitiesState;
  session: SessionState;
  ui: UIState;
  errors: ErrorsState;
}

// Modal Types
export type ModalType = 'login' | 'signup' | 'resume' | 'onepage' | 'preferences' | null;

// Action Types
export interface Action<T = string, P = unknown> {
  type: T;
  payload?: P;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
}

export interface AuthResponse {
  success: boolean;
  token: string;
}

// Component Props Types
export interface WithRouterProps {
  router: {
    location: Location;
    navigate: (to: string) => void;
    params: Record<string, string>;
  };
}

// Purchase Order Types
export type PurchaseOrderStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'ordered'
  | 'partially_received'
  | 'received'
  | 'cancelled';

export type VendorType = 'amazon' | 'mcmaster-carr' | 'digikey' | 'cdw' | 'other';

export interface PurchaseOrderLineItem {
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

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PurchaseOrder {
  _id: string;
  poNumber: string;
  vendorName: string;
  vendorType: VendorType;
  vendorOrderNumber?: string;
  status: PurchaseOrderStatus;
  createdBy: User | string;
  approvedBy?: User | string;
  department?: string;
  projectCode?: string;
  lineItems: PurchaseOrderLineItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  notes?: string;
  shippingAddress?: ShippingAddress;
  quickbooksId?: string;
  quickbooksSyncedAt?: string;
  orderDate?: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  trackingNumbers?: string[];
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderFormData {
  vendorName: string;
  vendorType: VendorType;
  department?: string;
  projectCode?: string;
  lineItems: Omit<PurchaseOrderLineItem, 'lineNumber'>[];
  tax?: number;
  shipping?: number;
  notes?: string;
  shippingAddress?: ShippingAddress;
}

export interface PurchaseOrderFilter {
  status?: PurchaseOrderStatus | PurchaseOrderStatus[];
  vendorType?: VendorType | VendorType[];
  vendorName?: string;
  department?: string;
  projectCode?: string;
  minTotal?: number;
  maxTotal?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
  hasQuickbooksSync?: boolean;
}

export interface PurchaseOrderPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Vendor Product Types
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

// Analytics Types
export interface PurchaseOrderAnalytics {
  statusSummary: { _id: PurchaseOrderStatus; count: number; total: number }[];
  vendorSummary: { _id: VendorType; count: number; total: number }[];
  monthlySummary: { _id: { year: number; month: number }; count: number; total: number }[];
  totals: {
    totalOrders: number;
    totalValue: number;
    avgOrderValue: number;
  };
}

// QuickBooks Types
export interface QuickBooksStatus {
  isConnected: boolean;
  hasTokens: boolean;
  environment: 'sandbox' | 'production';
  companyInfo?: {
    companyName: string;
    companyId: string;
    country: string;
  };
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';
