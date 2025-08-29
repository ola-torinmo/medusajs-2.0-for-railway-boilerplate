// src/app/[countryCode]/(main)/lips/page.tsx
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getRegion } from "@lib/data/regions"
import LipsTemplate from "@modules/lips/templates"
// import Nav from "@modules/layout/templates/nav"
// import Footer from "@modules/layout/templates/footer"

type Props = {
  params: { countryCode: string }
}

export const metadata: Metadata = {
  title: "Lips Collection | Your Store",
  description: "Discover our premium collection of lipsticks, lip glosses, and lip care products",
}

export default async function LipsPage({ params }: Props) {
  const { countryCode } = params
  
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  return (
    <>
      {/* <Nav /> */}
      <main>
        <LipsTemplate countryCode={countryCode} region={region} />
      </main>
      {/* <Footer /> */}
    </>
  )
}