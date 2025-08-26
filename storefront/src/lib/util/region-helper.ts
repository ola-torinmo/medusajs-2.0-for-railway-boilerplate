// lib/utils/region-helper.ts
// ========================================

export async function getDefaultRegion() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/regions`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    
    if (!response.ok) {
      throw new Error("Failed to fetch regions")
    }
    
    const { regions } = await response.json()
    
    // Find Nigerian region or first available region
    const ngRegion = regions.find((r: any) => 
      r.currency_code?.toLowerCase() === 'ngn' ||
      r.countries?.some((c: any) => c.iso_2 === 'ng')
    )
    
    return ngRegion || regions[0]
  } catch (error) {
    console.error("Error fetching regions:", error)
    return null
  }
}