import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
// import SideMenu from "@modules/layout/components/side-menu"
import heart from '../../../../../public/heart.png'
import search from '../../../../../public/search.png'
// import { Search, Heart } from "lucide-react"
import Image from "next/image"
import cart from '../../../../../public/cart.png'
import logo from '../../../../../public/logo2.png'


export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)
  
  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      {/* Promotional Banner */}
      <div className="bg-[#B07A5D] text-center py-[20px] px-4 ">
        <p className="text-sm text-white font-medium">
          Get 3% and free delivery off your first order. Start shopping today!
        </p>
      </div>

      {/* Main Navigation */}
      <header className="relative py-[20px] mx-auto duration-200 bg-[#F9F5F2] border-ui-border-base">
        <nav className="content-container flex items-center justify-between w-full h-full">
          
          {/* Left side - Mobile menu only */}
          <div className="flex-1 basis-0 h-full flex items-center">
            {/* <div className="h-full block md:hidden">
              <SideMenu regions={regions} />
            </div> */}
            {/* Logo */}
            <LocalizedClientLink
              href="/"
              className="text-2xl font-serif italic text-gray-900 hover:text-gray-600 mr-8"
              data-testid="nav-store-link"
            >
              <Image src={logo} alt="logo" className="w-[90px] h-[60px]" />
            </LocalizedClientLink>
          </div>

          {/* Center - Logo and Desktop Navigation */}
          <div className="flex items-center h-full">
            

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-8">
              <LocalizedClientLink 
                href="/products" 
                className="text-[#10101080] hover:text-[#101010] text-[14px] font-semibold uppercase "
              >
                NEW
              </LocalizedClientLink>
              <LocalizedClientLink 
                href="/" 
                className="text-[#10101080] hover:text-[#101010] text-[14px] font-semibold uppercase "
              >
                BESTSELLERS
              </LocalizedClientLink>
              <LocalizedClientLink 
                href="/skin" 
                className="text-[#10101080] hover:text-[#101010] text-[14px] font-semibold uppercase "
              >
                SKIN
              </LocalizedClientLink>
              <LocalizedClientLink 
                href="/lips" 
                className="text-[#10101080] hover:text-[#101010] text-[14px] font-semibold uppercase "
              >
                LIPS
              </LocalizedClientLink>
              <LocalizedClientLink 
                href="/collections/findyourshade" 
                className="text-[#10101080] hover:text-[#101010] text-[14px] font-semibold uppercase "
              >
                FINDYOURSHADE
              </LocalizedClientLink>
            </div>
          </div>

          {/* Right side - Icons and Cart */}
          <div className="flex items-center gap-x-4 h-full flex-1 basis-0 justify-end">
            {/* Desktop Icons - Hidden on small screens */}
            <div className="hidden small:flex items-center gap-x-4">
              <button className="text-gray-600 hover:text-gray-900">
                <Image src={search} alt="search" className="h-5 w-5 mt-1"/>
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                <Image src={heart} alt="wishlist" className="h-5 w-5 mt-1"/>
              </button>
              {/* <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink> */}
            </div>
            
            {/* Cart Button */}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <span><Image src={cart} alt="cart" className="h-5 w-5 mt-1"/></span>(0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}