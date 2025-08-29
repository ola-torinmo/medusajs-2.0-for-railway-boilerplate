// src/modules/skin/types/index.ts
import { HttpTypes } from "@medusajs/types"

export interface SkinCategory {
  id: string
  name: string
  count: number
}

export interface SkinTemplateProps {
  countryCode: string
  region: HttpTypes.StoreRegion
}

export interface SkinHeroProps {}

export type SkinFilterType = "all" | "cleanser" | "moisturizer" | "serum" | "sunscreen"

export interface SkinCollectionProps {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
  title?: string
  description?: string
  showViewAll?: boolean
}