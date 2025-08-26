// lib/safe-price-wrapper.ts
import { HttpTypes } from "@medusajs/types"
import { getProductPrice as getMedusaPrice } from "@lib/util/get-product-price"
import { getProductPrice as getHardcodedPrice, hasHardcodedPrice } from "@lib/hardcoded-prices"

export interface SafePriceData {
  formatted: string
  amount: number
  currency: string
  originalPrice: number | null
  source: 'medusa' | 'hardcoded' | 'fallback'
  error?: string
}

export const getSafeProductPrice = async (
  product: HttpTypes.StoreProduct,
  region: HttpTypes.StoreRegion | null,
  timeout: number = 3000
): Promise<SafePriceData> => {
  
  const getCurrencySymbol = (currencyCode?: string) => {
    const symbols: Record<string, string> = {
      NGN: "₦",
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      CAD: "C$",
      AUD: "A$",
    }
    return currencyCode ? symbols[currencyCode.toUpperCase()] ?? currencyCode.toUpperCase() : ""
  }

  // Check for hardcoded price first (faster fallback)
  const hasHardcoded = hasHardcodedPrice(product.title || '')
  
  // If no region or invalid region, use hardcoded immediately
  if (!region?.id || !region.currency_code) {
    console.log('Invalid or missing region, using hardcoded price')
    
    if (hasHardcoded) {
      const hardcodedPrice = getHardcodedPrice(product.title || '')
      return {
        ...hardcodedPrice,
        source: 'hardcoded',
        error: 'Region not available'
      }
    }
    
    return {
      formatted: 'Contact for price',
      amount: 0,
      currency: 'NGN',
      originalPrice: null,
      source: 'fallback',
      error: 'No region and no hardcoded price'
    }
  }

  try {
    // Try to get Medusa pricing with error handling
    const medusaPricePromise = new Promise<SafePriceData>((resolve, reject) => {
      try {
        const { cheapestPrice, variantPrice } = getMedusaPrice({ product })
        const displayPriceObj = variantPrice ?? cheapestPrice

        // Fix: Convert calculated_price to number before comparison
        const calculatedPrice = Number(displayPriceObj?.calculated_price)
        
        if (displayPriceObj?.calculated_price && calculatedPrice > 0) {
          // Fix: Ensure amount is stored as a number
          const priceAmount = calculatedPrice
          
          resolve({
            formatted: `${getCurrencySymbol(region.currency_code)}${priceAmount.toFixed(2)}`,
            amount: priceAmount,
            currency: region.currency_code,
            originalPrice: null,
            source: 'medusa'
          })
        } else {
          reject(new Error('No valid calculated price from Medusa'))
        }
      } catch (error) {
        reject(error)
      }
    })

    // Set timeout
    const timeoutPromise = new Promise<SafePriceData>((_, reject) => {
      setTimeout(() => reject(new Error('Price loading timeout')), timeout)
    })

    // Race between price loading and timeout
    try {
      const result = await Promise.race([medusaPricePromise, timeoutPromise])
      return result
    } catch (error) {
      console.log('Medusa price failed, using hardcoded:', error)
      
      // Fallback to hardcoded
      if (hasHardcoded) {
        const hardcodedPrice = getHardcodedPrice(product.title || '')
        return {
          ...hardcodedPrice,
          source: 'hardcoded',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
      
      // Final fallback
      return {
        formatted: 'Contact for price',
        amount: 0,
        currency: region.currency_code || 'NGN',
        originalPrice: null,
        source: 'fallback',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  } catch (error) {
    console.log('Error in price fetching:', error)
    
    // Fallback to hardcoded
    if (hasHardcoded) {
      const hardcodedPrice = getHardcodedPrice(product.title || '')
      return {
        ...hardcodedPrice,
        source: 'hardcoded',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
    
    // Final fallback
    return {
      formatted: 'Contact for price',
      amount: 0,
      currency: region?.currency_code || 'NGN',
      originalPrice: null,
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}