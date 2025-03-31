"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, Play, Volume2, VolumeX, Maximize, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type EpisodeDetails, type AnimeDetails, getEpisode, getAnimeDetails, API_BASE_IMG_URL } from "@/lib/api"

export default function EpisodePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const season = params.season as string
  const episode = params.episode as string

  const [episodeData, setEpisodeData] = useState<EpisodeDetails | null>(null)
  const [animeData, setAnimeData] = useState<AnimeDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingEpisode, setLoadingEpisode] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [episodeError, setEpisodeError] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ger-sub")
  const [videoSource, setVideoSource] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!slug || !season || !episode) return

      try {
        setLoading(true)
        setLoadingEpisode(true)

        getEpisode(slug, season, episode)
          .then((episodeResponse) => {
            setEpisodeData(episodeResponse.data)
            // Set default language based on availability
            if (episodeResponse.data.has_ger_sub) {
              setSelectedLanguage("ger-sub")
            } else if (episodeResponse.data.has_eng_sub) {
              setSelectedLanguage("eng-sub")
            } else if (episodeResponse.data.has_ger_dub) {
              setSelectedLanguage("ger-dub")
            }
            const ger_sub_link = episodeResponse.data.anime_episode_links.filter((l) => l.lang == "ger-sub").at(0)?.link
            const ger_dub_link = episodeResponse.data.anime_episode_links.filter((l) => l.lang == "ger-dub").at(0)?.link
            const eng_sub_link = episodeResponse.data.anime_episode_links.filter((l) => l.lang == "eng-sub").at(0)?.link
            if (ger_sub_link) {
              setVideoSource(ger_sub_link)
            } else if (ger_dub_link) {
              setVideoSource(ger_dub_link)
            } else if (eng_sub_link) {
              setVideoSource(eng_sub_link)
            }
          })
          .catch((error) => {
            setEpisodeError(error)
          })
          .finally(() => {
            setLoadingEpisode(false)
          })
        const [animeResponse] = await Promise.all([getAnimeDetails(slug)])

        setAnimeData(animeResponse.data)

        setLoading(false)
      } catch (err) {
        setError("Failed to load episode")
        setLoading(false)
      }
    }

    fetchData()
  }, [slug, season, episode])

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !animeData) {
    return (
      <div className="netflix-container py-12 text-center">
        <p className="text-muted-foreground">{error || "Episode not found"}</p>
      </div>
    )
  }

  // Find current episode index and determine prev/next episodes
  const currentSeason = animeData.anime_seasons.find((s) => s.season === season)
  const currentEpisodeIndex = currentSeason?.anime_episodes.findIndex((e) => e.episode === episode) ?? -1

  const prevEpisode = currentEpisodeIndex > 0 ? currentSeason?.anime_episodes[currentEpisodeIndex - 1] : null

  const nextEpisode =
    currentEpisodeIndex < (currentSeason?.anime_episodes.length ?? 0) - 1
      ? currentSeason?.anime_episodes[currentEpisodeIndex + 1]
      : null

  return (
    <div className="bg-black min-h-screen">
      <div className="relative w-full">
        <div
          className="relative w-full aspect-video bg-black"
        >
          {videoSource ? (
            <iframe
              src={videoSource}
              className="w-full h-full"
              allowFullScreen
              title={`${animeData.title} S${season}E${episode}`}
            ></iframe>
          ) : loadingEpisode ? (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <p className="text-muted-foreground">Video source not available</p>
            </div>
          )}
        </div>
      </div>

      <div className="netflix-container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href={`/anime/${slug}`} className="text-muted-foreground hover:text-primary flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to {animeData.title}
            </Link>
            <h1 className="text-2xl font-bold mt-2">
              {animeData.title}: Season {season}, Episode {episode}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700">
              <ThumbsUp className="h-4 w-4" />
              {episodeData?.like_count || 0}
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700">
              <ThumbsDown className="h-4 w-4" />
              {episodeData?.dislike_count || 0}
            </Button>
          </div>
        </div>

        {episodeData && (
          <div className="mb-8">
            <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage} className="w-full max-w-md">
              <TabsList className="bg-zinc-800 p-1 rounded-sm">
                {episodeData.has_ger_sub && (
                  <TabsTrigger
                    value="ger-sub"
                    className="data-[state=active]:bg-zinc-600 data-[state=active]:text-white rounded-sm"
                  >
                    German Sub
                  </TabsTrigger>
                )}
                {episodeData.has_ger_dub && (
                  <TabsTrigger
                    value="ger-dub"
                    className="data-[state=active]:bg-zinc-600 data-[state=active]:text-white rounded-sm"
                  >
                    German Dub
                  </TabsTrigger>
                )}
                {episodeData.has_eng_sub && (
                  <TabsTrigger
                    value="eng-sub"
                    className="data-[state=active]:bg-zinc-600 data-[state=active]:text-white rounded-sm"
                  >
                    English Sub
                  </TabsTrigger>
                )}
              </TabsList>
            </Tabs>

            {episodeData.anime_episode_links.filter((l) => l.lang === selectedLanguage).length > 0 && (
              <Tabs value={videoSource || ""} onValueChange={setVideoSource} className="w-full max-w-md mt-4">
                <TabsList className="bg-zinc-800 p-1 rounded-sm">
                  {episodeData.anime_episode_links
                    .filter((l) => l.lang === selectedLanguage)
                    .map((link) => (
                      <TabsTrigger
                        key={link.id}
                        value={link.link}
                        className="data-[state=active]:bg-zinc-600 data-[state=active]:text-white rounded-sm"
                      >
                        {link.name}
                      </TabsTrigger>
                    ))}
                </TabsList>
              </Tabs>
            )}
          </div>
        )}

        <div className="flex justify-between mb-8">
          {prevEpisode ? (
            <Button variant="outline" className="bg-zinc-800 border-none hover:bg-zinc-700" asChild>
              <Link href={`/anime/${slug}/${season}/${prevEpisode.episode}`}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous Episode
              </Link>
            </Button>
          ) : (
            <Button variant="outline" className="bg-zinc-800 border-none hover:bg-zinc-700" disabled>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous Episode
            </Button>
          )}

          {nextEpisode ? (
            <Button className="bg-primary hover:bg-primary/90 text-white" asChild>
              <Link href={`/anime/${slug}/${season}/${nextEpisode.episode}`}>
                Next Episode <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button className="bg-primary hover:bg-primary/90 text-white" disabled>
              Next Episode <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="netflix-jawbone">
          <h3 className="netflix-jawbone-title">Episodes</h3>
          <div className="netflix-episode-list">
            {currentSeason?.anime_episodes.map((ep) => (
              <Link
                key={ep.id}
                href={`/anime/${slug}/${season}/${ep.episode}`}
                className={`netflix-episode-item ${ep.episode === episode ? "bg-zinc-800" : ""}`}
              >
                <div className="netflix-episode-number">{ep.episode}</div>
                <div className="netflix-episode-thumbnail">
                  <Image
                    src={
                      ep.image ? `${API_BASE_IMG_URL}/img/thumbs/${ep.image}` : `/placeholder.svg?height=180&width=320`
                    }
                    alt={`Episode ${ep.episode}`}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50">
                    <Play className="h-8 w-8" />
                  </div>
                </div>
                <div className="netflix-episode-info">
                  <h4 className="netflix-episode-title">Episode {ep.episode}</h4>
                  <div className="netflix-episode-duration">{Math.floor(20 + Math.random() * 5)}m</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {animeData.anime_seasons.length > 1 && (
          <div className="netflix-jawbone mt-8">
            <h3 className="netflix-jawbone-title">Seasons</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
              {animeData.anime_seasons.map((s) => (
                <Link
                  key={s.id}
                  href={`/anime/${slug}/${s.season}/1`}
                  className={`block p-4 rounded-sm ${s.season === season ? "bg-zinc-800 border-l-2 border-primary" : "bg-zinc-900 hover:bg-zinc-800"}`}
                >
                  <div className="font-medium">Season {s.season}</div>
                  <div className="text-sm text-white/70">{s.anime_episodes.length} episodes</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

