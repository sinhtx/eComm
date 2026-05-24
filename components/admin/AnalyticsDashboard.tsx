'use client'

import { useState, useEffect } from 'react'
import { supabaseClient } from '@/lib/auth/supabaseClient'

interface AnalyticsMetrics {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  pendingRevenue: number
  approvedOrders: number
  approvedRevenue: number
  ordersThisWeek: number
  topRegions: Array<{
    region: string
    count: number
    revenue: number
  }>
}

export function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMetrics()
  }, [])

  async function fetchMetrics() {
    try {
      setLoading(true)
      setError(null)

      // Get all orders
      const { data: allOrders, error: ordersError } = await supabaseClient
        .from('fruit_orders')
        .select('*, customer:customers(state)')

      if (ordersError) throw ordersError

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const orders = (allOrders || []) as any[]

      // Calculate metrics
      const totalOrders = orders.length
      const totalRevenue = orders.reduce((sum, o) => sum + (o.total_price || 0), 0)

      const pendingOrders = orders.filter((o) => o.order_status === 'pending_approval').length
      const pendingRevenue = orders
        .filter((o) => o.order_status === 'pending_approval')
        .reduce((sum, o) => sum + (o.total_price || 0), 0)

      const approvedOrders = orders.filter((o) => o.order_status === 'approved').length
      const approvedRevenue = orders
        .filter((o) => o.order_status === 'approved')
        .reduce((sum, o) => sum + (o.total_price || 0), 0)

      // Calculate orders this week
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const ordersThisWeek = orders.filter((o) => new Date(o.created_at) > weekAgo).length

      // Calculate top regions
      const regionMap: Record<string, { count: number; revenue: number }> = {}
      orders.forEach((order) => {
        const state = order.customer?.state || 'Unknown'
        if (!regionMap[state]) {
          regionMap[state] = { count: 0, revenue: 0 }
        }
        regionMap[state].count++
        regionMap[state].revenue += order.total_price || 0
      })

      const topRegions = Object.entries(regionMap)
        .map(([region, data]) => ({
          region,
          ...data,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      setMetrics({
        totalOrders,
        totalRevenue,
        pendingOrders,
        pendingRevenue,
        approvedOrders,
        approvedRevenue,
        ordersThisWeek,
        topRegions,
      })
    } catch (err) {
      console.error('Failed to fetch metrics:', err)
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-3"></div>
          <p className="text-slate-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error || !metrics) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
        {error || 'Failed to load analytics'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
        <button
          onClick={fetchMetrics}
          className="px-4 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard label="Total Orders" value={metrics.totalOrders} format="number" />

        <MetricCard label="Total Revenue" value={metrics.totalRevenue} format="currency" />

        <MetricCard
          label="Pending Orders"
          value={metrics.pendingOrders}
          format="number"
          highlight={metrics.pendingOrders > 0}
        />

        <MetricCard label="Pending Revenue" value={metrics.pendingRevenue} format="currency" highlight />

        <MetricCard label="Approved Orders" value={metrics.approvedOrders} format="number" />

        <MetricCard label="Approved Revenue" value={metrics.approvedRevenue} format="currency" />
      </div>

      {/* Orders This Week */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Orders This Week</h3>
        <p className="text-4xl font-bold text-amber-600">{metrics.ordersThisWeek}</p>
        <p className="text-sm text-slate-600 mt-2">Last 7 days</p>
      </div>

      {/* Top Regions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Regions by Revenue</h3>
        {metrics.topRegions.length > 0 ? (
          <div className="space-y-4">
            {metrics.topRegions.map((region, idx) => (
              <div key={region.region} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 font-semibold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-900">{region.region}</span>
                    <span className="text-amber-600 font-bold">${region.revenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-600">
                    <span>{region.count} order{region.count !== 1 ? 's' : ''}</span>
                    <span>${(region.revenue / Math.max(region.count, 1)).toFixed(2)} avg</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-600">No order data yet</p>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-sm text-blue-600 font-semibold mb-2">Conversion Rate</p>
          <p className="text-3xl font-bold text-blue-900">
            {metrics.totalOrders > 0
              ? ((metrics.approvedOrders / metrics.totalOrders) * 100).toFixed(1)
              : 0}
            %
          </p>
          <p className="text-xs text-blue-600 mt-2">Approved / Total Orders</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-sm text-green-600 font-semibold mb-2">Avg Order Value</p>
          <p className="text-3xl font-bold text-green-900">
            ${metrics.totalOrders > 0 ? (metrics.totalRevenue / metrics.totalOrders).toFixed(2) : 0}
          </p>
          <p className="text-xs text-green-600 mt-2">Total Revenue / Orders</p>
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  label: string
  value: number
  format: 'number' | 'currency'
  highlight?: boolean
}

function MetricCard({ label, value, format, highlight = false }: MetricCardProps) {
  const formatted = format === 'currency' ? `$${value.toFixed(2)}` : value.toString()

  return (
    <div
      className={`rounded-lg p-6 ${
        highlight ? 'bg-amber-50 border-2 border-amber-200' : 'bg-white border border-slate-200 shadow'
      }`}
    >
      <p className={`text-sm font-semibold mb-2 ${highlight ? 'text-amber-600' : 'text-slate-600'}`}>
        {label}
      </p>
      <p className={`text-3xl font-bold ${highlight ? 'text-amber-600' : 'text-slate-900'}`}>
        {formatted}
      </p>
    </div>
  )
}
