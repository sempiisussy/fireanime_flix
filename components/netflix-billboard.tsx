"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Play, Info } from "lucide-react"
import { Button } from "./ui/button"
import { API_BASE_IMG_URL, type SliderItem, getSliders } from "@/lib/api"

const NetflixBillboard = () => {
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
      }, 10000)
      return () => clearInterval(interval)
    }
  }, [sliders])

  if (loading) {
    return (
      <div className="w-full h-[56.25vw] max-h-[80vh] bg-zinc-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || sliders.length === 0) {
    return (
      <div className="w-full h-[56.25vw] max-h-[80vh] bg-zinc-900 flex items-center justify-center">
        <p className="text-muted-foreground">{error || "No featured content available"}</p>
      </div>
    )
  }

  const currentSlide = sliders[currentIndex]

  return (
    <div className="netflix-billboard">
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${`${API_BASE_IMG_URL}/img/sliders/${currentSlide.backdrop}`})`,
          opacity: 1,
        }}
      ></div>
      <div className="netflix-billboard-gradient"></div>

      <div className="netflix-billboard-content">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 max-w-2xl">{currentSlide.title}</h1>
        <p className="netflix-synopsis max-w-xl">{currentSlide.description}</p>
        <div className="flex gap-3">
          <Button className="netflix-button-primary" asChild>
            <Link href={currentSlide.path}>
              <Play className="h-5 w-5" fill="black" /> Play
            </Link>
          </Button>
          <Button className="netflix-button-secondary" asChild>
            <Link href={currentSlide.path}>
              <Info className="h-5 w-5" /> More Info
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NetflixBillboard

