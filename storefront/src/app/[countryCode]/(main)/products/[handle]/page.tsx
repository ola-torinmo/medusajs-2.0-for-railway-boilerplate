// import { Metadata } from "next"
// import { notFound } from "next/navigation"

// import ProductTemplate from "@modules/products/templates"
// import { getRegion, listRegions } from "@lib/data/regions"
// import { getProductByHandle, getProductsList } from "@lib/data/products"

// type Props = {
//   params: { countryCode: string; handle: string }
// }

// export async function generateStaticParams() {
//   const countryCodes = await listRegions().then(
//     (regions) =>
//       regions
//         ?.map((r) => r.countries?.map((c) => c.iso_2))
//         .flat()
//         .filter(Boolean) as string[]
//   )

//   if (!countryCodes) {
//     return null
//   }

//   const products = await Promise.all(
//     countryCodes.map((countryCode) => {
//       return getProductsList({ countryCode })
//     })
//   ).then((responses) =>
//     responses.map(({ response }) => response.products).flat()
//   )

//   const staticParams = countryCodes
//     ?.map((countryCode) =>
//       products.map((product) => ({
//         countryCode,
//         handle: product.handle,
//       }))
//     )
//     .flat()

//   return staticParams
// }

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { handle } = params
//   const region = await getRegion(params.countryCode)

//   if (!region) {
//     notFound()
//   }

//   const product = await getProductByHandle(handle, region.id)

//   if (!product) {
//     notFound()
//   }

//   return {
//     title: `${product.title} | Medusa Store`,
//     description: `${product.title}`,
//     openGraph: {
//       title: `${product.title} | Medusa Store`,
//       description: `${product.title}`,
//       images: product.thumbnail ? [product.thumbnail] : [],
//     },
//   }
// }

// export default async function ProductPage({ params }: Props) {
//   const region = await getRegion(params.countryCode)

//   if (!region) {
//     notFound()
//   }

//   const pricedProduct = await getProductByHandle(params.handle, region.id)
//   if (!pricedProduct) {
//     notFound()
//   }

//   return (
//     <ProductTemplate
//       product={pricedProduct}
//       region={region}
//       countryCode={params.countryCode}
//     />
//   )
// }


// Force Nigeria region for now
// ========================================

// app/[countryCode]/(main)/products/[handle]/page.tsx
import { Metadata } from "next"
import { notFound } from "next/navigation"
import ProductTemplate from "@modules/products/templates"
import { getRegion, listRegions, getRegionById } from "@lib/data/regions"
import { getProductByHandle, getProductsList } from "@lib/data/products"

type Props = {
  params: { countryCode: string; handle: string }
}

export async function generateStaticParams() {
  const countryCodes = await listRegions().then(
    (regions) =>
      regions
        ?.map((r) => r.countries?.map((c) => c.iso_2))
        .flat()
        .filter(Boolean) as string[]
  )
  
  if (!countryCodes) {
    return null
  }
  
  const products = await Promise.all(
    countryCodes.map((countryCode) => {
      return getProductsList({ countryCode })
    })
  ).then((responses) =>
    responses.map(({ response }) => response.products).flat()
  )
  
  const staticParams = countryCodes
    ?.map((countryCode) =>
      products.map((product) => ({
        countryCode,
        handle: product.handle,
      }))
    )
    .flat()
    
  return staticParams
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = params
  
  // Get region based on country code
  let region = await getRegion(params.countryCode)
  
  // If we have a specific region ID in env, use that as override for testing
  if (process.env.NEXT_PUBLIC_REGION_ID && params.countryCode === 'ng') {
    const envRegion = await getRegionById(process.env.NEXT_PUBLIC_REGION_ID)
    if (envRegion) {
      region = envRegion
    }
  }
  
  if (!region) {
    notFound()
  }
  
  const product = await getProductByHandle(handle, region.id)
  
  if (!product) {
    notFound()
  }
  
  return {
    title: `${product.title} | Sophi Global`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Sophi Global`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  // Get region based on country code from URL
  let region = await getRegion(params.countryCode)
  
  // Override with specific region ID if set in env and accessing /ng/
  if (process.env.NEXT_PUBLIC_REGION_ID && params.countryCode === 'ng') {
    const envRegion = await getRegionById(process.env.NEXT_PUBLIC_REGION_ID)
    if (envRegion) {
      console.log('Using region from env:', envRegion.id, envRegion.currency_code)
      region = envRegion
    }
  }
  
  if (!region) {
    console.error('No region found for:', params.countryCode)
    notFound()
  }
  
  // Debug logging
  console.log('Product page debug:', {
    urlCountryCode: params.countryCode,
    regionId: region.id,
    regionCurrency: region.currency_code,
    regionName: region.name,
    handle: params.handle
  })
  
  const pricedProduct = await getProductByHandle(params.handle, region.id)
  
  if (!pricedProduct) {
    console.error('Product not found:', params.handle)
    notFound()
  }
  
  // Log product variant prices for debugging
  console.log('Product variants:', pricedProduct.variants?.map(v => ({
    title: v.title,
    calculated_price: v.calculated_price,
    inventory: v.inventory_quantity
  })))
  
  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={params.countryCode}
    />
  )
}