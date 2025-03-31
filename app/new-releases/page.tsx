import NetflixSlider from "@/components/netflix-slider"
import NetflixEpisodeCard from "@/components/netflix-episode-card"
import { getNewestEpisodes } from "@/lib/api"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import AnimeEpisodeCard from "@/components/anime-episode-card"

export async function generateMetadata() {
  return {
    title: `New Releases on FireAnime`,
    description: `Browse Newest Anime Releases that are currently loved all over the world.`,
  }
}

export default async function NewReleasesPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams

  // Get the current page from the URL query or default to 1
  const currentPage = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1

  let animes = []
  let totalPages = 1

  try {
    // Pass the current page to your API function
    const response = await getNewestEpisodes(currentPage)
    animes = response.data

    // Assuming your API returns total pages information
    totalPages = response.pages || 1
  } catch (error) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Failed to load newest releases</p>
      </div>
    )
  }

  if (animes.length === 0) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">No releases available</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-background pt-24">
      <div className="netflix-container">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">New Episodes</h1>

          <div className="flex gap-2">
            {currentPage > 1 && (
              <Button variant="outline" className="bg-zinc-800 border-none hover:bg-zinc-700" asChild>
                <Link href={`/new-releases?page=${currentPage - 1}`}>Previous</Link>
              </Button>
            )}
            {currentPage < totalPages && (
              <Button variant="outline" className="bg-zinc-800 border-none hover:bg-zinc-700" asChild>
                <Link href={`/new-releases?page=${currentPage + 1}`}>Next</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-4 mb-12">
          {animes.map((anime) => (
            <AnimeEpisodeCard key={anime.episode_id} anime={anime} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 my-8">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum =
              currentPage <= 3 ? i + 1 : currentPage + i - 2 > totalPages ? totalPages - 4 + i : currentPage + i - 2

            if (pageNum <= 0 || pageNum > totalPages) return null

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                className={
                  currentPage === pageNum
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-zinc-800 border-none hover:bg-zinc-700"
                }
                asChild
              >
                <Link href={`/new-releases?page=${pageNum}`}>{pageNum}</Link>
              </Button>
            )
          })}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="flex items-center">...</span>
              <Button variant="outline" className="bg-zinc-800 border-none hover:bg-zinc-700" asChild>
                <Link href={`/new-releases?page=${totalPages}`}>{totalPages}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

