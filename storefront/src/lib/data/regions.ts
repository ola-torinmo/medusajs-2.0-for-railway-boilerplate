import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { cache } from "react"
import { HttpTypes } from "@medusajs/types"

export const listRegions = cache(async function () {
  return sdk.store.region
    .list({}, { next: { tags: ["regions"] } })
    .then(({ regions }) => regions)
    .catch(medusaError)
})

export const retrieveRegion = cache(async function (id: string) {
  return sdk.store.region
    .retrieve(id, {}, { next: { tags: ["regions"] } })
    .then(({ region }) => region)
    .catch(medusaError)
})

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = cache(async function (countryCode: string) {
  try {
    // 1. Return cached region if available
    if (countryCode && regionMap.has(countryCode)) {
      return regionMap.get(countryCode)
    }

    // 2. Fetch regions from Medusa
    const regions = await listRegions()
    if (!regions || regions.length === 0) {
      console.warn("⚠️ No regions found from Medusa API")
      return null
    }

    // 3. Populate regionMap
    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        if (c?.iso_2) {
          regionMap.set(c.iso_2, region)
        }
      })
    })

    // 4. Match requested countryCode OR fall back to first region
    let region = null
    if (countryCode) {
      region = regionMap.get(countryCode)
      if (!region) {
        console.warn(`⚠️ No matching region for countryCode="${countryCode}". Falling back to first region.`)
        region = regions[0]
      }
    } else {
      region = regions[0]
    }

    return region
  } catch (e: any) {
    console.error("❌ Error getting region:", e)
    return null
  }
})
