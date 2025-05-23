"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Play, Info } from "lucide-react"
import { Button } from "./ui/button"
import { API_BASE_IMG_URL, type SliderItem, getSliders } from "@/lib/api"

const HeroSlider = () => {
  const [sliders, setSliders] = useState<SliderItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        setLoading(true)
        const response = await getSliders()
        setSliders(response.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to load featured content")
        setLoading(false)
      }
    }

    fetchSliders()
  }, [])

  useEffect(() => {
    if (sliders.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % sliders.length)
      }, 6000)
      return () => clearInterval(interval)
    }
  }, [sliders])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? sliders.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sliders.length)
  }

  if (loading) {
    return (
      <div className="w-full h-[600px] bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || sliders.length === 0) {
    return (
      <div className="w-full h-[300px] bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{error || "No featured content available"}</p>
      </div>
    )
  }

  const currentSlide = sliders[currentIndex]

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${`${API_BASE_IMG_URL}/img/sliders/${currentSlide.backdrop}`})`,
          opacity: 1,
        }}
      >
        <div className="absolute inset-0 crunchyroll-gradient"></div>
      </div>

      <div className="absolute inset-0 flex items-end pb-16 md:pb-24">
        <div className="crunchyroll-container mx-auto z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-2">{currentSlide.title}</h1>
            <p className="text-lg md:text-xl text-white/80 mb-2">{currentSlide.subtitle}</p>
            <p className="text-sm md:text-base mb-6 text-white/70 max-w-xl">{currentSlide.description}</p>
            <div className="flex gap-4">
              <Button className="crunchyroll-button flex items-center gap-2 px-6 py-3 text-base" asChild>
                <Link href={currentSlide.path}>
                  <Play className="h-5 w-5" /> Watch Now
                </Link>
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 hover:bg-white/20 text-white flex items-center gap-2 px-6 py-3 text-base"
                asChild
              >
                <Link href={currentSlide.path}>
                  <Info className="h-5 w-5" /> More Info
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-12 w-12 z-20"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-12 w-12 z-20"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next</span>
      </Button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {sliders.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all ${index === currentIndex ? "w-8 bg-primary" : "w-8 bg-white/30"}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSlider

