'use client'

import { useState } from 'react'
import { subscribeToNewsletter } from '@/app/actions/newsletterSignup'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const result = await subscribeToNewsletter(email)

    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Subscribed!' })
      setEmail('')
    } else {
      setMessage({ type: 'error', text: result.error || 'Error subscribing' })
    }

    setLoading(false)
  }

  return (
    <section className="bg-gradient-to-r from-primary-yellow/5 to-primary-orange/5 border-t-2 border-primary-yellow py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-h2 mb-2 text-neutral-charcoal">
          Get Harvest Updates & Seasonal Alerts
        </h2>
        <p className="text-lg text-neutral-gray mb-8">
          Know when your favorite mangoes are in season
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-lg border-2 border-neutral-charcoal focus:outline-none focus:ring-2 focus:ring-primary-yellow disabled:opacity-50"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary whitespace-nowrap disabled:opacity-50"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm font-semibold ${
              message.type === 'success'
                ? 'bg-primary-yellow/20 text-primary-yellow'
                : 'bg-accent-pink/20 text-accent-pink'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </section>
  )
}
