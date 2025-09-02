// product-actions-wrapper.tsx

import { getProductsById } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  id,
  region,
  quantity = 1,  // Default to 1
  priceData,     // Accept priceData from parent
}: {
  id: string
  region: HttpTypes.StoreRegion
  quantity?: number
  priceData?: any
}) {
  try {
    // Ensure region.id exists before making the API call
    if (!region?.id) {
      console.error("No region ID available for product actions")
      return (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Region not available. Please refresh the page.</p>
        </div>
      )
    }

    const [product] = await getProductsById({
      ids: [id],
      regionId: region.id,
    })

    if (!product) {
      console.error(`Product ${id} not found for region ${region.id}`)
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Product not available in this region.</p>
        </div>
      )
    }

    // Log for debugging
    console.log("Product Actions Data:", {
      productId: product.id,
      variants: product.variants?.length,
      regionId: region.id,
      regionCurrency: region.currency_code,
      quantity,
      priceData
    })

    return (
      <ProductActions 
        product={product} 
        region={region}
        initialQuantity={quantity}
        fallbackPriceData={priceData}
      />
    )
  } catch (error) {
    console.error("Error loading product actions:", error)
    return (
      <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded">
        <p>Unable to load product options. Please try again.</p>
      </div>
    )
  }
}

