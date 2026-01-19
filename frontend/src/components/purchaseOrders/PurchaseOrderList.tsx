import React, { useState, useEffect, useCallback } from 'react';
import type {
  PurchaseOrder,
  PurchaseOrderFilter,
  PurchaseOrderStatus,
  VendorType,
  PurchaseOrderPagination
} from '../../types';
import {
  fetchPurchaseOrders,
  bulkDeletePurchaseOrders,
  bulkUpdateStatus,
  bulkExportPurchaseOrders,
  exportToCSV,
  exportToExcel
} from '../../util/purchaseOrder_api_util';
import { useDebounce } from '../../hooks/useDebounce';
import { useIsMobile } from '../../hooks/useMediaQuery';

const statusLabels: Record<PurchaseOrderStatus, string> = {
  draft: 'Draft',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  ordered: 'Ordered',
  partially_received: 'Partially Received',
  received: 'Received',
  cancelled: 'Cancelled'
};

const statusBadgeClasses: Record<PurchaseOrderStatus, string> = {
  draft: 'badge-secondary',
  pending_approval: 'badge-warning',
  approved: 'badge-primary',
  ordered: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  partially_received: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  received: 'badge-success',
  cancelled: 'badge-danger'
};

const vendorLabels: Record<VendorType, string> = {
  amazon: 'Amazon',
  'mcmaster-carr': 'McMaster-Carr',
  digikey: 'DigiKey',
  cdw: 'CDW',
  other: 'Other'
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

interface PurchaseOrderListProps {
  onSelect?: (po: PurchaseOrder) => void;
  onEdit?: (po: PurchaseOrder) => void;
}

export const PurchaseOrderList: React.FC<PurchaseOrderListProps> = ({
  onSelect,
  onEdit
}) => {
  const isMobile = useIsMobile();

  // State
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [pagination, setPagination] = useState<PurchaseOrderPagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PurchaseOrderStatus | ''>('');
  const [vendorFilter, setVendorFilter] = useState<VendorType | ''>('');
  const [showFilters, setShowFilters] = useState(!isMobile);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Bulk action state
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Debounce search
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Build filter from state
  const buildFilter = useCallback((): PurchaseOrderFilter | undefined => {
    const filter: PurchaseOrderFilter = {};

    if (debouncedSearch) {
      filter.search = debouncedSearch;
    }
    if (statusFilter) {
      filter.status = statusFilter;
    }
    if (vendorFilter) {
      filter.vendorType = vendorFilter;
    }

    return Object.keys(filter).length > 0 ? filter : undefined;
  }, [debouncedSearch, statusFilter, vendorFilter]);

  // Load purchase orders
  const loadPurchaseOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const filter = buildFilter();
      const result = await fetchPurchaseOrders(filter, pagination.page, pagination.limit);
      setPurchaseOrders(result.purchaseOrders);
      setPagination(result.pagination);
    } catch (err) {
      setError('Failed to load purchase orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [buildFilter, pagination.page, pagination.limit]);

  useEffect(() => {
    loadPurchaseOrders();
  }, [loadPurchaseOrders]);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(purchaseOrders.map(po => po._id)));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
    setSelectAll(newSelected.size === purchaseOrders.length);
  };

  // Bulk action handlers
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedIds.size} purchase order(s)?`)) {
      return;
    }

    try {
      setBulkActionLoading(true);
      await bulkDeletePurchaseOrders(Array.from(selectedIds));
      setSelectedIds(new Set());
      setSelectAll(false);
      await loadPurchaseOrders();
    } catch (err) {
      alert('Failed to delete purchase orders');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkStatusUpdate = async (status: PurchaseOrderStatus) => {
    if (selectedIds.size === 0) return;

    try {
      setBulkActionLoading(true);
      await bulkUpdateStatus(Array.from(selectedIds), status);
      setSelectedIds(new Set());
      setSelectAll(false);
      await loadPurchaseOrders();
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'excel') => {
    try {
      setBulkActionLoading(true);
      const ids = selectedIds.size > 0 ? Array.from(selectedIds) : undefined;
      const result = await bulkExportPurchaseOrders(ids, format === 'csv' ? 'csv' : 'json');

      const filename = `purchase-orders-${new Date().toISOString().split('T')[0]}`;

      if (format === 'csv') {
        exportToCSV(result.data as Record<string, unknown>[], `${filename}.csv`);
      } else {
        await exportToExcel(result.data as Record<string, unknown>[], filename);
      }
    } catch (err) {
      alert('Failed to export purchase orders');
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Render mobile card view
  const renderMobileCard = (po: PurchaseOrder) => (
    <div
      key={po._id}
      className="card mb-3"
      onClick={() => onSelect?.(po)}
    >
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedIds.has(po._id)}
              onChange={(e) => {
                e.stopPropagation();
                handleSelectOne(po._id);
              }}
              className="w-5 h-5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <p className="font-semibold text-secondary-900 dark:text-white">
                {po.poNumber}
              </p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                {po.vendorName}
              </p>
            </div>
          </div>
          <span className={`badge ${statusBadgeClasses[po.status]}`}>
            {statusLabels[po.status]}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-secondary-500 dark:text-secondary-400">Total</p>
            <p className="font-medium text-secondary-900 dark:text-white">
              {formatCurrency(po.total)}
            </p>
          </div>
          <div>
            <p className="text-secondary-500 dark:text-secondary-400">Items</p>
            <p className="font-medium text-secondary-900 dark:text-white">
              {po.lineItems.length}
            </p>
          </div>
          <div>
            <p className="text-secondary-500 dark:text-secondary-400">Created</p>
            <p className="font-medium text-secondary-900 dark:text-white">
              {formatDate(po.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-secondary-500 dark:text-secondary-400">Vendor</p>
            <p className="font-medium text-secondary-900 dark:text-white">
              {vendorLabels[po.vendorType]}
            </p>
          </div>
        </div>

        {onEdit && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(po);
              }}
              className="btn-ghost btn-sm"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search purchase orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Filter Toggle (Mobile) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary sm:hidden"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </button>

        {/* Desktop Filters */}
        <div className={`flex flex-col sm:flex-row gap-2 ${showFilters ? 'block' : 'hidden sm:flex'}`}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PurchaseOrderStatus | '')}
            className="select"
          >
            <option value="">All Statuses</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <select
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value as VendorType | '')}
            className="select"
          >
            <option value="">All Vendors</option>
            {Object.entries(vendorLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
            {selectedIds.size} selected
          </span>
          <div className="flex flex-wrap gap-2 ml-auto">
            <button
              onClick={() => handleExport('csv')}
              disabled={bulkActionLoading}
              className="btn-secondary btn-sm"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExport('excel')}
              disabled={bulkActionLoading}
              className="btn-secondary btn-sm"
            >
              Export Excel
            </button>
            <div className="relative">
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                disabled={bulkActionLoading}
                className="btn-secondary btn-sm"
              >
                Change Status
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showBulkActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary-800 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 z-10">
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => {
                        handleBulkStatusUpdate(value as PurchaseOrderStatus);
                        setShowBulkActions(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-secondary-100 dark:hover:bg-secondary-700"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleBulkDelete}
              disabled={bulkActionLoading}
              className="btn-danger btn-sm"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-danger">
          {error}
          <button onClick={loadPurchaseOrders} className="ml-2 underline">
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && purchaseOrders.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-secondary-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-secondary-900 dark:text-white">
            No purchase orders
          </h3>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            Get started by creating a new purchase order.
          </p>
        </div>
      )}

      {/* Content */}
      {!loading && !error && purchaseOrders.length > 0 && (
        <>
          {/* Mobile View */}
          {isMobile ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-5 h-5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-secondary-500 dark:text-secondary-400">
                  Select all
                </span>
              </div>
              {purchaseOrders.map(renderMobileCard)}
            </div>
          ) : (
            /* Desktop Table View */
            <div className="table-container card">
              <table className="table">
                <thead>
                  <tr>
                    <th className="w-12">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                      />
                    </th>
                    <th>PO Number</th>
                    <th>Vendor</th>
                    <th>Status</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Created</th>
                    <th className="w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrders.map(po => (
                    <tr
                      key={po._id}
                      className="cursor-pointer"
                      onClick={() => onSelect?.(po)}
                    >
                      <td onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(po._id)}
                          onChange={() => handleSelectOne(po._id)}
                          className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      <td className="font-medium text-secondary-900 dark:text-white">
                        {po.poNumber}
                      </td>
                      <td>
                        <div>
                          <p className="text-secondary-900 dark:text-white">{po.vendorName}</p>
                          <p className="text-xs text-secondary-500">{vendorLabels[po.vendorType]}</p>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${statusBadgeClasses[po.status]}`}>
                          {statusLabels[po.status]}
                        </span>
                      </td>
                      <td>{po.lineItems.length}</td>
                      <td className="font-medium">{formatCurrency(po.total)}</td>
                      <td className="text-secondary-500 dark:text-secondary-400">
                        {formatDate(po.createdAt)}
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        {onEdit && (
                          <button
                            onClick={() => onEdit(po)}
                            className="btn-ghost btn-sm"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} results
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="btn-secondary btn-sm"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  let pageNum;
                  if (pagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`btn-sm ${
                        pageNum === pagination.page
                          ? 'btn-primary'
                          : 'btn-secondary'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="btn-secondary btn-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PurchaseOrderList;
