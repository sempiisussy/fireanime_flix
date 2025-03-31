"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"

interface NetflixSliderProps {
  title: string
  children: React.ReactNode
  className?: string
  itemWidth?: number
}

const NetflixSlider = ({ title, children, className = "", itemWidth = 240 }: NetflixSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    const slider = sliderRef.current
    if (slider) {
      slider.addEventListener("scroll", checkScrollButtons)
      // Initial check
      checkScrollButtons()
      // Check after images might have loaded
      setTimeout(checkScrollButtons, 500)
      return () => slider.removeEventListener("scroll", checkScrollButtons)
    }
  }, [])

  const scrollLeft = () => {
    if (sliderRef.current) {
      const scrollAmount = itemWidth * 2
      sliderRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (sliderRef.current) {
      const scrollAmount = itemWidth * 2
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <div className={`netflix-row ${className}`}>
      <h2 className="netflix-row-title">{title}</h2>
      <div className="netflix-slider-wrapper group">
        {canScrollLeft && (
          <Button
            variant="ghost"
            size="icon"
            className="netflix-slider-prev"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        <div ref={sliderRef} className="netflix-carousel">
          {children}
        </div>
        {canScrollRight && (
          <Button
            variant="ghost"
            size="icon"
            className="netflix-slider-next"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default NetflixSlider

