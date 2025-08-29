// src/modules/lips/templates/index.tsx (Recommended - Simple approach)
import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import { getProductsList } from "@lib/data/products"
import LipsHero from "@modules/lips/components/lips-hero"
import LipsProductSection from "@modules/lips/components/lips-product-section"

interface LipsTemplateProps {
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

async function LipsProductsWrapper({ 
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

    // Filter for lip products
    const lipProducts = allProducts.filter((product: HttpTypes.StoreProduct) => {
      const title = product.title?.toLowerCase() || ""
      
      // Check tags
      const hasLipTag = product.tags?.some((tag: HttpTypes.StoreProductTag) => {
        const tagValue = tag.value?.toLowerCase() || ""
        return ['lipstick', 'lipgloss', 'lipcare', 'lips', 'lip', 'balm'].some(lipTag => 
          tagValue.includes(lipTag)
        )
      })
      
      // Check title
      const hasLipTitle = ['lip', 'lips', 'lipstick', 'gloss', 'balm'].some(lipWord => 
        title.includes(lipWord)
      )
      
      return hasLipTag || hasLipTitle
    })

    // If no specific lip products found, return first 8 products for demo
    const productsToShow = lipProducts.length > 0 ? lipProducts : allProducts.slice(0, 8)

    return <LipsProductSection products={productsToShow} region={region} />
  } catch (error) {
    console.error("Error fetching products:", error)
    return <LipsProductSection products={[]} region={region} />
  }
}

const LipsTemplate: React.FC<LipsTemplateProps> = ({ countryCode, region }) => {
  return (
    <>
      <LipsHero />
      <Suspense fallback={<ProductGridSkeleton />}>
        <LipsProductsWrapper countryCode={countryCode} region={region} />
      </Suspense>
    </>
  )
}

export default LipsTemplate