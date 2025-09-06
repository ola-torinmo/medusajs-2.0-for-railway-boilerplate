"use client"

import { Button } from "@medusajs/ui"
import { isEqual } from "lodash"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"

import { useIntersection } from "@lib/hooks/use-in-view"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"

import MobileActions from "./mobile-actions"
import ProductPrice from "../product-price"
import { addToCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import tickSuccess from '../../../../../public/tick-circle.svg' // Import your tick SVG

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
  initialQuantity?: number        // Add this
  fallbackPriceData?: any        // Add this
}

const optionsAsKeymap = (variantOptions: any) => {
  return variantOptions?.reduce((acc: Record<string, string | undefined>, varopt: any) => {
    if (varopt.option && varopt.value !== null && varopt.value !== undefined) {
      acc[varopt.option.title] = varopt.value
    }
    return acc
  }, {})
}

export default function ProductActions({
  product,
  region,
  disabled,
  initialQuantity = 1,      // Add this with default value
  fallbackPriceData,        // Add this
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [addToCartStatus, setAddToCartStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const countryCode = useParams().countryCode as string
  const router = useRouter()

  // Enhanced stock checking function (moved up to avoid hoisting issues)
  const getStockStatus = (variant: any) => {
    // If we don't manage inventory, we can always add to cart
    if (!variant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (variant.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (variant.manage_inventory && (variant.inventory_quantity || 0) > 0) {
      return true
    }

    return false
  }

  // Debug: Log product and region data
  console.log("ProductActions Debug:", {
    productId: product.id,
    productTitle: product.title,
    variantCount: product.variants?.length || 0,
    regionId: region.id,
    regionCurrency: region.currency_code,
    countryCode,
    hasOptions: product.options?.length || 0
  })

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
      console.log("Auto-selected single variant options:", variantOptions)
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      console.log("No variants available")
      return undefined
    }

    const variant = product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })

    console.log("Selected variant:", {
      variantId: variant?.id,
      variantTitle: variant?.title,
      calculatedPrice: variant?.calculated_price,
      inStock: variant ? getStockStatus(variant) : false
    })

    return variant
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (title: string, value: string) => {
    console.log(`Option selected - ${title}: ${value}`)
    setOptions((prev) => ({
      ...prev,
      [title]: value,
    }))
  }

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    if (!selectedVariant) return false
    return getStockStatus(selectedVariant)
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

// Enhanced add to cart with better error handling and user feedback
const handleAddToCart = async () => {
  if (!selectedVariant?.id) {
    console.error("No variant selected for add to cart")
    return null
  }

  console.log("Adding to cart:", {
    variantId: selectedVariant.id,
    productTitle: product.title,
    variantTitle: selectedVariant.title,
    quantity: initialQuantity, // Use the initialQuantity prop instead of hardcoded 1
    countryCode
  })

  setIsAdding(true)
  setAddToCartStatus('idle')

  try {
    const result = await addToCart({
      variantId: selectedVariant.id,
      quantity: initialQuantity, // Use the initialQuantity prop instead of hardcoded 1
      countryCode,
    })

    console.log("Add to cart success:", result)
    setAddToCartStatus('success')
    
    // Optional: Refresh the page to update cart counter immediately
    // This ensures the cart icon in navigation updates
    setTimeout(() => {
      router.refresh()
    }, 500)

  } catch (error) {
    console.error("Add to cart error:", error)
    setAddToCartStatus('error')
  } finally {
    setIsAdding(false)
    
    // Reset status after 3 seconds
    setTimeout(() => {
      setAddToCartStatus('idle')
    }, 3000)
  }
}

  // Get button text based on state - modified to remove tick emoji
  const getButtonText = () => {
    if (isAdding) return "Adding to cart..."
    if (addToCartStatus === 'success') return "Added to cart!"
    if (addToCartStatus === 'error') return "Error - Try again"
    if (!selectedVariant) return "Select variant"
    if (!inStock) return "Out of stock"
    return "Add to cart"
  }

  // Get button variant based on state
  const getButtonVariant = () => {
    if (addToCartStatus === 'success') return "secondary"
    if (addToCartStatus === 'error') return "danger"
    return "primary"
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        {/* Debug Panel */}
        {/* <div className="bg-blue-50 p-3 rounded text-xs border border-blue-200">
          <p className="font-semibold text-blue-800 mb-1">🔧 Add to Cart Debug:</p>
          <div className="space-y-1 text-blue-700">
            <p><strong>Selected Variant:</strong> {selectedVariant?.id || 'None'}</p>
            <p><strong>In Stock:</strong> {inStock ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Options Selected:</strong> {Object.keys(options).length > 0 ? Object.entries(options).map(([k,v]) => `${k}: ${v}`).join(', ') : 'None'}</p>
            <p><strong>Inventory Managed:</strong> {selectedVariant?.manage_inventory ? 'Yes' : 'No'}</p>
            <p><strong>Quantity Available:</strong> {selectedVariant?.inventory_quantity || 'N/A'}</p>
          </div>
        </div> */}

        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              <h3 className="text-sm font-medium text-gray-700">Select Options:</h3>
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.title ?? ""]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} fallbackPriceData={fallbackPriceData} hidePrice={true}/>

        {/* Enhanced Add to Cart Button with Success Tick */}
        <Button
          onClick={handleAddToCart}
          disabled={!inStock || !selectedVariant || !!disabled || isAdding}
          variant={getButtonVariant() as any}
          className={`w-full h-12 font-semibold transition-all duration-200 border-none outline-0 flex items-center justify-center gap-2 ${
            addToCartStatus === 'success' 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : addToCartStatus === 'error'
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : ''
          }`}
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {/* Show tick icon only when successful */}
          {addToCartStatus === 'success' && (
            <Image 
              src={tickSuccess} 
              alt="success" 
              className="h-5 w-5"
            />
          )}
          <h1 className="font-semibold">{getButtonText()} </h1>
        </Button>

        {/* Success/Error Messages */}
        {/* {addToCartStatus === 'success' && (
          <div className="text-center text-sm text-green-600 font-medium">
            Item successfully added to your cart!
          </div>
        )} */}
        
        {addToCartStatus === 'error' && (
          <div className="text-center text-sm text-red-600 font-medium">
            Failed to add item to cart. Please try again.
          </div>
        )}

        {/* Stock Information */}
        {/* {selectedVariant && (
          <div className="text-xs text-gray-500 text-center">
            {selectedVariant.manage_inventory && (
              <p>
                {selectedVariant.inventory_quantity && selectedVariant.inventory_quantity > 0
                  ? `${selectedVariant.inventory_quantity} items in stock`
                  : selectedVariant.allow_backorder
                  ? "Available for backorder"
                  : "Out of stock"}
              </p>
            )}
            {!selectedVariant.manage_inventory && (
              <p>✅ Always available</p>
            )}
          </div>
        )} */}

        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}