// "use client"
// import React, { Suspense, useState, useEffect } from "react"
// import ImageGallery from "@modules/products/components/image-gallery"
// import ProductActionsWrapper from "./product-actions-wrapper"
// import { notFound } from "next/navigation"
// import { HttpTypes } from "@medusajs/types"
// import { getProductPrice as getMedusaPrice } from "@lib/util/get-product-price"
// import { getProductPrice as getHardcodedPrice, hasHardcodedPrice } from "@lib/hardcoded-prices"
// import start from "../../../../public/star.png"
// import Image from "next/image"

// type ProductTemplateProps = {
//   product: HttpTypes.StoreProduct
//   region: HttpTypes.StoreRegion
//   countryCode: string
// }

// const ProductTemplate: React.FC<ProductTemplateProps> = ({
//   product,
//   region,
//   countryCode,
// }) => {
//   const [quantity, setQuantity] = useState(1)
//   const [priceData, setPriceData] = useState<any>(null)
//   const [priceLoading, setPriceLoading] = useState(true)

//   if (!product || !product.id) {
//     return notFound()
//   }

//   // Helper: safe image extraction that matches StoreProductImage shape
//   const getProductImages = () => {
//     if (Array.isArray(product.images) && product.images.length > 0) {
//       // Ensure each image has a rank (some API responses may omit it)
//       return product.images.map((img, i) => ({
//         id: (img as any).id ?? `img-${i}`,
//         url: (img as any).url ?? (img as any).data ?? "",
//         rank: typeof (img as any).rank === "number" ? (img as any).rank : i,
//       }))
//     }

//     if (product.thumbnail) {
//       return [{ url: product.thumbnail, id: "thumbnail", rank: 0 }]
//     }

//     return []
//   }

//   // currency symbol helper
//   const getCurrencySymbol = (currencyCode?: string) => {
//     const symbols: Record<string, string> = {
//       NGN: "₦",
//       USD: "$",
//       EUR: "€",
//       GBP: "£",
//       JPY: "¥",
//       CAD: "C$",
//       AUD: "A$",
//     }
//     return currencyCode ? symbols[currencyCode.toUpperCase()] ?? currencyCode.toUpperCase() : ""
//   }

//   // Check if we should use hardcoded prices (for Nigeria region)
//   const shouldUseHardcodedPrice = region?.countries?.some(
//     (country: any) => country.iso_2 === 'ng'
//   ) || region?.currency_code?.toUpperCase() === 'NGN'
//   // REMOVED the forced hardcoded prices - this was blocking Medusa prices!

//   // Get the price to display with proper error handling and timeout
//   const getDisplayPrice = async () => {
//     setPriceLoading(true)

//     try {
//       // Validate region first to avoid the region error
//       if (!region?.id) {
//         console.log('No region ID available, using hardcoded prices')
//         throw new Error('No region available')
//       }

//       // Try to get Medusa pricing first with a timeout and error handling
//       const medusaPricePromise = new Promise((resolve, reject) => {
//         try {
//           const { cheapestPrice, variantPrice } = getMedusaPrice({ product })
//           const displayPriceObj = variantPrice ?? cheapestPrice

//           if (displayPriceObj?.calculated_price) {
//             // Convert calculated_price to number safely
//             const rawPrice = displayPriceObj.calculated_price
//             let priceAmount: number
            
//             if (typeof rawPrice === 'string') {
//               priceAmount = parseFloat(rawPrice)
//             } else if (typeof rawPrice === 'number') {
//               priceAmount = rawPrice
//             } else {
//               reject(new Error('Invalid calculated_price type'))
//               return
//             }

//             // Validate that we have a valid number before any arithmetic
//             if (typeof priceAmount !== 'number' || isNaN(priceAmount) || priceAmount <= 0) {
//               reject(new Error('Invalid price amount from Medusa'))
//               return
//             }

//             // Now TypeScript knows priceAmount is definitely a valid number
//             const displayPrice = priceAmount / 100
            
//             // Handle original price with the same safety
//             let originalPriceValue: number | null = null
//             if (displayPriceObj.original_price) {
//               const rawOriginalPrice = Number(displayPriceObj.original_price)
//               if (!isNaN(rawOriginalPrice)) {
//                 originalPriceValue = rawOriginalPrice / 100
//               }
//             }
            
