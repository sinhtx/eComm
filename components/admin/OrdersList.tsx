'use client'

import { useState, useEffect } from 'react'
import { getPendingOrders, approveOrder, rejectOrder, getOrderDetails } from '@/app/actions/adminOrders'
import type { OrderWithCustomer, AuditLogEntry } from '@/app/actions/adminOrders'

export function OrdersList() {
  const [orders, setOrders] = useState<OrderWithCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithCustomer | null>(null)
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<{
    order: OrderWithCustomer
    auditLog: AuditLogEntry[]
  } | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [confirmApprovalOrder, setConfirmApprovalOrder] = useState<OrderWithCustomer | null>(null)
  const [confirmRejectOrder, setConfirmRejectOrder] = useState<OrderWithCustomer | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)
    setError(null)
    const { data, error: err } = await getPendingOrders()
    if (err) {
      setError(err)
    } else {
      setOrders(data)
    }
    setLoading(false)
  }

  async function handleViewDetails(order: OrderWithCustomer) {
    setSelectedOrder(order)
    const { data, error: err } = await getOrderDetails(order.id)
    if (err) {
      setError(err)
    } else if (data) {
      setSelectedOrderDetails(data)
    }
  }

  async function handleApproveConfirm(orderId: string) {
    setActionLoading(true)
    const { success, error: err } = await approveOrder(orderId)
    if (success) {
      await fetchOrders()
      setSelectedOrder(null)
      setSelectedOrderDetails(null)
      setConfirmApprovalOrder(null)
    } else {
      setError(err || 'Failed to approve order')
    }
    setActionLoading(false)
  }

  async function handleRejectConfirm(orderId: string) {
    if (!rejectReason.trim()) {
      setError('Please enter a rejection reason')
      return
    }

    setActionLoading(true)
    const { success, error: err } = await rejectOrder(orderId, rejectReason)
    if (success) {
      await fetchOrders()
      setSelectedOrder(null)
      setSelectedOrderDetails(null)
      setConfirmRejectOrder(null)
      setRejectReason('')
    } else {
      setError(err || 'Failed to reject order')
    }
    setActionLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-3"></div>
          <p className="text-slate-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Pending Approvals</h2>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-slate-900">Customer</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-900">Email</th>
                <th className="text-right px-6 py-4 font-semibold text-slate-900">Total</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-900">Date</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-900 font-semibold">
                    {order.customer.first_name} {order.customer.last_name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{order.customer.email}</td>
                  <td className="px-6 py-4 text-right text-slate-900 font-semibold">
                    ${order.total_price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 space-x-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="text-amber-600 hover:text-amber-700 font-semibold text-sm"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => setConfirmApprovalOrder(order)}
                      disabled={actionLoading}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setConfirmRejectOrder(order)}
                      disabled={actionLoading}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12 text-slate-600">
            <p className="text-lg">No pending orders</p>
            <p className="text-sm mt-2">All orders have been processed!</p>
          </div>
        )}
      </div>

      {selectedOrder && selectedOrderDetails && (
        <OrderDetailModal
          order={selectedOrderDetails.order}
          auditLog={selectedOrderDetails.auditLog}
          onApprove={() => setConfirmApprovalOrder(selectedOrder)}
          onReject={() => setConfirmRejectOrder(selectedOrder)}
          onClose={() => {
            setSelectedOrder(null)
            setSelectedOrderDetails(null)
          }}
          loading={actionLoading}
        />
      )}

      {/* Approval Confirmation Dialog */}
      {confirmApprovalOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Confirm Approval</h3>
            <p className="text-slate-600 mb-6">
              Capture ${confirmApprovalOrder.total_price.toFixed(2)} for this order?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmApprovalOrder(null)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApproveConfirm(confirmApprovalOrder.id)}
                disabled={actionLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 px-4 rounded-lg"
              >
                {actionLoading ? 'Capturing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Dialog with Reason Input */}
      {confirmRejectOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Reject Order</h3>
            <p className="text-slate-600 mb-4">Enter reason for rejection:</p>
            <input
              type="text"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Out of stock, Customer requested"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-6 text-slate-900"
              disabled={actionLoading}
            />
            <p className="text-slate-600 mb-6 text-sm">
              Customer will be notified of this reason.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setConfirmRejectOrder(null)
                  setRejectReason('')
                }}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRejectConfirm(confirmRejectOrder.id)}
                disabled={actionLoading || !rejectReason.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2 px-4 rounded-lg"
              >
                {actionLoading ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface OrderDetailModalProps {
  order: OrderWithCustomer
  auditLog: AuditLogEntry[]
  onApprove: () => void
  onReject: () => void
  onClose: () => void
  loading: boolean
}

function OrderDetailModal({
  order,
  auditLog,
  onApprove,
  onReject,
  onClose,
  loading,
}: OrderDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-slate-200 sticky top-0 bg-white">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Customer Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">Name</p>
                <p className="font-semibold text-slate-900">
                  {order.customer.first_name} {order.customer.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Email</p>
                <p className="font-semibold text-slate-900">{order.customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Phone</p>
                <p className="font-semibold text-slate-900">{order.customer.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Address</p>
                <p className="font-semibold text-slate-900">
                  {order.customer.address_line_1}, {order.customer.city}, {order.customer.state}{' '}
                  {order.customer.zip_code}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Order Items</h4>
            <div className="space-y-2 bg-slate-50 p-4 rounded-lg">
              {Array.isArray(order.items) && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700">
                    <span>{item.name || 'Item'} {item.quantity ? `x${item.quantity}` : ''}</span>
                    <span className="font-semibold">${((item.total ?? item.price) || 0).toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-600">No items found</p>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-slate-900">Total</span>
              <span className="text-3xl font-bold text-amber-600">${order.total_price.toFixed(2)}</span>
            </div>
          </div>

          {/* Audit Log */}
          {auditLog.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Status History</h4>
              <div className="space-y-3">
                {auditLog.map((entry) => (
                  <div key={entry.id} className="border-l-4 border-slate-300 pl-4 py-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {entry.previous_status} → {entry.new_status}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">{entry.reason}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(entry.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3">
          <button
            onClick={onApprove}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Processing...' : 'Approve Order'}
          </button>
          <button
            onClick={onReject}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Processing...' : 'Reject Order'}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 text-slate-700 hover:bg-slate-200 font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
