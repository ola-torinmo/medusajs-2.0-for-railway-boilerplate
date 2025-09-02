
import Image from "next/image"
import Link from "next/link"
// import LocalizedClientLink from "@modules/common/components/localized-client-link"
import arrow from '../../../../../public/arrow.png'



export default async function Banner() {

  return (
    <footer className="w-full">
      {/* Promotional Section */}
      <section className="relative">
        {/* Image + card wrapper */}
        <div className="relative w-full md:h-[710px] h-[350px] overflow-hidden">
          {/* Background Image */}
          <Image
            src="/footer.png"
            alt="Hero background"
            fill
            className=""
            priority
          />
      
          {/* Product info card – now absolutely positioned */}
          <div className="absolute bottom-[0%] left-[0%] bg-[#F9F5F2] md:w-[450px] w-[250px]  shadow-sm md:p-8 p-4 ">
            <h2 className="md:text-[26px] text-[22px] font-semibold text-[#101010] mb-2 tracking-leading">
             FIND YOUR PERFECT SHADE
            </h2>
            <p className="md:text-[15px] text-[13px]  text-[#636363] mb-6 tracking-leading hidden md:block">
              Browse our collection of lipsticks and lip gloss to find the perfect shade that complements your unique style.
            </p>
            
            <Link 
              href="/products/banana-powder"
              className="inline-block bg-[#B07A5D] text-white font-medium py-3 px-6 rounded transition-colors duration-200 uppercase tracking-wide"
            >
              EXPLORE <Image src={arrow} alt="Arrow" width={18} height={18} className="inline-block ml-1 mb-1" />
            </Link>
          </div>
        </div>
      </section>
    </footer>
  )
}
