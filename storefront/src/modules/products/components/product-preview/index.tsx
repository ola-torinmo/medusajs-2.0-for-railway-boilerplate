import { Text } from "@medusajs/ui"
import { getProductsList } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import  Star  from "../../../../../public/star.png"
import Image from "next/image"
import Link from "next/link"

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
      <Image
        key={index}
        src={Star}
        alt="star"
        className={`w-4 h-4 ${
          index < rating ? 'opacity-100' : 'opacity-30'
        }`}
      />
    ))}
  </div>
)

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div
        data-testid="product-wrapper"
        className="bg-[#FAFAFA] rounded-[15px] border-[1px] border-[#ECECEC] transition-shadow duration-200 overflow-hidden"
      >
        {/* Product Image */}
        <div className="overflow-hidden  rounded-[5px] p-[5px]">
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
            className="font-semibold text-[#101010CC] mb-2 uppercase tracking-wide text-sm line-clamp-2"
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
          <Link
            href={`/products/${product.handle}`}
            className="inline-block w-full text-[#B07A5D] font-semibold py-2 w-[88.5px] rounded transition-colors duration-200 uppercase tracking-wide text-[14px] text-center border border-[#B07A5D]  hover:bg-[#B07A5D] hover:text-white"
          >
            BUY NOW
          </Link>
        </div>
      </div>
    </LocalizedClientLink>
  )
}