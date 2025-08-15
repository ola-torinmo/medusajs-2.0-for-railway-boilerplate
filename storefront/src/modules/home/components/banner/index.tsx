
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
          <div className="absolute bottom-[0%] left-[0%] bg-white md:w-[450px] w-[250px] md:h-[284px] h-[100px] shadow-sm p-8 ">
            <h2 className="md:text-[30px] text-[22px] font-medium text-[#101010] mb-2 tracking-leading">
             FIND YOUR PERFECT SHADE
            </h2>
            <h3 className="md:text-[16px] text-[22px]  text-[#636363] mb-6 tracking-leading">
              Browse our collection of lipsticks and lip gloss to find the perfect shade that complements your unique style.
            </h3>
            
            <Link 
              href="/products/banana-powder"
              className="inline-block bg-[#B07A5D] text-white font-medium py-3 px-6 rounded transition-colors duration-200 uppercase tracking-wide"
            >
              EXPLORE <Image src={arrow} alt="Arrow" width={20} height={20} className="inline-block ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </footer>
  )
}
