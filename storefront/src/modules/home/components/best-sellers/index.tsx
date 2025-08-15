// src/modules/home/components/bestsellers/index.tsx
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

type BestsellersProps = {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}

const Bestsellers = ({ products, region }: BestsellersProps) => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="content-container">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-[28px] font-bold text-gray-900 mb-2 uppercase tracking-wide">
            SHOP OUR BESTSELLER ITEMS
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Try out our highly-rated hits and find out why buyers keep coming back.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-[5px]">
          {products.slice(0, 8).map((product) => (
            <div key={product.id} className="group">
              <ProductPreview
                product={product}
                region={region}
                isFeatured
              />
            </div>
          ))}
        </div>

        {/* View All Link */}
        {/* <div className="text-center">
          <InteractiveLink href="/collections/bestsellers">
            <Text className="text-base font-medium" style={{ color: '#B07A5D' }}>
              View all bestsellers
            </Text>
          </InteractiveLink>
        </div> */}
      </div>
    </div>
  )
}

export default Bestsellers

// src/modules/home/components/bestsellers/index.tsx
// "use client"

// import { HttpTypes } from "@medusajs/types"
// import { Text, Button } from "@medusajs/ui"
// import InteractiveLink from "@modules/common/components/interactive-link"
// import ProductPreview from "@modules/products/components/product-preview"
// import { addToCart } from "@lib/data/cart"
// import { convertToLocale } from "@lib/util/money"
// import { useState } from "react"
// import Image from "next/image"

// type BestsellersProps = {
//   products: HttpTypes.StoreProduct[]
//   region: HttpTypes.StoreRegion
// }

// const ProductCard = ({ product, region }: { product: HttpTypes.StoreProduct, region: HttpTypes.StoreRegion }) => {
//   const [isLoading, setIsLoading] = useState(false)
  
//   // Get the cheapest variant price
//   const cheapestPrice = product.variants?.reduce((acc, variant) => {
//     // Use calculated_price if available, otherwise fallback to the first price object's original_price
//     const price = variant.calculated_price ?? variant.prices?.[0]?.original_price
//     if (price == null) return acc
//     return acc == null || price < acc ? price : acc
//   }, null as number | null)

//   // Get the default variant (usually the first one)
//   const defaultVariant = product.variants?.[0]

//   const handleAddToCart = async () => {
//     if (!defaultVariant) return
    
//     setIsLoading(true)
//     try {
//       await addToCart({
//         variantId: defaultVariant.id,
//         quantity: 1,
//         countryCode: region.id,
//       })
//     } catch (error) {
//       console.error('Error adding to cart:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
//       {/* Product Image */}
//       <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100">
//         {product.thumbnail ? (
//           <Image
//             src={product.thumbnail}
//             alt={product.title || ''}
//             fill
//             className="object-cover group-hover:scale-105 transition-transform duration-300"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-gray-200">
//             <span className="text-gray-400">No image</span>
//           </div>
//         )}
//       </div>
      
//       {/* Product Info */}
//       <div className="p-4">
//         <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
//           {product.title}
//         </h3>
        
//         {/* Price */}
//         {cheapestPrice && (
//           <div className="mb-3">
//             <span className="text-lg font-semibold text-gray-900">
//               {convertToLocale({
//                 amount: cheapestPrice,
//                 currency_code: region.currency_code,
//               })}
//             </span>
//             {product.variants && product.variants.length > 1 && (
//               <span className="text-sm text-gray-500 ml-1">starting at</span>
//             )}
//           </div>
//         )}
        
//         {/* Buy Now Button */}
//         <Button
//           onClick={handleAddToCart}
//           disabled={isLoading || !defaultVariant}
//           className="w-full bg-[#B07A5D] hover:bg-[#9A6B50] text-white"
//           size="small"
//         >
//           {isLoading ? 'Adding...' : 'Buy Now'}
//         </Button>
//       </div>
//     </div>
//   )
// }

// const Bestsellers = ({ products, region }: BestsellersProps) => {
//   return (
//     <div className="py-16 bg-gray-50">
//       <div className="content-container">
//         {/* Section Header */}
//         <div className="mb-12 text-center">
//           <h2 className="text-[28px] font-bold text-gray-900 mb-2 uppercase tracking-wide">
//             SHOP OUR BESTSELLER ITEMS
//           </h2>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Try out our highly-rated hits and find out why buyers keep coming back.
//           </p>
//         </div>
        
//         {/* Products Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-[5px]">
//           {products.slice(0, 8).map((product) => (
//             <ProductCard
//               key={product.id}
//               product={product}
//               region={region}
//             />
//           ))}
//         </div>
        
//         {/* View All Link */}
//         {/* <div className="text-center">
//           <InteractiveLink href="/collections/bestsellers">
//             <Text className="text-base font-medium" style={{ color: '#B07A5D' }}>
//               View all bestsellers
//             </Text>
//           </InteractiveLink>
//         </div> */}
//       </div>
//     </div>
//   )
// }

// export default Bestsellers