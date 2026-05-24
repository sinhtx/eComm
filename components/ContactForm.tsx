'use client'

import { useState } from 'react'
import { submitContactForm } from '@/app/actions/contactForm'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    type: 'question' as const,
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const result = await submitContactForm(formData)

    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Sent!' })
      setFormData({
        name: '',
        email: '',
        message: '',
        type: 'question',
      })
    } else {
      setMessage({ type: 'error', text: result.error || 'Error sending' })
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-neutral-charcoal mb-2">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg border-2 border-neutral-charcoal focus:outline-none focus:ring-2 focus:ring-primary-yellow disabled:opacity-50"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-charcoal mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg border-2 border-neutral-charcoal focus:outline-none focus:ring-2 focus:ring-primary-yellow disabled:opacity-50"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-charcoal mb-2">
          Inquiry Type
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg border-2 border-neutral-charcoal focus:outline-none focus:ring-2 focus:ring-primary-yellow disabled:opacity-50"
        >
          <option value="question">Question</option>
          <option value="wholesale">Wholesale Inquiry</option>
          <option value="partnership">Partnership</option>
          <option value="feedback">Feedback</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-charcoal mb-2">
          Message
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          disabled={loading}
          rows={5}
          className="w-full px-4 py-2 rounded-lg border-2 border-neutral-charcoal focus:outline-none focus:ring-2 focus:ring-primary-yellow disabled:opacity-50 resize-none"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm font-semibold ${
            message.type === 'success'
              ? 'bg-primary-yellow/20 text-primary-yellow'
              : 'bg-accent-pink/20 text-accent-pink'
          }`}
        >
          {message.text}
        </div>
      )}
    </form>
  )
}
