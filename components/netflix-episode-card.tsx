import Link from "next/link"
import Image from "next/image"
import { Play, Plus, Info } from "lucide-react"
import { Button } from "./ui/button"
import { API_BASE_IMG_URL, type NewestAnimeEpisode } from "@/lib/api"

interface NetflixEpisodeCardProps {
  anime: NewestAnimeEpisode
  className?: string
  width?: number
  height?: number
}

const NetflixEpisodeCard = ({ anime, className = "", width = 320, height = 180 }: NetflixEpisodeCardProps) => {
  return (
    <div className={`netflix-card ${className}`} style={{ width: `${width}px` }}>
      <Link href={`/anime/${anime.slug}/${anime.season}/${anime.episode}`} className="block">
        <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
          <Image
            src={
              anime.poster
                  ? `${API_BASE_IMG_URL}/img/posters/small-${anime.poster}.webp`
                  : "/placeholder.svg"
            }
            alt={anime.title}
            fill
            className="object-cover"
            sizes={`${width}px`}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="rounded-full bg-primary/90 p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Play className="h-6 w-6 text-white" fill="white" />
            </div>
          </div>
        </div>
      </Link>
      <div className="netflix-card-content">
        <div className="flex gap-1 mb-2">
          <Link href={`/anime/${anime.slug}/${anime.season}/${anime.episode}`}>
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30">
            <Play className="h-4 w-4" fill="white" />
          </Button>
          </Link>
          {/* <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30">
            <Plus className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30">
            <Info className="h-4 w-4" />
          </Button> */}
        </div>
        <div className="text-xs space-y-1">
          <h3 className="font-medium">{anime.title}</h3>
          <p>
            S{anime.season} E{anime.episode}
          </p>
          <div className="flex gap-1">
            {anime.has_ger_sub && <span className="netflix-badge">GER-SUB</span>}
            {anime.has_ger_dub && <span className="netflix-badge">GER-DUB</span>}
            {anime.has_eng_sub && <span className="netflix-badge">ENG-SUB</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NetflixEpisodeCard