//             resolve({
//               formatted: `${getCurrencySymbol(region?.currency_code)}${displayPrice.toFixed(2)}`,
//               amount: displayPrice,
//               currency: region?.currency_code || 'NGN',
//               originalPrice: originalPriceValue,
//               source: 'medusa'
//             })
//           } else {
//             reject(new Error('No calculated price available'))
//           }
//         } catch (error) {
//           console.log('Error in getMedusaPrice:', error)
//           reject(error)
//         }
//       })

//       // Set a timeout for backend prices (5 seconds - increased from 3)
//       const timeoutPromise = new Promise((_, reject) => {
//         setTimeout(() => reject(new Error('Price loading timeout')), 5000)
//       })

//       try {
//         // Try to get backend price with timeout
//         const backendPrice = await Promise.race([medusaPricePromise, timeoutPromise])
//         setPriceData(backendPrice)
//         setPriceLoading(false)
//         return
//       } catch (error) {
//         console.log('Backend price error or timeout, checking for hardcoded price:', error)
//       }
//     } catch (error) {
//       console.log('Error in price loading:', error)
//     }

//     // Fallback to hardcoded prices ONLY if backend fails AND hardcoded price exists
//     if (hasHardcodedPrice(product.title || '')) {
//       const hardcodedPrice = getHardcodedPrice(product.title || '')
//       setPriceData({
//         ...hardcodedPrice,
//         source: 'hardcoded'
//       })
//     } else {
//       // Last resort
//       setPriceData({
//         formatted: 'Contact for price',
//         amount: 0,
//         currency: region?.currency_code || 'NGN',
//         originalPrice: null,
//         source: 'fallback'
//       })
//     }
    
//     setPriceLoading(false)
//   }

//   // Load price data on component mount
//   useEffect(() => {
//     getDisplayPrice()
//   }, [product.id, region?.id])

//   // Quantity handlers
//   const handleQuantityIncrease = () => {
//     setQuantity(prev => prev + 1)
//   }

//   const handleQuantityDecrease = () => {
//     setQuantity(prev => prev > 1 ? prev - 1 : 1)
//   }

//   const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = parseInt(e.target.value)
//     if (!isNaN(value) && value >= 1) {
//       setQuantity(value)
//     }
//   }

//   // Debug: Log product data to console
//   useEffect(() => {
//     console.log('Product Data:', {
//       id: product.id,
//       title: product.title,
//       description: product.description,
//       variants: product.variants,
//       prices: product.variants?.map(v => ({
//         id: v.id,
//         prices: (v as any).prices,
//         calculated_price: (v as any).calculated_price
//       }))
//     })
//   }, [product])

//   return (
//     <div className="content-container py-10 bg-[#F9F5F2]">
      
//       <div className="flex flex-col lg:flex-row gap-10 my-[70px]">
//         {/* LEFT: Product Images - Increased width to 55% */}
//         <div className="flex-1 lg:w-[55%]">
//           <ImageGallery images={getProductImages()} />
//           {getProductImages().length === 0 && (
//             <div className="bg-yellow-100 p-4 rounded border border-yellow-300">
//               <p className="text-yellow-800">⚠️ No images found for this product</p>
//               <p className="text-xs text-yellow-600 mt-1">Check if images are properly uploaded in Medusa backend</p>
//             </div>
//           )}
//         </div>

//         {/* RIGHT: Product Details - Decreased width to 45% */}
//         <div className="flex-1 lg:w-[45%] flex flex-col gap-4 my-auto max-w-xl">
//           {/* Breadcrumb */}
//           <div className="text-sm text-gray-500 mb-4">Home / {product.title}</div>
//           <h1 className="text-2xl font-semibold">{product.title || "Untitled Product"}</h1>

//           <div className="flex items-center gap-2">
//             <span className="text-yellow-500 text-lg flex">
//               <Image src={start} alt="Star" width={20} height={20} className="inline-block" />
//               <Image src={start} alt="Star" width={20} height={20} className="inline-block" />
//               <Image src={start} alt="Star" width={20} height={20} className="inline-block" />
//               <Image src={start} alt="Star" width={20} height={20} className="inline-block" />
//               <Image src={start} alt="Star" width={20} height={20} className="inline-block" />
//             </span>
//             <span className="text-sm text-gray-500"><p>(10 reviews)</p></span>
//           </div>

