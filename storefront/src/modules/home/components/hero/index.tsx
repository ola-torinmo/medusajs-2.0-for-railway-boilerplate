"use client"

import { useState, useEffect } from "react"
import Image, { StaticImageData } from "next/image"
import Link from "next/link"
import arrow from '../../../../../public/arrow.png'

// Import your hero images
import sophiHero from '../../../../../public/sophihero.png' // Prime Base Serum
import sophiHero2 from '../../../../../public/sophihero2.png' // Lip Love Lipstick
import sophiHero3 from '../../../../../public/sophihero3.png' // Banana Powder
import sophiHero4 from '../../../../../public/sophihero4.png' // Face Base Foundation

interface Slide {
  image: StaticImageData;
  title: string;
  subtitle: string;
  link: string;
  buttonText: string;
}

const Hero = () => {
  const slides: Slide[] = [
    {
      image: sophiHero,
      title: "BANANA POWDER",
      subtitle: "MATTE FINISH",
      link: "/products/powders",
      buttonText: "DISCOVER"
    },
    {
      image: sophiHero2,
       title: "FACE BASE",
      subtitle: "ULTRA HD FOUNDATION",
      link: "/products/foundations",
      buttonText: "BUY NOW"  
    },
    {
      image: sophiHero3,
      title: "PRIME BASE",
      subtitle: "SERUM OIL",
      link: "/products/serum",
      buttonText: "DISCOVER"
      
    },
    {
      image: sophiHero4,
      title: "LIP LOVE",
      subtitle: "WATERPROOF LIQUID LIPSTICK",
      link: "/products/lip-love-liquid-lipstick",
      buttonText: "BUY NOW"
    }
  ]

  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentSlide((prev: number) => (prev + 1) % slides.length)
        setIsTransitioning(false)
      }, 300)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [slides.length])

  const goToSlide = (index: number): void => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide(index)
      setIsTransitioning(false)
    }, 300)
  }

  return (
    <section className="relative">
      {/* Image + card wrapper */}
      <div className="relative w-full md:h-[710px] h-[500px] overflow-hidden bg-[#F9F5F2]">
        
        {/* Background Images with Parallax Effect */}
        {slides.map((slide: Slide, index: number) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
            style={{
              transform: index === currentSlide 
                ? 'translateX(0) scale(1)' 
                : index < currentSlide 
                  ? 'translateX(-100px) scale(1.05)' 
                  : 'translateX(100px) scale(1.05)'
            }}
          >
            <Image
              src={slide.image}
              alt={`${slide.title} hero background`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Subtle gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>
        ))}

        {/* Product info card with fade animation and dynamic positioning */}
        <div 
          className={`absolute bottom-[0%] bg-[#F9F5F2] md:w-[450px] w-[220px] md:h-[218px] h-[120px] shadow-lg md:p-[30px] p-[15px] transition-all duration-500 ${
            isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          } ${
            currentSlide === 1 || currentSlide === 2 
              ? 'left-[0%]' 
              : 'right-[0%]'
          }`}
        >
          <h2 className="md:text-[26px] text-[16px] font-semibold text-[#101010] md:mb-2 mb-1">
            {slides[currentSlide].title}
          </h2>
          <h3 className="md:text-[26px] text-[16px] font-semibold text-[#101010] md:mb-6 mb-3">
            {slides[currentSlide].subtitle}
          </h3>
         
          <Link
            href={slides[currentSlide].link}
            className="inline-block bg-[#B07A5D] text-white font-semibold md:py-[10.5px] py-[5.5px] md:px-[25px] px-[12.5px] rounded transition-all duration-200 uppercase tracking-wide hover:bg-[#966348] hover:shadow-md transform hover:-translate-y-0.5"
          >
            {slides[currentSlide].buttonText} 
            <Image 
              src={arrow} 
              alt="Arrow" 
              width={18} 
              height={18} 
              className="inline-block ml-1 mb-1" 
            />
          </Link>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:flex space-x-3 z-10">
  {slides.map((_slide: Slide, index: number) => (
    <button
      key={index}
      onClick={() => goToSlide(index)}
      className={`transition-all duration-300 ${
        index === currentSlide
          ? 'w-12 h-2 bg-[#B07A5D]'
          : 'w-2 h-2 bg-white/60 hover:bg-white/80'
      } rounded-full`}
      aria-label={`Go to slide ${index + 1}`}
    />
  ))}
</div>
      </div>
    </section>
  )
}

export default Hero