import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    stripeInstance = new Stripe(key, {
      apiVersion: '2026-04-22.dahlia',
    })
  }
  return stripeInstance
}

export const stripe = new Proxy({} as Stripe, {
  get: (_target, prop: string) => {
    const instance = getStripe()
    return (instance as unknown as Record<string, unknown>)[prop]
  },
})
