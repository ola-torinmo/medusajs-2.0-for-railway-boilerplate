// src/lib/util/get-product-price.ts
import { HttpTypes } from "@medusajs/types"
import { getPercentageDiff } from "./get-precentage-diff"
import { convertToLocale } from "./money"

/**
 * Normalizes many possible calculated_price shapes that Medusa might return.
 * Returns null when no usable price was found.
 */
export const getPricesForVariant = (variant: any) => {
  if (!variant) return null

  // Helper: try to coerce a value to a number (cents)
  const toNumber = (v: unknown): number | null => {
    if (v === undefined || v === null) return null
    if (typeof v === "number") return v
    if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) {
      return Number(v)
    }
    return null
  }

  // Common candidate sources:
  // 1) variant.calculated_price (preferred) - many shapes
  // 2) variant.original_price or variant.price (legacy)
  // 3) variant.prices[] array (legacy)
  const cp = variant?.calculated_price

  let calculatedAmount: number | null = null
  let originalAmount: number | null = null
  let currencyCode: string | undefined = undefined
  let priceType: string | undefined = undefined

  // === 1) calculated_price could be number (cents) ===
  if (typeof cp === "number") {
    calculatedAmount = cp
  }

  // === 2) calculated_price could be an object with different shapes ===
  if (cp && typeof cp === "object") {
    // common Medusa shape: { calculated_amount, original_amount, currency_code, calculated_price: { price_list_type } }
    if (cp.calculated_amount !== undefined) {
      calculatedAmount = toNumber(cp.calculated_amount)
    }

    if (cp.original_amount !== undefined) {
      originalAmount = toNumber(cp.original_amount)
    }

    if (!currencyCode && cp.currency_code) {
      currencyCode = String(cp.currency_code)
    }

    // nested price info
    if (cp.calculated_price && typeof cp.calculated_price === "object") {
      if (cp.calculated_price.price_list_type) {
        priceType = cp.calculated_price.price_list_type
      }
    }

    // some APIs return amount directly or with 'amount' key
    if (calculatedAmount === null && cp.amount !== undefined) {
      calculatedAmount = toNumber(cp.amount)
    }

    // currency keyed map: { NGN: 800000, USD: 10000 }
    if (calculatedAmount === null && currencyCode) {
      const keyed = cp[currencyCode]
      if (keyed !== undefined) {
        calculatedAmount = toNumber(keyed)
      } else {
        // try any numeric property if nothing matched
        for (const val of Object.values(cp)) {
          const n = toNumber(val)
          if (n !== null) {
            calculatedAmount = n
            break
          }
        }
      }
    }
  }

  // === 3) fallbacks: legacy fields on variant ===
  if (calculatedAmount === null) {
    if (variant.original_price !== undefined) {
      // sometimes original_price is used as single price field
      calculatedAmount = toNumber(variant.original_price)
      originalAmount = originalAmount ?? toNumber(variant.original_price)
    }
    if (calculatedAmount === null && variant.price !== undefined) {
      calculatedAmount = toNumber(variant.price)
    }
  }

  // === 4) try variant.prices array (legacy) ===
  if ((calculatedAmount === null || !currencyCode) && Array.isArray(variant.prices) && variant.prices.length) {
    // try to find the currency that matches variant.calculated_price.currency_code or first available
    const exact = variant.prices.find((p: any) => {
      if (!p) return false
      // accept currency_code case-insensitively
      if (p.currency_code && cp && cp.currency_code) {
        return String(p.currency_code).toLowerCase() === String(cp.currency_code).toLowerCase()
      }
      return false
    })

    const pick = exact || variant.prices[0]
    if (pick) {
      calculatedAmount = calculatedAmount ?? toNumber(pick.amount)
      originalAmount = originalAmount ?? toNumber(pick.amount)
      currencyCode = currencyCode ?? (pick.currency_code ? String(pick.currency_code) : undefined)
    }
  }

  // === 5) try variant.metadata price ===
  if (calculatedAmount === null && variant?.metadata?.price) {
    calculatedAmount = toNumber(variant.metadata.price)
  }

  // If we still have no calculated amount, bail out.
  if (calculatedAmount === null) {
    return null
  }

  // Final currency fallback
  if (!currencyCode) {
    // try calculated_price.currency_code, variant.prices, or default to undefined
    if (cp && typeof cp === "object" && cp.currency_code) currencyCode = String(cp.currency_code)
    else if (Array.isArray(variant.prices) && variant.prices[0]?.currency_code) currencyCode = String(variant.prices[0].currency_code)
    else currencyCode = undefined
  }

  // original amount fallback
  if (originalAmount === null) {
    if (variant.original_price !== undefined) originalAmount = toNumber(variant.original_price)
    else originalAmount = calculatedAmount
  }

  // price type detection fallback
  priceType = priceType ?? (cp && typeof cp === "object" && cp.price_type ? String(cp.price_type) : undefined)

  // --- Ensure we pass numbers (non-null) to convertToLocale and to returned fields ----
  const calcNum: number = calculatedAmount ?? 0
  const origNum: number = originalAmount ?? calcNum
  const displayCurrency = currencyCode ?? "NGN"

  const calculated_price_number = calcNum
  const original_price_number = origNum

  const calculated_price = convertToLocale({
    amount: calculated_price_number,
    currency_code: displayCurrency,
  })

  const original_price = convertToLocale({
    amount: original_price_number,
    currency_code: displayCurrency,
  })

  return {
    calculated_price_number,
    calculated_price,
    original_price_number,
    original_price,
    currency_code: displayCurrency,
    price_type: priceType ?? "default",
    percentage_diff: getPercentageDiff(original_price_number ?? calculated_price_number, calculated_price_number),
  }
}

export function getProductPrice({
  product,
  variantId,
}: {
  product: HttpTypes.StoreProduct
  variantId?: string
}) {
  if (!product || !product.id) {
    throw new Error("No product provided")
  }

  const cheapestPrice = () => {
    if (!product || !product.variants?.length) {
      return null
    }

    // map every variant to a numeric cents value if possible
    const mapped = product.variants
      .map((v: any) => {
        const p = getPricesForVariant(v)
        return p ? { variant: v, price: p.calculated_price_number } : null
      })
      .filter(Boolean) as { variant: any; price: number }[]

    if (!mapped.length) return null

    // sort by numeric cents
    mapped.sort((a, b) => a.price - b.price)
    return getPricesForVariant(mapped[0].variant)
  }

  const variantPrice = () => {
    if (!product || !variantId) return null

    const variant: any = product.variants?.find((v: any) => v.id === variantId || v.sku === variantId)
    if (!variant) return null
    return getPricesForVariant(variant)
  }

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
  }
}
