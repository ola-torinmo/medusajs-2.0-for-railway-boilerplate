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
    <div className="py-16 bg-[#F9F5F2]">
      <div className="content-container">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="md:text-[26px] text-[24px] md:font-bold font-semibold text-[#101010] mb-2 uppercase tracking-wide">
            SHOP OUR BESTSELLER ITEMS
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Try out our highly-rated hits and find out why buyers keep coming back.
          </p>
        </div>

        {/* Mobile Slider - Shows only on mobile */}
        <div className="block sm:hidden mb-8">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 py-2">
            {products.slice(0, 8).map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[280px] group">
                <ProductPreview
                  product={product}
                  region={region}
                  isFeatured
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop/Tablet Grid - Shows on sm screens and up */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-[5px]">
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