//           {/* Price display with loading state and smart fallback */}
//           <div className="text-xl font-bold text-gray-900">
//             <div className="flex items-center gap-2">
//               {priceLoading ? (
//                 <div className="flex items-center gap-2">
//                   <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
//                   <span className="text-lg text-gray-500">Loading price...</span>
//                 </div>
//               ) : (
//                 <>
//                   <span className="text-2xl">{priceData?.formatted || 'Contact for price'}</span>
//                   {priceData?.originalPrice && (
//                     <span className="text-sm line-through text-gray-500">
//                       {getCurrencySymbol(priceData?.currency)}{priceData.originalPrice.toFixed(2)}
//                     </span>
//                   )}
//                   {priceData?.source === 'hardcoded' && (
//                     <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
//                       Backup Price
//                     </span>
//                   )}
//                   {priceData?.source === 'medusa' && (
//                     <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
//                       Live Price
//                     </span>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Description */}
//           <div className="text-gray-600">
//             {product.description ? <p>{product.description}</p> : <p className="text-gray-400 italic">No description available</p>}
//           </div>

//           {/* Metadata */}
//           {product.metadata && Object.keys(product.metadata).length > 0 && (
//             <div className="mt-4">
//               <h3 className="text-sm font-semibold text-gray-700 mb-2">Additional Information:</h3>
//               {Object.entries(product.metadata).map(([key, value]) => (
//                 <div key={key} className="text-sm text-gray-600">
//                   <span className="font-medium">{key}:</span> {String(value)}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Categories */}
//           {product.categories && product.categories.length > 0 && (
//             <div className="mt-2">
//               <h3 className="text-sm font-semibold text-gray-700 mb-1">Categories:</h3>
//               <div className="flex gap-2 flex-wrap">
//                 {product.categories.map((category) => (
//                   <span key={category.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
//                     {category.name}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Collection */}
//           {product.collection && (
//             <div className="mt-2">
//               <span className="text-sm text-gray-600">
//                 <span className="font-medium">Collection:</span> {product.collection.title}
//               </span>
//             </div>
//           )}

//           {/* Quantity Counter */}
//           <div className="mt-6">
//             <h3 className="text-sm font-semibold text-gray-700 mb-2">Quantity:</h3>
//             <div className="flex items-center gap-3">
//               <div className="flex items-center border border-gray-300 rounded-lg">
//                 <button
//                   onClick={handleQuantityDecrease}
//                   className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
//                   type="button"
//                 >
//                   -
//                 </button>
//                 <input
//                   type="number"
//                   value={quantity}
//                   onChange={handleQuantityChange}
//                   className="w-16 px-3 py-2 text-center border-l border-r border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   min="1"
//                 />
//                 <button
//                   onClick={handleQuantityIncrease}
//                   className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
//                   type="button"
//                 >
//                   +
//                 </button>
//               </div>
//               <span className="text-sm text-gray-500">
//                 {quantity} item{quantity > 1 ? 's' : ''} selected
//               </span>
//             </div>
//           </div>

//           {/* Add to Cart */}
//           <div className="mt-6">
//             <Suspense fallback={<div className="bg-gray-200 animate-pulse h-12 rounded"></div>}>
//               <ProductActionsWrapper 
//                 id={product.id} 
//                 region={region} 
//                 quantity={quantity}
//                 priceData={priceData}
//               />
//             </Suspense>
//           </div>

//           {/* Tags */}
//           {product.tags && product.tags.length > 0 ? (
//             <div className="flex gap-2 mt-4 flex-wrap">
//               <h3 className="w-full text-sm font-semibold text-gray-700 mb-1">Tags:</h3>
//               {product.tags.map((tag) => (
//                 <span key={tag.id} className="px-3 py-1 bg-gray-100 text-sm rounded-full">{tag.value}</span>
//               ))}
//             </div>
//           ) : (
//             <div className="mt-4">
//               <p className="text-sm text-gray-400 italic">No tags available</p>
//             </div>
//           )}

//           {/* Debug Info - Enable this to debug */}
//           {process.env.NODE_ENV === 'development' && (
//             <div className="mt-8 p-4 bg-blue-50 rounded text-xs text-gray-700 border border-blue-200">
//               <h4 className="font-semibold mb-2 text-blue-800">🔍 Debug Info:</h4>
//               <div className="grid grid-cols-2 gap-2 mb-3">
//                 <p><strong>Product ID:</strong> {product.id}</p>
//                 <p><strong>Handle:</strong> {product.handle}</p>
//                 <p><strong>Variants:</strong> {product.variants?.length || 0}</p>
//                 <p><strong>Images:</strong> {getProductImages().length}</p>
//                 <p><strong>Region:</strong> {region?.name} ({region?.currency_code})</p>
//                 <p><strong>Country:</strong> {countryCode}</p>
//                 <p><strong>Price Source:</strong> {priceData?.source || 'Loading...'}</p>
//               </div>

