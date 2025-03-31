import Link from "next/link"
import Image from "next/image"
import { Play, Plus, ThumbsUp, ChevronDown } from "lucide-react"
import { Button } from "./ui/button"
import { API_BASE_IMG_URL, type AnimeSearchItem } from "@/lib/api"

interface NetflixCardProps {
  anime: AnimeSearchItem
  className?: string
  width?: number
  height?: number
  priority?: boolean
  backdrop?: boolean
}

const NetflixCard = ({ anime, className = "", width = 240, height = 135, priority = false, backdrop=false }: NetflixCardProps) => {
  return (
    <div className={`netflix-card ${className}`} style={{ width: `${width}px` }}>
      <Link href={`/anime/${anime.slug}`} className="block">
        <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
          <Image
            src={ !backdrop  
                ? (anime.poster ? `${API_BASE_IMG_URL}/img/posters/small-${anime.poster}.webp` : "/placeholder.svg")
                : anime.backdrop ? `${API_BASE_IMG_URL}/img/posters/bg-${anime.backdrop}.webp` : "/placeholder.svg"
            }
            alt={anime.title}
            fill
            className="object-cover"
            sizes={`${width}px`}
            priority={priority}
          />
        </div>
      </Link>
      <div className="netflix-card-content">
        <div className="flex gap-1 mb-2">
          <Link href={`/anime/${anime.slug}`}>
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30">
            <Play className="h-4 w-4" fill="white" />
          </Button>
          </Link>
          {/* <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30">
            <Plus className="h-4 w-4" />
          </Button> */}
          {/* <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30">
            <ThumbsUp className="h-4 w-4" />
          </Button> */}
          {/* <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 ml-auto">
            <ChevronDown className="h-4 w-4" />
          </Button> */}
        </div>
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-green-500 font-semibold">{Math.floor(anime.vote_avg * 10)}% Match</span>
            <span className="border px-1 text-[10px]">
              {anime.generes.includes("Adult") || anime.generes.includes("Ecchi") ? "18+" : "13+"}
            </span>
            <span>
              {anime.start}
              {anime.end ? `-${anime.end}` : ""}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {anime.generes.slice(0, 3).map((genre, index) => (
              <span key={genre}>
                {genre}
                {index < Math.min(anime.generes.length, 3) - 1 && <span className="mx-1">•</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NetflixCard

