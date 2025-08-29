import Image from "next/image"
import Link from "next/link"
import { Button, Heading } from "@medusajs/ui"
import sophi from '../../../../../public/lipshero.png'
import arrow from '../../../../../public/arrow.png'
const LipsHero = () => {
  return (
    <section className="relative">
  {/* Image + card wrapper /} */}
  <div className="relative w-full md:h-[710px] h-[350px] overflow-hidden">
    {/* {/ Background Image /} */}
    <Image
      src={sophi}
      alt="Hero background"
      fill
      className=""
      priority
    />
    {/* {/ Product info card – now absolutely positioned */}
    <div className="absolute bottom-[0%] left-[0%] bg-[#F9F5F2] md:w-[400px] w-[250px] md:h-[153px] h-[100px] shadow-sm p-[30px] ">
      <h2 className="md:text-[26px] text-[22px] font-semibold text-[#101010] mb-2 ">
        THE BEST PRODUCTS
      </h2>
      <h3 className="md:text-[26px] text-[22px] font-semibold text-[#101010] mb-6 ">
        FOR YOUR LIPS
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
export default LipsHero