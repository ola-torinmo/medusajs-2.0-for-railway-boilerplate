// / Force Nigeria region for testing
// ========================================

import { HttpTypes } from "@medusajs/types"
import { useEffect, useState } from "react"

export const useRegion = () => {
  const [region, setRegion] = useState<HttpTypes.StoreRegion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRegion = async () => {
      try {
        // First, try to get the Nigeria region specifically
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/regions`
        )
        const data = await response.json()
        const regions = data.regions || data.data || []
        
        // Find Nigeria region by ID or currency
        const nigeriaRegion = regions.find((r: any) => 
          r.id === process.env.NEXT_PUBLIC_REGION_ID ||
          r.currency_code === 'NGN'
        )
        
        if (nigeriaRegion) {
          setRegion(nigeriaRegion)
          // Store in localStorage for persistence
          localStorage.setItem('medusa_region', JSON.stringify(nigeriaRegion))
        } else if (regions.length > 0) {
          // Fallback to first available region
          setRegion(regions[0])
        }
      } catch (error) {
        console.error("Failed to fetch region:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRegion()
  }, [])

  return { region, loading }
}