'use client'

import { useState } from 'react'
import { OrdersList } from '@/components/admin/OrdersList'
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard'

type TabType = 'orders' | 'analytics'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('orders')

  const tabs: Array<{ id: TabType; label: string; icon: string }> = [
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
  ]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <div className="flex gap-8 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-1 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'orders' && <OrdersList />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </div>
    </div>
  )
}
