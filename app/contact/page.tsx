'use client'

import { ContactForm } from '@/components/ContactForm'

export default function ContactPage() {
  return (
    <div>
      {/* Header */}
      <div className="bg-neutral-off-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-h1 mb-4 text-neutral-charcoal">Get In Touch</h1>
          <p className="text-lg text-neutral-gray max-w-2xl mx-auto">
            Have a question? Want to discuss wholesale? We&apos;d love to hear from you.
            Reach out anytime&mdash;we&apos;ll get back to you soon.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-neutral-cream py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-h2 mb-6 text-neutral-charcoal">
                Send us a Message
              </h2>
              <ContactForm />
            </div>

            {/* Info */}
            <div className="space-y-8">
              {/* Location */}
              <div>
                <h3 className="text-h3 mb-2 text-neutral-charcoal">
                  📍 Our Farm
                </h3>
                <p className="text-body text-neutral-gray">
                  Mango Tango Farm <br /> Pine Island, FL 33922
                </p>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-h3 mb-2 text-neutral-charcoal">
                  📧 Email Us
                </h3>
                <a
                  href="mailto:contact@mangotangofarm.com"
                  className="text-primary-yellow hover:text-primary-orange font-semibold"
                >
                  contact@mangotangofarm.com
                </a>
              </div>

              {/* Hours */}
              <div>
                <h3 className="text-h3 mb-2 text-neutral-charcoal">
                  🕐 Hours
                </h3>
                <p className="text-body text-neutral-gray">
                  Seasonal availability <br /> Best to reach us via email or contact
                  form
                </p>
              </div>

              {/* Social */}
              <div>
                <h3 className="text-h3 mb-2 text-neutral-charcoal">
                  🌐 Follow Us
                </h3>
                <div className="flex gap-4">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-yellow hover:text-primary-orange font-semibold"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-yellow hover:text-primary-orange font-semibold"
                  >
                    Facebook
                  </a>
                </div>
              </div>

              {/* Special Note */}
              <div className="bg-primary-yellow/10 border-l-4 border-primary-yellow p-4 rounded">
                <p className="text-sm text-neutral-charcoal font-semibold">
                  💡 Wholesale &amp; Partnership inquiries welcome! Select &quot;Wholesale
                  Inquiry&quot; in the form.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
