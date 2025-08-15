// lib/hardcoded-prices.ts

export interface PriceData {
  amount: number;
  currency: string;
  formatted: string;
  originalPrice: number | null;
}

export const NIGERIA_PRICES: Record<string, PriceData> = {
  'BANANA POWDER': {
    amount: 12000,
    currency: 'NGN',
    formatted: '₦12,000',
    originalPrice: null,
  },
  'EYES ON ME LIQUID EYELINER': {
    amount: 15000,
    currency: 'NGN',
    formatted: '₦15,000',
    originalPrice: null,
  },
  'Matte Lipstick Collection': {
    amount: 8500,
    currency: 'NGN',
    formatted: '₦8,500',
    originalPrice: null,
  },
  'Foundation Pro Max': {
    amount: 12000,
    currency: 'NGN',
    formatted: '₦12,000',
    originalPrice: 15000, // example of discounted item
  },
  // Add more products here as needed
  // Format: 'Product Title': { amount: number, currency: 'NGN', formatted: '₦X,XXX' }
}

// Helper function to get product price
export const getProductPrice = (productTitle: string): PriceData => {
  const priceData = NIGERIA_PRICES[productTitle];
  if (!priceData) {
    return {
      formatted: 'Contact for price',
      amount: 0,
      currency: 'NGN',
      originalPrice: null,
    };
  }
  return priceData;
};

// Helper function to format price manually if needed
export const formatNGNPrice = (amount: number): string => {
  return `₦${amount.toLocaleString()}`;
};

// Check if product has a hardcoded price
export const hasHardcodedPrice = (productTitle: string): boolean => {
  return !!NIGERIA_PRICES[productTitle];
};