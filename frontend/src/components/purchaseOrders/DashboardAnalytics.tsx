import React, { useState, useEffect } from 'react';
import type { PurchaseOrderAnalytics, PurchaseOrderStatus, VendorType } from '../../types';
import { fetchPurchaseOrderAnalytics } from '../../util/purchaseOrder_api_util';

interface DashboardAnalyticsProps {
  startDate?: string;
  endDate?: string;
}

const statusLabels: Record<PurchaseOrderStatus, string> = {
  draft: 'Draft',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  ordered: 'Ordered',
  partially_received: 'Partially Received',
  received: 'Received',
  cancelled: 'Cancelled'
};

const statusColors: Record<PurchaseOrderStatus, string> = {
  draft: 'bg-secondary-400',
  pending_approval: 'bg-yellow-500',
  approved: 'bg-blue-500',
  ordered: 'bg-purple-500',
  partially_received: 'bg-orange-500',
  received: 'bg-green-500',
  cancelled: 'bg-red-500'
};

const vendorLabels: Record<VendorType, string> = {
  amazon: 'Amazon Business',
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

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  startDate,
  endDate
}) => {
  const [analytics, setAnalytics] = useState<PurchaseOrderAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPurchaseOrderAnalytics(startDate, endDate);
        setAnalytics(data);
      } catch (err) {
        setError('Failed to load analytics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [startDate, endDate]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-secondary-200 dark:bg-secondary-700 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-secondary-200 dark:bg-secondary-700 rounded-xl" />
          <div className="h-64 bg-secondary-200 dark:bg-secondary-700 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const maxStatusTotal = Math.max(...analytics.statusSummary.map(s => s.total), 1);
  const maxVendorTotal = Math.max(...analytics.vendorSummary.map(v => v.total), 1);
  const maxMonthlyTotal = Math.max(...analytics.monthlySummary.map(m => m.total), 1);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Orders Card */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                  Total Orders
                </p>
                <p className="text-2xl md:text-3xl font-bold text-secondary-900 dark:text-white mt-1">
                  {formatNumber(analytics.totals.totalOrders)}
                </p>
              </div>
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Total Value Card */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                  Total Value
                </p>
                <p className="text-2xl md:text-3xl font-bold text-secondary-900 dark:text-white mt-1">
                  {formatCurrency(analytics.totals.totalValue)}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Average Order Value Card */}
        <div className="card sm:col-span-2 lg:col-span-1">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                  Average Order Value
                </p>
                <p className="text-2xl md:text-3xl font-bold text-secondary-900 dark:text-white mt-1">
                  {formatCurrency(analytics.totals.avgOrderValue)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Orders by Status
            </h3>
          </div>
          <div className="card-body space-y-4">
            {analytics.statusSummary.length === 0 ? (
              <p className="text-secondary-500 dark:text-secondary-400 text-center py-4">
                No data available
              </p>
            ) : (
              analytics.statusSummary.map(item => (
                <div key={item._id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      {statusLabels[item._id]}
                    </span>
                    <span className="text-sm text-secondary-500 dark:text-secondary-400">
                      {item.count} orders ({formatCurrency(item.total)})
                    </span>
                  </div>
                  <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${statusColors[item._id]}`}
                      style={{ width: `${(item.total / maxStatusTotal) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Vendor Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Orders by Vendor
            </h3>
          </div>
          <div className="card-body space-y-4">
            {analytics.vendorSummary.length === 0 ? (
              <p className="text-secondary-500 dark:text-secondary-400 text-center py-4">
                No data available
              </p>
            ) : (
              analytics.vendorSummary.map(item => (
                <div key={item._id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      {vendorLabels[item._id] || item._id}
                    </span>
                    <span className="text-sm text-secondary-500 dark:text-secondary-400">
                      {item.count} orders ({formatCurrency(item.total)})
                    </span>
                  </div>
                  <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-primary-500"
                      style={{ width: `${(item.total / maxVendorTotal) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Monthly Trend
          </h3>
        </div>
        <div className="card-body">
          {analytics.monthlySummary.length === 0 ? (
            <p className="text-secondary-500 dark:text-secondary-400 text-center py-8">
              No data available
            </p>
          ) : (
            <div className="flex items-end justify-between gap-2 h-48 overflow-x-auto pb-2">
              {[...analytics.monthlySummary].reverse().map(item => {
                const heightPercent = Math.max((item.total / maxMonthlyTotal) * 100, 5);
                return (
                  <div
                    key={`${item._id.year}-${item._id.month}`}
                    className="flex flex-col items-center min-w-[40px] flex-1"
                  >
                    <div className="flex-1 w-full flex flex-col justify-end">
                      <div
                        className="w-full bg-primary-500 rounded-t-sm hover:bg-primary-600 transition-colors cursor-pointer group relative"
                        style={{ height: `${heightPercent}%` }}
                        title={`${formatCurrency(item.total)} (${item.count} orders)`}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-secondary-900 dark:bg-secondary-700 text-white text-xs px-2 py-1 rounded pointer-events-none">
                          {formatCurrency(item.total)}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2 whitespace-nowrap">
                      {monthNames[item._id.month - 1]}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
