// src/modules/lips/types/index.ts
import { HttpTypes } from "@medusajs/types"

export interface LipsCategory {
  id: string
  name: string
  count: number
}

export interface LipsTemplateProps {
  countryCode: string
  region: HttpTypes.StoreRegion
}

export interface LipsHeroProps {}

export type FilterType = "all" | "lipstick" | "lipgloss" | "lipcare"

// Remove ProductWithTags since we're using the standard StoreProduct
export interface LipsCollectionProps {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
  title?: string
  description?: string
  showViewAll?: boolean
}