import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Play, Plus, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { API_BASE_IMG_URL, getAnimeDetails } from "@/lib/api"

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  try {
    const response = await getAnimeDetails(params.slug)
    const anime = response.data

    return {
      title: `${anime.title} - FireAnime`,
      description: anime.desc.substring(0, 160),
    }
  } catch (error) {
    return {
      title: "Anime - FireAnime",
      description: "View anime details and episodes",
    }
  }
}

export default async function AnimePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  let anime

  try {
    const response = await getAnimeDetails(params.slug)
    anime = response.data
  } catch (error) {
    notFound()
  }

  return (
    <div className="flex flex-col bg-background pt-16">
      <div className="netflix-detail-hero">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${anime.backdrop ? `${API_BASE_IMG_URL}/img/posters/bg-${anime.backdrop}.webp` : `/placeholder.svg?height=1080&width=1920`})`,
          }}
        ></div>
        <div className="netflix-detail-gradient"></div>

        <div className="netflix-detail-content">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-2xl">{anime.title}</h1>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-green-500 font-semibold">{Math.floor(anime.vote_avg * 10)}% Match</span>
            <span>
              {anime.start}
              {anime.end ? `-${anime.end}` : ""}
            </span>
            <span className="border px-1 text-xs">
              {anime.generes.includes("Adult") || anime.generes.includes("Ecchi") ? "18+" : "13+"}
            </span>
          </div>

          <p className="netflix-synopsis max-w-xl">{anime.desc}</p>

          <div className="flex gap-3 mt-6">
            {anime.anime_seasons.length > 0 && anime.anime_seasons[0].anime_episodes.length > 0 && (
              <Button className="netflix-button-primary" asChild>
                <Link href={`/anime/${anime.slug}/1/1`}>
                  <Play className="h-5 w-5" fill="black" /> Play
                </Link>
              </Button>
            )}
            <Button className="netflix-button-secondary">
              <Plus className="h-5 w-5" /> My List
            </Button>
            <Button className="netflix-button-secondary">
              <ThumbsUp className="h-5 w-5" /> Rate
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 px-4 md:px-16">
        <Tabs defaultValue="episodes" className="w-full">
          <TabsList className="mb-6 bg-zinc-800 p-1 rounded-sm w-auto">
            <TabsTrigger
              value="episodes"
              className="data-[state=active]:bg-zinc-600 data-[state=active]:text-white rounded-sm"
            >
              Episodes
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-zinc-600 data-[state=active]:text-white rounded-sm"
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              value="similar"
              className="data-[state=active]:bg-zinc-600 data-[state=active]:text-white rounded-sm"
            >
              More Like This
            </TabsTrigger>
          </TabsList>

          <TabsContent value="episodes" className="space-y-8">
            {anime.anime_seasons.map((season) => (
              <div key={season.id} className="netflix-jawbone">
                <h3 className="netflix-jawbone-title">Season {season.season}</h3>
                <div className="netflix-episode-list">
                  {season.anime_episodes.map((episode) => (
                    <Link
                      key={episode.id}
                      href={`/anime/${anime.slug}/${season.season}/${episode.episode}`}
                      className="netflix-episode-item"
                    >
                      <div className="netflix-episode-number">{episode.episode}</div>
                      <div className="netflix-episode-thumbnail">
                        <Image
                          src={
                            episode.image
                              ? `${API_BASE_IMG_URL}/img/thumbs/${episode.image}`
                              : `/placeholder.svg?height=180&width=320`
                          }
                          alt={`Episode ${episode.episode}`}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50">
                          <Play className="h-8 w-8" />
                        </div>
                      </div>
                      <div className="netflix-episode-info">
                        <h4 className="netflix-episode-title">Episode {episode.episode}</h4>
                        <div className="netflix-episode-duration">{Math.floor(20 + Math.random() * 5)}m</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="details">
            <div className="netflix-jawbone">
              <h3 className="netflix-jawbone-title">About {anime.title}</h3>
              <div className="netflix-jawbone-content">
                <div className="netflix-jawbone-synopsis">
                  <p className="mb-4">{anime.desc}</p>
                </div>
                <div className="netflix-jawbone-metadata">
                  <div className="netflix-jawbone-metadata-item">
                    <span className="netflix-jawbone-metadata-label">Genres:</span>
                    <span className="netflix-jawbone-metadata-value">{anime.generes.join(", ")}</span>
                  </div>
                  {anime.alternate_titles && (
                    <div className="netflix-jawbone-metadata-item">
                      <span className="netflix-jawbone-metadata-label">Also known as:</span>
                      <span className="netflix-jawbone-metadata-value">{anime.alternate_titles}</span>
                    </div>
                  )}
                  <div className="netflix-jawbone-metadata-item">
                    <span className="netflix-jawbone-metadata-label">Release year:</span>
                    <span className="netflix-jawbone-metadata-value">{anime.start}</span>
                  </div>
                  <div className="netflix-jawbone-metadata-item">
                    <span className="netflix-jawbone-metadata-label">Status:</span>
                    <span className="netflix-jawbone-metadata-value">{anime.end ? "Completed" : "Ongoing"}</span>
                  </div>
                  <div className="netflix-jawbone-metadata-item">
                    <span className="netflix-jawbone-metadata-label">Rating:</span>
                    <span className="netflix-jawbone-metadata-value">
                      {anime.vote_avg.toFixed(1)} ({anime.vote_count} votes)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="similar">
            <div className="netflix-jawbone">
              <h3 className="netflix-jawbone-title">More Like This</h3>
              <p className="text-white/70 mb-4">Titles related to {anime.title}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array(10)
                  .fill(null)
                  .map((_, index) => (
                    <div key={index} className="aspect-[2/3] bg-zinc-800 animate-pulse rounded-sm"></div>
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

