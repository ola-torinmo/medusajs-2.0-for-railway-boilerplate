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

// components/ProductActionsWrapper.tsx (Enhanced Version)
// "use client"
// import React, { useState } from 'react'
// import { HttpTypes } from "@medusajs/types"

// type ProductActionsWrapperProps = {
//   id: string
//   region: HttpTypes.StoreRegion
//   quantity?: number
//   priceData?: {
//     formatted: string
//     amount: number
//     currency: string
//     originalPrice: number | null
//   }
// }

// const ProductActionsWrapper: React.FC<ProductActionsWrapperProps> = ({
//   id,
//   region,
//   quantity = 1,
//   priceData
// }) => {
//   const [isLoading, setIsLoading] = useState(false)
//   const [isAdded, setIsAdded] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const handleAddToCart = async () => {
//     setIsLoading(true)
//     setError(null)
    
//     try {
//       // Validate required data
//       if (!id) {
//         throw new Error('Product ID is required')
//       }
      
//       if (!region?.id) {
//         throw new Error('Region is required')
//       }

//       if (quantity < 1) {
//         throw new Error('Quantity must be at least 1')
//       }
      
//       // Simulate add to cart API call - replace with your actual Medusa cart logic
//       await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
      
//       // Here you would typically call your Medusa cart API
//       // Example: 
//       // const cartResponse = await sdk.store.cart.lineItems.create(cartId, {
//       //   variant_id: getVariantId(id), // You'll need to get the variant ID
//       //   quantity: quantity
//       // })
      
//       console.log('Adding to cart:', {
//         productId: id,
//         quantity,
//         regionId: region?.id,
//         price: priceData?.amount,
//         currency: priceData?.currency || region?.currency_code
//       })
      
//       setIsAdded(true)
//       setTimeout(() => setIsAdded(false), 3000) // Reset after 3 seconds
      
//     } catch (error) {
//       console.error('Error adding to cart:', error)
//       setError(error instanceof Error ? error.message : 'Failed to add to cart')
//       setTimeout(() => setError(null), 5000) // Clear error after 5 seconds
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleBuyNow = async () => {
//     await handleAddToCart()
//     if (!error) {
//       // Redirect to checkout after successful add to cart
//       // window.location.href = '/checkout'
//       console.log('Redirecting to checkout...')
//     }
//   }

//   const totalPrice = priceData?.amount ? priceData.amount * quantity : 0
//   const currency = priceData?.currency || region?.currency_code || 'NGN'
//   const currencySymbol = currency === 'NGN' ? '₦' : currency === 'USD' ? '$' : currency
//   const formattedTotal = `${currencySymbol}${totalPrice.toLocaleString()}`

//   // Check if product can be added to cart
//   const canAddToCart = id && region && priceData && priceData.amount > 0

//   return (
//     <div className="space-y-4">
//       {/* Error Display */}
//       {error && (
//         <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
//           <p className="text-red-800 text-sm">{error}</p>
//         </div>
//       )}

//       {/* Total Price Display */}
//       {priceData && quantity > 1 && (
//         <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//           <span className="text-sm text-gray-600">
//             {quantity} × {priceData.formatted}
//           </span>
//           <span className="font-semibold text-lg">
//             {formattedTotal}
//           </span>
//         </div>
//       )}

//       {/* Add to Cart Button */}
//       <button
//         onClick={handleAddToCart}
//         disabled={isLoading || !canAddToCart}
//         className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
//           !canAddToCart
//             ? 'bg-gray-300 cursor-not-allowed'
//             : isAdded
//             ? 'bg-green-500 hover:bg-green-600'
//             : isLoading
//             ? 'bg-gray-400 cursor-not-allowed'
//             : 'bg-black hover:bg-gray-800'
//         }`}
//       >
//         {!canAddToCart ? (
//           'Product Unavailable'
//         ) : isLoading ? (
//           <div className="flex items-center justify-center gap-2">
//             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//             Adding to Cart...
//           </div>
//         ) : isAdded ? (
//           <div className="flex items-center justify-center gap-2">
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//             Added to Cart!
//           </div>
//         ) : (
//           `Add to Cart - ${priceData?.formatted || 'Contact for price'}`
//         )}
//       </button>

//       {/* Buy Now Button */}
//       {canAddToCart && (
//         <button
//           onClick={handleBuyNow}
//           disabled={isLoading}
//           className="w-full py-3 px-6 rounded-lg font-semibold border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isLoading ? 'Processing...' : 'Buy Now'}
//         </button>
//       )}

//       {/* Stock Status */}
//       <div className="text-sm text-center">
//         {canAddToCart ? (
//           <>
//             <span className="text-green-600">✓ In Stock</span>
//             <span className="text-gray-500 ml-2">• Fast shipping available</span>
//           </>
//         ) : (
//           <span className="text-red-600">⚠ Currently unavailable</span>
//         )}
//       </div>

//       {/* Product Info */}
//       <div className="text-xs text-gray-500 text-center space-y-1">
//         <div>Product ID: {id}</div>
//         <div>Region: {region?.name} ({region?.currency_code})</div>
//         {priceData && (
//           <div>Price: {priceData.formatted} ({priceData.currency})</div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default ProductActionsWrapper