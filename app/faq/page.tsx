'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'What varieties of mangoes do you sell?',
    answer:
      'We grow and sell premium organic mango varieties including Carrie, Mallika, Nam Dok Mai, Frorigan, Kent, Tommy Atkins, Ataulfo, Alphonso, and Haden. Each variety has unique flavor profiles and availability seasons.',
  },
  {
    question: 'Are your mangoes organic?',
    answer:
      'Yes! Our mangoes are grown using organic farming practices with the same rigorous standards we would use for our own family. While we don\'t have formal organic certification, we follow strict organic protocols.',
  },
  {
    question: 'When are mangoes in season?',
    answer:
      'Mango season in Southwest Florida typically runs from May through September, with peak availability from June to August. Different varieties have different peak seasons. Check our Shop page for current availability.',
  },
  {
    question: 'How do I place an order?',
    answer:
      'You can place orders directly through our Shop page. Select your preferred mango varieties, add them to your cart, and proceed to checkout. We accept both Stripe and Zelle payments.',
  },
  {
    question: 'Do you offer wholesale or bulk orders?',
    answer:
      'Yes! We welcome wholesale inquiries and bulk orders. Please contact us at contact@mangotangofarm.com or use our Contact form and select "Wholesale Inquiry".',
  },
  {
    question: 'How are your mangoes shipped?',
    answer:
      'Orders are carefully packaged to ensure freshness during shipping. We work with reliable shipping partners to deliver your mangoes in peak condition. Shipping times vary based on location.',
  },
  {
    question: 'What if I receive damaged mangoes?',
    answer:
      'We take great care in packaging, but if you receive damaged fruit, please contact us immediately with photos. We\'re committed to making it right.',
  },
  {
    question: 'Can I visit the farm?',
    answer:
      'Farm visits are available by appointment. Please contact us to schedule a visit and learn more about our sustainable farming practices.',
  },
  {
    question: 'How are you recovering from Hurricane Ian?',
    answer:
      'Hurricane Ian had a significant impact on our orchards in 2022. We\'re in the middle of a multi-year restoration program, and every purchase helps support our recovery efforts. Thank you for your support!',
  },
  {
    question: 'Do you have a subscription service?',
    answer:
      'We\'re currently working on developing a subscription service for seasonal mango deliveries. Check back soon for updates!',
  },
]

function FAQItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-neutral-off-white">
      <button
        onClick={onToggle}
        className="w-full py-6 px-4 text-left flex items-center justify-between hover:bg-neutral-off-white transition-colors"
      >
        <h3 className="text-lg font-semibold text-neutral-charcoal pr-6">{item.question}</h3>
        <span className={`text-primary-yellow text-2xl flex-shrink-0 transition-transform ${isOpen ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      {isOpen && (
        <div className="px-4 pb-6 text-neutral-gray">
          <p>{item.answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="bg-neutral-cream min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-h1 mb-4 text-neutral-charcoal">Frequently Asked Questions</h1>
          <p className="text-lg text-neutral-gray">
            Have a question about our mangoes? Find answers below.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-off-white">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              item={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        <div className="mt-12 p-8 bg-primary-yellow bg-opacity-10 border-l-4 border-primary-yellow rounded">
          <h3 className="text-h3 mb-2 text-neutral-charcoal">Didn't find your answer?</h3>
          <p className="text-neutral-gray mb-4">
            Have a question that isn't answered here? We'd love to hear from you!
          </p>
          <a href="/contact" className="inline-block px-6 py-2 bg-primary-yellow hover:bg-primary-orange text-neutral-charcoal font-semibold rounded-lg transition-colors">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}
