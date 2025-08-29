// src/modules/skin/components/skin-product-section/index.tsx
"use client"

import React, { useState, useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import ProductPreview from "@modules/products/components/product-preview"
import { 
  SkinCategory, 
  SkinFilterType 
} from "@modules/skin/types"

type SkinProductSectionProps = {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}

const SkinProductSection: React.FC<SkinProductSectionProps> = ({ products, region }) => {
  const [filter, setFilter] = useState<SkinFilterType>("all")

  const categories: SkinCategory[] = useMemo(() => [
    { 
      id: "all", 
      name: "All Skin", 
      count: products.length 
    },
    { 
      id: "cleanser", 
      name: "Cleansers", 
      count: products.filter(p => 
        p.tags?.some((tag: any) => tag.value?.toLowerCase().includes('cleanser')) ||
        p.title?.toLowerCase().includes('cleanser') ||
        p.title?.toLowerCase().includes('cleansing')
      ).length 
    },
    { 
      id: "moisturizer", 
      name: "Moisturizers", 
      count: products.filter(p => 
        p.tags?.some((tag: any) => 
          tag.value?.toLowerCase().includes('moisturizer') ||
          tag.value?.toLowerCase().includes('cream') ||
          tag.value?.toLowerCase().includes('lotion')
        ) ||
        p.title?.toLowerCase().includes('moisturizer') ||
        p.title?.toLowerCase().includes('cream') ||
        p.title?.toLowerCase().includes('lotion')
      ).length 
    },
    { 
      id: "serum", 
      name: "Serums", 
      count: products.filter(p => 
        p.tags?.some((tag: any) => tag.value?.toLowerCase().includes('serum')) ||
        p.title?.toLowerCase().includes('serum')
      ).length 
    },
    { 
      id: "sunscreen", 
      name: "Sunscreen", 
      count: products.filter(p => 
        p.tags?.some((tag: any) => 
          tag.value?.toLowerCase().includes('sunscreen') ||
          tag.value?.toLowerCase().includes('spf') ||
          tag.value?.toLowerCase().includes('sun protection')
        ) ||
        p.title?.toLowerCase().includes('sunscreen') ||
        p.title?.toLowerCase().includes('spf')
      ).length 
    },
  ], [products])

  const filteredProducts: HttpTypes.StoreProduct[] = useMemo(() => {
    if (filter === "all") return products
    
    return products.filter(product => {
      const title = product.title?.toLowerCase() || ""
      const hasTag = (searchTerms: string[]) => 
        product.tags?.some((tag: any) => {
          const tagValue = tag.value?.toLowerCase() || ""
          return searchTerms.some(term => tagValue.includes(term))
        }) ||
        searchTerms.some(term => title.includes(term))

      switch (filter) {
        case "cleanser":
          return hasTag(['cleanser', 'cleansing'])
        case "moisturizer":
          return hasTag(['moisturizer', 'cream', 'lotion'])
        case "serum":
          return hasTag(['serum'])
        case "sunscreen":
          return hasTag(['sunscreen', 'spf', 'sun protection'])
        default:
          return true
      }
    })
  }, [products, filter])

  const handleFilterChange = (newFilter: SkinFilterType): void => {
    setFilter(newFilter)
  }

  return (
    <div className="py-16 bg-[#F9F5F2]">
      <div className="content-container">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-[26px] font-bold text-gray-900 mb-2 uppercase tracking-wide">
            ESSENTIALS FOR YOUR SKIN
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our complete collection of face essentials designed to cleanse, nourish, and perfect your looks.
          </p>
        </div>

        {/* Filter Buttons - only show if we have products */}
        {/* {products.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleFilterChange(category.id as SkinFilterType)}
                className={`px-6 py-3 rounded-full text-small-regular transition-all duration-200 ${
                  filter === category.id
                    ? "bg-[#B07A5D] text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-[#B07A5D] hover:text-[#B07A5D]"
                }`}
                type="button"
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        )} */}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-[5px]">
          {filteredProducts.slice(0, 8).map((product) => (
            <div key={product.id} className="group">
              <ProductPreview
                product={product}
                region={region}
                isFeatured
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && products.length > 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🧴</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <Text className="text-gray-500 mb-6">
              No products found in the {categories.find(c => c.id === filter)?.name} category.
            </Text>
            <button
              onClick={() => handleFilterChange("all")}
              className="px-6 py-2 bg-[#B07A5D] text-white rounded-full hover:bg-[#9A6B4F] transition-colors"
            >
              View All Products
            </button>
          </div>
        )}

        {/* No Products State */}
        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌿</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
            <Text className="text-gray-500">
              We're working on adding amazing skincare products to our collection.
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}

export default SkinProductSection