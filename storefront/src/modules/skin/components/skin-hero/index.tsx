// src/modules/skin/components/skin-hero/index.tsx
import React from "react"
import { SkinHeroProps } from "@modules/skin/types"
import Image from "next/image"
import Link from "next/link"
// import { Button, Heading } from "@medusajs/ui"
import sophi from '../../../../../public/skinhero.png'
// import arrow from '../../../../../public/arrow.png'


const SkinHero: React.FC<SkinHeroProps> = () => {
  return (
     <section className="relative">
      {/* Image + card wrapper /} */}
      <div className="relative w-full md:h-[710px] h-[310px] overflow-hidden">
        {/* {/ Background Image /} */}
        <Image
          src={sophi}
          alt="Hero background"
          fill
          className=""
          priority
        />
        {/* {/ Product info card – now absolutely positioned */}
        <div className="absolute bottom-[0%] left-[0%] bg-[#F9F5F2] md:w-[400px] w-[200px] md:h-[153px] h-[95px] shadow-sm md:p-[30px] p-[15px] ">
          <h2 className="md:text-[26px] text-[16px] font-semibold text-[#101010] mb-2 ">
            EVERYTHING YOUR FACE
          </h2>
          <h3 className="md:text-[26px] text-[16px] font-semibold text-[#101010] mb-6 ">
            NEEDS
          </h3>
         
          {/* <Link
            href="/products/banana-powder"
            className="inline-block bg-[#B07A5D] text-white font-semibold py-[10.5px] px-[25px] rounded transition-colors duration-200 uppercase tracking-wide"
          >
            DISCOVER <Image src={arrow} alt="Arrow" width={18} height={18} className="inline-block ml-1 mb-1" />
          </Link> */}
        </div>
      </div>
    </section>
  )
}

export default SkinHero