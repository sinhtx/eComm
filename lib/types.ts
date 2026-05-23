export interface MangoVariety {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  available: boolean;
  inSeason: boolean;
  pricePerPound: number;
}

export interface MixBox {
  id: string;
  name: string;
  varieties: string[];
  weight: number;
  price: number;
  imageUrl: string;
  description: string;
}

// Cart and Checkout Types
export interface CartItem {
  id: string; // Product ID (mango variety ID or mix box ID)
  name: string; // Product name (e.g., "Carrie", "Small Mix")
  type: 'mango' | 'mixbox';
  quantity: number;
  pricePerUnit: number;
  total: number; // quantity * pricePerUnit
}

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  countryCode?: string;
  paymentMethod: 'zelle' | 'stripe';
}

export interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  countryCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  orderStatus: 'pending_approval' | 'approved' | 'cancelled';
  items: CartItem[];
  totalPrice: number;
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  paymentMethod: 'zelle' | 'stripe';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
