interface TestimonialCardProps {
  quote: string
  customerName: string
  rating: number
  verified?: boolean
}

export function TestimonialCard({
  quote,
  customerName,
  rating,
  verified = true,
}: TestimonialCardProps) {
  return (
    <div className="card p-6 bg-neutral-cream">
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={i < rating ? 'text-primary-yellow' : 'text-neutral-gray'}
          >
            ★
          </span>
        ))}
      </div>

      {/* Quote */}
      <p className="text-body italic font-georgia text-neutral-charcoal mb-4">
        &quot;{quote}&quot;
      </p>

      {/* Customer Name */}
      <div className="flex items-center justify-between">
        <p className="font-semibold text-neutral-charcoal">{customerName}</p>
        {verified && (
          <span className="text-xs bg-primary-yellow/20 text-primary-yellow px-2 py-1 rounded-full">
            Verified Buyer
          </span>
        )}
      </div>
    </div>
  )
}

interface TestimonialsProps {
  testimonials: TestimonialCardProps[]
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="bg-neutral-cream py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-h2 mb-2 text-neutral-charcoal">
            What Customers Say
          </h2>
          <p className="text-lg text-neutral-gray">
            Real reviews from real mango lovers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <TestimonialCard key={idx} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}
