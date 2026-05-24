interface ValuePropositionCardProps {
  icon: string
  title: string
  description: string
}

export function ValuePropositionCard({
  icon,
  title,
  description,
}: ValuePropositionCardProps) {
  return (
    <div className="text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-h3 mb-2 text-neutral-charcoal">{title}</h3>
      <p className="text-body text-neutral-gray leading-relaxed">
        {description}
      </p>
    </div>
  )
}

interface ValuePropositionsProps {
  title: string
  subtitle?: string
  cards: ValuePropositionCardProps[]
}

export function ValuePropositions({
  title,
  subtitle,
  cards,
}: ValuePropositionsProps) {
  return (
    <section className="bg-neutral-off-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-h2 mb-2 text-neutral-charcoal">{title}</h2>
          {subtitle && (
            <p className="text-lg text-neutral-gray">{subtitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <ValuePropositionCard key={idx} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}
