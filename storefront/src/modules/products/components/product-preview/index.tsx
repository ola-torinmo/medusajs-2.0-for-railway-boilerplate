import { Text } from "@medusajs/ui"
import { getProductsList } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  // Star rating component
  const StarRating = ({ rating = 5 }) => (
    <div className="flex justify-center space-x-1 mb-3">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`w-4 h-4 ${
            index < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div
        data-testid="product-wrapper"
        className="bg-[#FAFAFA] rounded-[10px] hover:shadow-md transition-shadow duration-200 overflow-hidden"
      >
        {/* Product Image */}
        <div className="overflow-hidden bg-gray-100 rounded-[5px] p-[5px]">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            className="group-hover:scale-105 transition-transform duration-200 object-center object-cover"
          />
        </div>
        
        {/* Product Info */}
        <div className="p-4 text-center">
          {/* Product Title */}
          <h1
            className="font-medium text-gray-900 mb-2 uppercase tracking-wide text-sm line-clamp-2"
            data-testid="product-title"
          >
            {product.title}
          </h1>
          
          {/* Price */}
          <div className="mb-3">
            {cheapestPrice && (
              <div className="text-lg font-bold text-gray-900">
                <PreviewPrice price={cheapestPrice} />
              </div>
            )}
          </div>
          
          {/* Star Rating */}
          <StarRating rating={5} />
          
          {/* Buy Now Button - Takes you to product page */}
          <LocalizedClientLink
            href={`/products/${product.handle}`}
            className="inline-block w-full text-[#B07A5D] font-medium py-2 px-4 rounded transition-colors duration-200 uppercase tracking-wide text-[16px] text-center border border-[#B07A5D] w-[150px] hover:bg-[#B07A5D] hover:text-white"
          >
            BUY NOW
          </LocalizedClientLink>
        </div>
      </div>
    </LocalizedClientLink>
  )
}