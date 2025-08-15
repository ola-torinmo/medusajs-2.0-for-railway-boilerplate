// import { listCategories } from "@lib/data/categories"
// import { listCollections } from "@lib/data/collections"
// import { Text, clx } from "@medusajs/ui"

// import LocalizedClientLink from "@modules/common/components/localized-client-link"
// import MedusaCTA from "@modules/layout/components/medusa-cta"
import Image from "next/image"
import Link from "next/link"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import arrow from '../../../../../public/arrow.png'
import fb from "../../../../../public/fb.png"
import ig from "../../../../../public/ig.png"
import ticktock from "../../../../../public/ticktock.png"
import copyright from "../../../../../public/copyright.png"


export default async function Footer() {
  // const { collections } = await listCollections({
  //   fields: "*products",
  // })
  // const productCategories = await listCategories()

  return (
    <footer className="w-full">

      {/* Main Footer */}
      <div className="bg-white ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Social Media Icons */}
          <div className="border-t border-gray-200 my-6"></div>
          <div className="flex justify-center space-x-6 mb-8">
            <a 
              href="https://instagram.com/sophysglobal" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Image src={ig} alt="ig" className="w-[40px] h-[40px]"/>
            </a>
            
            <a 
              href="https://facebook.com/sophysglobal" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Image src={fb} alt="fb" className="w-[40px] h-[40px]"/>
            </a>
            
            <a 
              href="https://tiktok.com/@sophysglobal" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Image src={ticktock} alt="tiktok" className="w-[40px] h-[40px]"/>
            </a>
          </div>
          
          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
            <LocalizedClientLink 
              href="/about" 
              className="text-gray-600 hover:text-gray-900 text-sm uppercase tracking-wide font-medium"
            >
              ABOUT US
            </LocalizedClientLink>
            <LocalizedClientLink 
              href="/shipping" 
              className="text-gray-600 hover:text-gray-900 text-sm uppercase tracking-wide font-medium"
            >
              SHIPPING & DELIVERY
            </LocalizedClientLink>
            <LocalizedClientLink 
              href="/returns" 
              className="text-gray-600 hover:text-gray-900 text-sm uppercase tracking-wide font-medium"
            >
              RETURN POLICY
            </LocalizedClientLink>
            <LocalizedClientLink 
              href="/terms" 
              className="text-gray-600 hover:text-gray-900 text-sm uppercase tracking-wide font-medium"
            >
              TERMS & CONDITIONS
            </LocalizedClientLink>
            <LocalizedClientLink 
              href="/privacy" 
              className="text-gray-600 hover:text-gray-900 text-sm uppercase tracking-wide font-medium"
            >
              PRIVACY POLICY
            </LocalizedClientLink>
          </div>
          
          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              <span><Image src={copyright} alt="copyright" className="w-5 h-5 inline-block ml-2 mb-1"/></span> 2025 Sophi Global
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
