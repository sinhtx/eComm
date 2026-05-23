import '@testing-library/jest-dom'

// Provide a global fetch mock for Node.js test environment (needed for Stripe client)
// The Stripe SDK requires fetch to be available
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn() as unknown as typeof fetch
}

// Set up test environment variables from .env.local
// For missing variables, Jest will use defaults or mocks
const testEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://test.supabase.co',
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'test_key',
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY || 'test_secret',
  NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || 'pk_test_mock',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_mock',
}

Object.assign(process.env, testEnv)
