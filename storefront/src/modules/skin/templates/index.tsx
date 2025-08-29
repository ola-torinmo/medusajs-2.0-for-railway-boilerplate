// src/modules/skin/templates/index.tsx
import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import { getProductsList } from "@lib/data/products"
import SkinHero from "@modules/skin/components/skin-hero"
import SkinProductSection from "@modules/skin/components/skin-product-section"

interface SkinTemplateProps {
  countryCode: string
  region: HttpTypes.StoreRegion
}

const ProductGridSkeleton = () => (
  <div className="py-16 bg-[#F9F5F2]">
    <div className="content-container">
      <div className="mb-12 text-center">
        <div className="w-64 h-8 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
        <div className="w-96 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-[5px]">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="w-full animate-pulse">
            <div className="aspect-[29/34] w-full bg-gray-200 rounded-lg"></div>
            <div className="flex flex-col gap-2 mt-4">
              <div className="w-full h-4 bg-gray-200 rounded"></div>
              <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

async function SkinProductsWrapper({ 
  countryCode, 
  region 
}: { 
  countryCode: string
  region: HttpTypes.StoreRegion 
}) {
  try {
    // Fetch products using the same method as your working components
    const data = await getProductsList({
      queryParams: {
        limit: 50,
      },
      countryCode,
    })

    // Extract products from the response
    const allProducts = data.response.products

    // Filter for skin products
    const skinProducts = allProducts.filter((product: HttpTypes.StoreProduct) => {
      const title = product.title?.toLowerCase() || ""
      
      // Check tags for skin-related keywords
      const hasSkinTag = product.tags?.some((tag: HttpTypes.StoreProductTag) => {
        const tagValue = tag.value?.toLowerCase() || ""
        return [
          'cleanser', 'cleansing', 'moisturizer', 'cream', 'lotion', 
          'serum', 'sunscreen', 'spf', 'skincare', 'skin', 'face',
          'toner', 'exfoliant', 'mask', 'treatment'
        ].some(skinTag => tagValue.includes(skinTag))
      })
      
      // Check title for skin-related keywords
      const hasSkinTitle = [
        'cleanser', 'cleansing', 'moisturizer', 'cream', 'lotion',
        'serum', 'sunscreen', 'spf', 'skincare', 'skin', 'face',
        'toner', 'exfoliant', 'mask', 'treatment', 'foundation','pallet', 'blush-pallet', 'powder'
      ].some(skinWord => title.includes(skinWord))
      
      return hasSkinTag || hasSkinTitle
    })

    // If no specific skin products found, return first 8 products for demo
    const productsToShow = skinProducts.length > 0 ? skinProducts : allProducts.slice(0, 8)

    return <SkinProductSection products={productsToShow} region={region} />
  } catch (error) {
    console.error("Error fetching products:", error)
    return <SkinProductSection products={[]} region={region} />
  }
}

const SkinTemplate: React.FC<SkinTemplateProps> = ({ countryCode, region }) => {
  return (
    <>
      <SkinHero />
      <Suspense fallback={<ProductGridSkeleton />}>
        <SkinProductsWrapper countryCode={countryCode} region={region} />
      </Suspense>
    </>
  )
}

export default SkinTemplate