//               <div className="mt-3 p-2 bg-white rounded border">
//                 <p className="font-semibold text-blue-800 mb-2">Price Debug Details:</p>
//                 <pre className="text-xs overflow-auto">
//                   {JSON.stringify(priceData, null, 2)}
//                 </pre>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProductTemplate

"use client"
import React, { Suspense, useState, useEffect } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActionsWrapper from "./product-actions-wrapper"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { getProductPrice as getMedusaPrice } from "@lib/util/get-product-price"
import start from "../../../../public/star.png"
import add from "../../../../public/add-circle.png"
import minus from "../../../../public/minus-cirlce.png"
import Image from "next/image"

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
  const [quantity, setQuantity] = useState(1)
  const [priceData, setPriceData] = useState<any>(null)
  const [priceLoading, setPriceLoading] = useState(true)

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

  // Get the price to display with proper error handling and timeout
  const getDisplayPrice = async () => {
    setPriceLoading(true)

    try {
      // Validate region first to avoid the region error
      if (!region?.id) {
        console.log('No region ID available')
        setPriceData({
          formatted: 'Contact for price',
          amount: 0,
          currency: region?.currency_code || 'NGN',
          source: 'no-region'
        })
        setPriceLoading(false)
        return
      }

      // Get price exactly like the preview component does
      const { cheapestPrice, variantPrice } = getMedusaPrice({ product })
      const displayPriceObj = variantPrice ?? cheapestPrice

      if (displayPriceObj?.original_price) {
        // Use original_price directly like PreviewPrice component
        setPriceData({
          formatted: displayPriceObj.original_price,
          amount: displayPriceObj.original_price_number || 0,
          currency: region?.currency_code || 'NGN',
          source: 'medusa'
        })
      } else if (displayPriceObj?.calculated_price) {
        // Fallback to calculated price if no original price
        setPriceData({
          formatted: displayPriceObj.calculated_price,
          amount: displayPriceObj.calculated_price_number || 0,
          currency: region?.currency_code || 'NGN',
          source: 'medusa'
        })
      } else {
        // No price available
        setPriceData({
          formatted: 'Contact for price',
          amount: 0,
          currency: region?.currency_code || 'NGN',
          source: 'no-price'
        })
      }
    } catch (error) {
      console.log('Error loading price:', error)
      setPriceData({
        formatted: 'Contact for price',
        amount: 0,
        currency: region?.currency_code || 'NGN',
        source: 'error'
      })
    }
    
    setPriceLoading(false)
  }

  // Load price data on component mount
  useEffect(() => {
    getDisplayPrice()
  }, [product.id, region?.id])

  // Quantity handlers
  const handleQuantityIncrease = () => {
    setQuantity(prev => prev + 1)
  }

  const handleQuantityDecrease = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1)
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value >= 1) {
      setQuantity(value)
    }
  }

  // Debug: Log product data to console
  useEffect(() => {
    console.log('Product Data:', {
      id: product.id,
      title: product.title,
      description: product.description,
      variants: product.variants,
      prices: product.variants?.map(v => ({
        id: v.id,
        prices: (v as any).prices,
        calculated_price: (v as any).calculated_price
      }))
    })
  }, [product])

  return (
    <div className="content-container py-10 bg-[#F9F5F2]">
      
      <div className="flex flex-col lg:flex-row gap-10 my-[70px]">
        {/* LEFT: Product Images - Increased width to 55% */}
        <div className="flex-1 lg:w-[55%]">
          <ImageGallery images={getProductImages()} />
          {getProductImages().length === 0 && (
            <div className="bg-yellow-100 p-4 rounded border border-yellow-300">
              <p className="text-yellow-800">⚠️ No images found for this product</p>
              <p className="text-xs text-yellow-600 mt-1">Check if images are properly uploaded in Medusa backend</p>
            </div>
          )}
        </div>

        {/* RIGHT: Product Details - Decreased width to 45% */}
        <div className="flex-1 lg:w-[45%] flex flex-col gap-4 my-auto max-w-xl">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-4">
            <LocalizedClientLink href="/" className="hover:text-gray-700 transition-colors">
              Home
            </LocalizedClientLink>
            <span className="mx-2">/</span>
            <span>{product.title}</span>
          </div>
          <h1 className="text-2xl font-semibold">{product.title || "Untitled Product"}</h1>

          <div className="flex items-center gap-2">
            <span className="text-yellow-500 text-lg flex">
              <Image src={start} alt="Star" width={20} height={20} className="inline-block" />
              <Image src={start} alt="Star" width={20} height={20} className="inline-block" />
              <Image src={start} alt="Star" width={20} height={20} className="inline-block" />
              <Image src={start} alt="Star" width={20} height={20} className="inline-block" />
              <Image src={start} alt="Star" width={20} height={20} className="inline-block" />
            </span>
            <span className="text-sm text-gray-500"><p>(10 reviews)</p></span>
          </div>

          {/* Price display - Show only the price from backend */}
          <div className="text-xl font-bold text-gray-900">
            <div className="flex items-center gap-2">
              {priceLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  <span className="text-lg text-gray-500">Loading price...</span>
                </div>
              ) : (
                <span className="text-2xl">
                  {priceData?.formatted || 'Contact for price'}
                </span>
              )}
            </div>
          </div>
          <div className="border border-[#DADEE3CC] my-3"></div>

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

          {/* Quantity Counter and Add to Cart in a row */}
          <div className="mt-6 flex items-center gap-4">
            {/* Quantity Counter - Styled like the reference image */}
            <div className="flex items-center border border-gray-300 rounded-[5px] px-[15px] py-[12.5px] gap-2">
              <button
                onClick={handleQuantityDecrease}
                className="w-[16px] h-[16px] flex items-center justify-center  rounded-full hover:bg-gray-50 transition-colors"
                type="button"
              >
                <span className=""><Image src={minus} alt="minus"/></span>
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-12 pl-3 text-[#636363CC] text-center bg-[#F9F5F2] text-[16px] font-medium"
                min="1"
                readOnly
              />
              <button
                onClick={handleQuantityIncrease}
                className="w-[16px] h-[16px] flex items-center justify-center  rounded-full hover:bg-gray-50 transition-colors"
                type="button"
              >
                <span className=""><Image src={add} alt="add"/></span>
              </button>
            </div>

            {/* Add to Cart Button - Styled with brown/tan background like reference */}
            <div className="flex-1 mt-3 ">
              <Suspense fallback={<div className="bg-gray-200 animate-pulse  rounded-[5px] w-[160px] h-[45px] "></div>}>
                <div className="[&_button]:bg-[#B07A5D] [&_button]:hover:bg-[#A17E5A] [&_button]:text-white [&_button]:uppercase [&_button]:font-medium [&_button]:text-[14px] [&_button]:tracking-wider [&_button]:py-3 [&_button]:px-4 [&_button]:rounded-[5px] [&_button]:w-[160px] [&_button]:h-[45px]">
                  <ProductActionsWrapper 
                    id={product.id} 
                    region={region} 
                    quantity={quantity}
                    priceData={priceData}
                  />
                </div>
              </Suspense>
            </div>
          </div>
          <div className="border border-[#DADEE3CC] my-3"></div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 ? (
            <div className="flex gap-2 mt-4 flex-wrap">
              {/* <h3 className="w-full text-sm font-semibold text-[#636363] mb-1">Tags:</h3> */}
              {product.tags.map((tag) => (
                <span key={tag.id} className="px-3 py-1 bg-[#FAFAFA] text-[#636363] text-sm rounded-[20px]">{tag.value}</span>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-gray-400 italic">No tags available</p>
            </div>
          )}

          {/* Debug Info - Enable this to debug */}
          {/* {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-blue-50 rounded text-xs text-gray-700 border border-blue-200">
              <h4 className="font-semibold mb-2 text-blue-800">🔍 Debug Info:</h4>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <p><strong>Product ID:</strong> {product.id}</p>
                <p><strong>Handle:</strong> {product.handle}</p>
                <p><strong>Variants:</strong> {product.variants?.length || 0}</p>
                <p><strong>Images:</strong> {getProductImages().length}</p>
                <p><strong>Region:</strong> {region?.name} ({region?.currency_code})</p>
                <p><strong>Country:</strong> {countryCode}</p>
                <p><strong>Price Source:</strong> {priceData?.source || 'Loading...'}</p>
              </div>

              <div className="mt-3 p-2 bg-white rounded border">
                <p className="font-semibold text-blue-800 mb-2">Price Debug Details:</p>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(priceData, null, 2)}
                </pre>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}

export default ProductTemplate
