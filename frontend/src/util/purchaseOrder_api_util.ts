import axios from 'axios';
import type {
  PurchaseOrder,
  PurchaseOrderFormData,
  PurchaseOrderFilter,
  PurchaseOrderPagination,
  PurchaseOrderAnalytics,
  PurchaseOrderStatus,
  VendorType,
  VendorProductSearchResult,
  QuickBooksStatus
} from '../types';

const API_BASE = '/api/purchase-orders';
const QUICKBOOKS_BASE = '/api/quickbooks';

// Purchase Order CRUD Operations

export const fetchPurchaseOrders = async (
  filter?: PurchaseOrderFilter,
  page = 1,
  limit = 20,
  sortBy = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<{ purchaseOrders: PurchaseOrder[]; pagination: PurchaseOrderPagination }> => {
  const params = new URLSearchParams();

  params.append('page', String(page));
  params.append('limit', String(limit));
  params.append('sortBy', sortBy);
  params.append('sortOrder', sortOrder);

  if (filter) {
    if (filter.status) {
      const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
      statuses.forEach(s => params.append('status', s));
    }
    if (filter.vendorType) {
      const types = Array.isArray(filter.vendorType) ? filter.vendorType : [filter.vendorType];
      types.forEach(t => params.append('vendorType', t));
    }
    if (filter.vendorName) params.append('vendorName', filter.vendorName);
    if (filter.department) params.append('department', filter.department);
    if (filter.projectCode) params.append('projectCode', filter.projectCode);
    if (filter.minTotal !== undefined) params.append('minTotal', String(filter.minTotal));
    if (filter.maxTotal !== undefined) params.append('maxTotal', String(filter.maxTotal));
    if (filter.startDate) params.append('startDate', filter.startDate);
    if (filter.endDate) params.append('endDate', filter.endDate);
    if (filter.search) params.append('search', filter.search);
    if (filter.hasQuickbooksSync !== undefined) {
      params.append('hasQuickbooksSync', String(filter.hasQuickbooksSync));
    }
  }

  const response = await axios.get(`${API_BASE}?${params.toString()}`);
  return response.data;
};

export const fetchPurchaseOrder = async (id: string): Promise<PurchaseOrder> => {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
};

export const createPurchaseOrder = async (
  data: PurchaseOrderFormData
): Promise<PurchaseOrder> => {
  const response = await axios.post(API_BASE, data);
  return response.data;
};

export const updatePurchaseOrder = async (
  id: string,
  data: Partial<PurchaseOrderFormData>
): Promise<PurchaseOrder> => {
  const response = await axios.put(`${API_BASE}/${id}`, data);
  return response.data;
};

export const updatePurchaseOrderStatus = async (
  id: string,
  status: PurchaseOrderStatus
): Promise<PurchaseOrder> => {
  const response = await axios.patch(`${API_BASE}/${id}/status`, { status });
  return response.data;
};

export const deletePurchaseOrder = async (id: string): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_BASE}/${id}`);
  return response.data;
};

// Bulk Operations

export const bulkEditPurchaseOrders = async (
  ids: string[],
  updates: Partial<PurchaseOrderFormData>
): Promise<{ message: string; modifiedCount: number }> => {
  const response = await axios.post(`${API_BASE}/bulk/edit`, { ids, updates });
  return response.data;
};

export const bulkDeletePurchaseOrders = async (
  ids: string[]
): Promise<{ message: string; deletedCount: number }> => {
  const response = await axios.post(`${API_BASE}/bulk/delete`, { ids });
  return response.data;
};

export const bulkUpdateStatus = async (
  ids: string[],
  status: PurchaseOrderStatus
): Promise<{ message: string; modifiedCount: number }> => {
  const response = await axios.post(`${API_BASE}/bulk/status`, { ids, status });
  return response.data;
};

export const bulkExportPurchaseOrders = async (
  ids?: string[],
  format: 'json' | 'csv' = 'json'
): Promise<{ format: string; data: PurchaseOrder[] | Record<string, unknown>[] }> => {
  const response = await axios.post(`${API_BASE}/bulk/export`, { ids, format });
  return response.data;
};

// Vendor Operations

export const searchVendorProducts = async (
  vendorType: VendorType,
  query: string,
  maxResults = 10
): Promise<{ vendorType: VendorType; results: VendorProductSearchResult[] }> => {
  const params = new URLSearchParams({
    vendorType,
    query,
    maxResults: String(maxResults)
  });
  const response = await axios.get(`${API_BASE}/vendors/search?${params.toString()}`);
  return response.data;
};

export const getVendorPricing = async (
  vendorType: VendorType,
  items: { vendorPartNumber: string; quantity: number }[]
): Promise<{
  vendorType: VendorType;
  pricing: {
    vendorPartNumber: string;
    unitPrice: number;
    totalPrice: number;
    currency: string;
    availability: string;
  }[];
}> => {
  const response = await axios.post(`${API_BASE}/vendors/pricing`, { vendorType, items });
  return response.data;
};

// Analytics

export const fetchPurchaseOrderAnalytics = async (
  startDate?: string,
  endDate?: string
): Promise<PurchaseOrderAnalytics> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await axios.get(
    `${API_BASE}/analytics${params.toString() ? '?' + params.toString() : ''}`
  );
  return response.data;
};

// QuickBooks Integration

export const getQuickBooksStatus = async (): Promise<QuickBooksStatus> => {
  const response = await axios.get(`${QUICKBOOKS_BASE}/status`);
  return response.data;
};

export const getQuickBooksAuthUrl = async (): Promise<{
  authorizationUrl: string;
  state: string;
}> => {
  const response = await axios.get(`${QUICKBOOKS_BASE}/authorize`);
  return response.data;
};

export const disconnectQuickBooks = async (): Promise<{ message: string }> => {
  const response = await axios.post(`${QUICKBOOKS_BASE}/disconnect`);
  return response.data;
};

export const syncToQuickBooks = async (
  poId: string
): Promise<{ message: string; quickbooksId: string }> => {
  const response = await axios.post(`${QUICKBOOKS_BASE}/sync/${poId}`);
  return response.data;
};

export const bulkSyncToQuickBooks = async (
  poIds?: string[]
): Promise<{ message: string; synced: number; failed: number; errors: string[] }> => {
  const response = await axios.post(`${QUICKBOOKS_BASE}/sync/bulk`, { poIds });
  return response.data;
};

// Export Utilities

export const exportToCSV = (data: Record<string, unknown>[], filename: string): void => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const cell = row[header];
        const value = cell === null || cell === undefined ? '' : String(cell);
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = async (
  data: Record<string, unknown>[],
  filename: string
): Promise<void> => {
  // For Excel export, we'll create a simple HTML table that Excel can read
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);

  const tableHTML = `
    <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body>
        <table border="1">
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(row =>
              `<tr>${headers.map(h => `<td>${row[h] ?? ''}</td>`).join('')}</tr>`
            ).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob([tableHTML], {
    type: 'application/vnd.ms-excel;charset=utf-8;'
  });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.xls') ? filename : `${filename}.xls`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
