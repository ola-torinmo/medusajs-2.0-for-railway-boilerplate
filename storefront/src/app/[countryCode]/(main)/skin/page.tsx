// src/app/[countryCode]/(main)/skin/page.tsx
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getRegion } from "@lib/data/regions"
import SkinTemplate from "@modules/skin/templates"
// import Nav from "@modules/layout/templates/nav"
// import Footer from "@modules/layout/templates/footer"

type Props = {
  params: { countryCode: string }
}

export const metadata: Metadata = {
  title: "Skin Collection | Your Store",
  description: "Discover our premium skincare collection for healthy, glowing skin",
}

export default async function SkinPage({ params }: Props) {
  const { countryCode } = params
  
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  return (
    <>
      {/* <Nav /> */}
      <main>
        <SkinTemplate countryCode={countryCode} region={region} />
      </main>
      {/* <Footer /> */}
    </>
  )
}