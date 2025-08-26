// lib/data/regions.ts
import { sdk } from "@lib/config"
import { cache } from "react"

export const getRegion = cache(async function (countryCode: string) {
  try {
    // Special handling for Nigeria
    if (countryCode === 'ng') {
      const nigeriaRegionId = process.env.NEXT_PUBLIC_REGION_ID
      
      if (nigeriaRegionId) {
        // Try to get by ID directly
        const regions = await sdk.store.region.list(
          { id: [nigeriaRegionId] },
          { next: { tags: ["regions"] } }
        )
        
        if (regions.regions?.length > 0) {
          console.log('Found Nigeria region by ID:', regions.regions[0].id)
          return regions.regions[0]
        }
      }
    }
    
    // Get all regions and find by country code
    const allRegions = await sdk.store.region.list(
      {},
      { next: { tags: ["regions"] } }
    )
    
    // Find region that contains the country
    const region = allRegions.regions?.find(r => 
      r.countries?.some(c => 
        c.iso_2?.toLowerCase() === countryCode.toLowerCase()
      )
    )
    
    if (region) {
      console.log(`Found region for ${countryCode}:`, region.id, region.currency_code)
      return region
    }
    
    // Special case: if looking for Nigeria by 'ng', also check currency
    if (countryCode === 'ng') {
      const ngRegion = allRegions.regions?.find(r => 
        r.currency_code === 'NGN'
      )
      if (ngRegion) {
        console.log('Found Nigeria region by currency:', ngRegion.id)
        return ngRegion
      }
    }
    
    // If no region found for country code, return first available region
    console.warn(`No region found for country code: ${countryCode}, using first available region`)
    return allRegions.regions?.[0] || null
    
  } catch (error) {
    console.error('Error fetching region:', error)
    return null
  }
})

export const listRegions = cache(async function () {
  return sdk.store.region.list(
    {},
    { next: { tags: ["regions"] } }
  ).then(({ regions }) => regions)
})

// Helper function to get region by ID directly
export const getRegionById = cache(async function (regionId: string) {
  try {
    const regions = await sdk.store.region.list(
      { id: [regionId] },
      { next: { tags: ["regions"] } }
    )
    return regions.regions?.[0] || null
  } catch (error) {
    console.error('Error fetching region by ID:', error)
    return null
  }
})