// import { clx } from "@medusajs/ui"
// import { getProductPrice } from "@lib/util/get-product-price"
// import { HttpTypes } from "@medusajs/types"

// export default function ProductPrice({
//   product,
//   variant,
//   fallbackPriceData, // Add this prop
// }: {
//   product: HttpTypes.StoreProduct
//   variant?: HttpTypes.StoreProductVariant
//   fallbackPriceData?: any // Add this prop type
// }) {
//   // If we have fallback price data, use it instead of calculating
//   if (fallbackPriceData?.formatted) {
//     return (
//       <div className="flex flex-col text-ui-fg-base">
//         <span className="text-xl-semi">
//           <span
//             data-testid="product-price"
//             data-value={fallbackPriceData.amount}
//           >
//             {fallbackPriceData.formatted}
//           </span>
//         </span>
//       </div>
//     )
//   }

//   const { cheapestPrice, variantPrice } = getProductPrice({
//     product,
//     variantId: variant?.id,
//   })

//   const selectedPrice = variant ? variantPrice : cheapestPrice

//   if (!selectedPrice) {
//     return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
//   }

//   // Check if the discount is 0% or negligible
//   const hasRealDiscount = selectedPrice.price_type === "sale" && 
//     selectedPrice.percentage_diff && 
//     parseFloat(selectedPrice.percentage_diff) > 0

//   return (
//     <div className="flex flex-col text-ui-fg-base">
//       <span
//         className={clx("text-xl-semi", {
//           "text-ui-fg-interactive": hasRealDiscount,
//         })}
//       >
//         {!variant && "From "}
//         <span
//           data-testid="product-price"
//           data-value={selectedPrice.calculated_price_number}
//         >
//           {/* If there's no real discount, show original price if available */}
//           {!hasRealDiscount && selectedPrice.original_price 
//             ? selectedPrice.original_price 
//             : selectedPrice.calculated_price}
//         </span>
//       </span>
//       {/* Only show discount information if there's a real discount (not 0%) */}
//       {hasRealDiscount && (
//         <>
//           <p>
//             <span className="text-ui-fg-subtle">Original: </span>
//             <span
//               className="line-through"
//               data-testid="original-product-price"
//               data-value={selectedPrice.original_price_number}
//             >
//               {selectedPrice.original_price}
//             </span>
//           </p>
//           <span className="text-ui-fg-interactive">
//             -{selectedPrice.percentage_diff}%
//           </span>
//         </>
//       )}
//     </div>
//   )
// }

// import { clx } from "@medusajs/ui"
// import { getProductPrice } from "@lib/util/get-product-price"
// import { HttpTypes } from "@medusajs/types"

// export default function ProductPrice({
//   product,
//   variant,
//   fallbackPriceData,
// }: {
//   product: HttpTypes.StoreProduct
//   variant?: HttpTypes.StoreProductVariant
//   fallbackPriceData?: any
// }) {
//   // Return nothing - we don't want to show price above add to cart button
//   return null
// }

import { clx } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
  fallbackPriceData,
  hidePrice = false, // Add option to completely hide the price
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  fallbackPriceData?: any
  hidePrice?: boolean
}) {
  // If we want to hide the price completely (for product detail page)
  if (hidePrice) {
    return null
  }

  // If we have fallback price data from the template, use it
  if (fallbackPriceData?.formatted) {
    return (
      <div className="flex flex-col text-ui-fg-base">
        <span className="text-xl-semi">
          <span
            data-testid="product-price"
            data-value={fallbackPriceData.amount}
          >
            {fallbackPriceData.formatted}
          </span>
        </span>
      </div>
    )
  }

  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  // Check if there's a meaningful discount (greater than 1% to account for rounding)
  const discountPercentage = parseFloat(selectedPrice.percentage_diff || "0")
  const hasRealDiscount = selectedPrice.price_type === "sale" && discountPercentage > 1

  // Determine which price to show
  let displayPrice = selectedPrice.calculated_price
  
  // If there's no real discount, prefer original price
  if (!hasRealDiscount && selectedPrice.original_price) {
    displayPrice = selectedPrice.original_price
  }

  return (
    <div className="flex flex-col text-ui-fg-base">
      <span
        className={clx("text-xl-semi", {
          "text-ui-fg-interactive": hasRealDiscount,
        })}
      >
        {!variant && "From "}
        <span
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {displayPrice}
        </span>
      </span>
      
      {/* Only show discount information if there's a real discount */}
      {hasRealDiscount && (
        <>
          <p>
            <span className="text-ui-fg-subtle">Original: </span>
            <span
              className="line-through"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
          </p>
          <span className="text-ui-fg-interactive">
            -{discountPercentage.toFixed(0)}%
          </span>
        </>
      )}
    </div>
  )
}