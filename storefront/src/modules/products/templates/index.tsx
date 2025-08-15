import React, { Suspense } from "react"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActionsWrapper from "./product-actions-wrapper"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { getProductPrice as getMedusaPrice } from "@lib/util/get-product-price"
import { getProductPrice as getHardcodedPrice, hasHardcodedPrice } from "@lib/hardcoded-prices"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  // Helper: safe image extraction that matches StoreProductImage shape
  const getProductImages = () => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      // Ensure each image has a rank (some API responses may omit it)
      return product.images.map((img, i) => ({
        id: (img as any).id ?? `img-${i}`,
        url: (img as any).url ?? (img as any).data ?? "",
        rank: typeof (img as any).rank === "number" ? (img as any).rank : i,
      }))
    }

    if (product.thumbnail) {
      return [{ url: product.thumbnail, id: "thumbnail", rank: 0 }]
    }

    return []
  }

  // currency symbol helper
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

  // Check if we should use hardcoded prices (for Nigeria region or for testing purposes)
  const shouldUseHardcodedPrice = region?.countries?.some(
    (country: any) => country.iso_2 === 'ng'
  ) || region?.currency_code?.toUpperCase() === 'NGN' || 
  // TEMPORARY: Force hardcoded prices for testing (remove this line later)
  true

  // Get the price to display
  const getDisplayPrice = () => {
    // Use hardcoded prices for Nigeria region if available
    if (shouldUseHardcodedPrice && hasHardcodedPrice(product.title || '')) {
      return getHardcodedPrice(product.title || '')
    }
    
    // Fall back to normal Medusa pricing
    const { cheapestPrice, variantPrice } = getMedusaPrice({ product })
    const displayPriceObj = variantPrice ?? cheapestPrice

    if (displayPriceObj?.calculated_price) {
      return {
        formatted: `${getCurrencySymbol(region?.currency_code)}${displayPriceObj.calculated_price}`,
        amount: displayPriceObj.calculated_price,
        currency: region?.currency_code || 'NGN',
        originalPrice: null,
      }
    }
    
    // Last resort
    return {
      formatted: 'Contact for price',
      amount: 0,
      currency: 'NGN',
      originalPrice: null,
    }
  }

  const priceData = getDisplayPrice()

  return (
    <div className="content-container py-10">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">Home / {product.title}</div>

      <div className="flex flex-col md:flex-row gap-10 my-[70px]">
        {/* LEFT: Product Images */}
        <div className="flex-1">
          <ImageGallery images={getProductImages()} />
          {getProductImages().length === 0 && (
            <div className="bg-yellow-100 p-4 rounded border border-yellow-300">
              <p className="text-yellow-800">⚠️ No images found for this product</p>
              <p className="text-xs text-yellow-600 mt-1">Check if images are properly uploaded in Medusa backend</p>
            </div>
          )}
        </div>

        {/* RIGHT: Product Details */}
        <div className="flex-1 flex flex-col gap-4 my-auto max-w-xl">
          <h1 className="text-2xl font-semibold">{product.title || "Untitled Product"}</h1>

          <div className="flex items-center gap-2">
            <span className="text-yellow-500 text-lg">★★★★★</span>
            <span className="text-sm text-gray-500">(10 reviews)</span>
          </div>

          {/* Price display - Updated to use hardcoded prices */}
          <div className="text-xl font-bold text-gray-900">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{priceData.formatted}</span>
              {priceData.originalPrice && (
                <span className="text-sm line-through text-gray-500">
                  ₦{priceData.originalPrice.toLocaleString()}
                </span>
              )}
              {shouldUseHardcodedPrice && hasHardcodedPrice(product.title || '') && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Fixed Price
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="text-gray-600">
            {product.description ? <p>{product.description}</p> : <p className="text-gray-400 italic">No description available</p>}
          </div>

          {/* Metadata */}
          {product.metadata && Object.keys(product.metadata).length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Additional Information:</h3>
              {Object.entries(product.metadata).map(([key, value]) => (
                <div key={key} className="text-sm text-gray-600">
                  <span className="font-medium">{key}:</span> {String(value)}
                </div>
              ))}
            </div>
          )}

          {/* Categories */}
          {product.categories && product.categories.length > 0 && (
            <div className="mt-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Categories:</h3>
              <div className="flex gap-2 flex-wrap">
                {product.categories.map((category) => (
                  <span key={category.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Collection */}
          {product.collection && (
            <div className="mt-2">
              <span className="text-sm text-gray-600">
                <span className="font-medium">Collection:</span> {product.collection.title}
              </span>
            </div>
          )}

          {/* Add to Cart */}
          <div className="mt-4">
            <Suspense fallback={<div className="bg-gray-200 animate-pulse h-12 rounded"></div>}>
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 ? (
            <div className="flex gap-2 mt-4 flex-wrap">
              <h3 className="w-full text-sm font-semibold text-gray-700 mb-1">Tags:</h3>
              {product.tags.map((tag) => (
                <span key={tag.id} className="px-3 py-1 bg-gray-100 text-sm rounded-full">{tag.value}</span>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-gray-400 italic">No tags available</p>
            </div>
          )}

          {/* Debug Info */}
          {/* <div className="mt-8 p-4 bg-blue-50 rounded text-xs text-gray-700 border border-blue-200">
            <h4 className="font-semibold mb-2 text-blue-800">🔍 Debug Info:</h4>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <p><strong>Product ID:</strong> {product.id}</p>
              <p><strong>Handle:</strong> {product.handle}</p>
              <p><strong>Variants:</strong> {product.variants?.length || 0}</p>
              <p><strong>Images:</strong> {getProductImages().length}</p>
              <p><strong>Region:</strong> {region?.name} ({region?.currency_code})</p>
              <p><strong>Country:</strong> {countryCode}</p>
              <p><strong>Using Hardcoded Price:</strong> {shouldUseHardcodedPrice && hasHardcodedPrice(product.title || '') ? 'Yes' : 'No'}</p>
            </div>

            <div className="mt-3 p-2 bg-white rounded border">
              <p className="font-semibold text-blue-800 mb-2">Price Debug Details:</p>
              <p className="mb-2"><strong>Current Price Data:</strong> {JSON.stringify(priceData, null, 2)}</p>
              {product.variants?.map((variant: any, idx: number) => (
                <div key={variant.id} className="mb-2 p-2 bg-gray-50 rounded">
                  <p className="font-medium">Variant {idx + 1}: {variant.title || 'Default'}</p>
                  <div className="ml-2 text-xs space-y-1">
                    <p>• calculated_price: {JSON.stringify((variant as any).calculated_price)}</p>
                    <p>• prices array: {JSON.stringify((variant as any).prices)}</p>
                    {variant.metadata?.price && <p>• metadata.price: {JSON.stringify(variant.metadata.price)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default ProductTemplate