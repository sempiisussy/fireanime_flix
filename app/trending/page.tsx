import NetflixSlider from "@/components/netflix-slider"
import NetflixCard from "@/components/netflix-card"
import { getBest } from "@/lib/api"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export async function generateMetadata() {
  return {
    title: `Trending Animes on FireAnime`,
    description: `Browse Trending Animes that are currently loved all over the world.`,
  }
}

export default async function TrendingPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams

  // Get the current page from the URL query or default to 1
  const currentPage = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1

  let animes = []
  let totalPages = 1

  try {
    // Pass the current page to your API function
    const response = await getBest(currentPage)
    animes = response.data

    // Assuming your API returns total pages information
    totalPages = response.pages || 1
  } catch (error) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Failed to load animes</p>
      </div>
    )
  }

  if (animes.length === 0) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">No animes available</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-background pt-24">
      <div className="netflix-container">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Trending Anime</h1>

          <div className="flex gap-2">
            {currentPage > 1 && (
              <Button variant="outline" className="bg-zinc-800 border-none hover:bg-zinc-700" asChild>
                <Link href={`/trending?page=${currentPage - 1}`}>Previous</Link>
              </Button>
            )}
            {currentPage < totalPages && (
              <Button variant="outline" className="bg-zinc-800 border-none hover:bg-zinc-700" asChild>
                <Link href={`/trending?page=${currentPage + 1}`}>Next</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Top trending section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-12">
          {animes.map((anime, index) => (
            <NetflixCard
              key={anime.id}
              anime={anime}
              className="w-full"
              width={240}
              height={360}
              priority={index < 6}
            />
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
                <Link href={`/trending?page=${pageNum}`}>{pageNum}</Link>
              </Button>
            )
          })}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="flex items-center">...</span>
              <Button variant="outline" className="bg-zinc-800 border-none hover:bg-zinc-700" asChild>
                <Link href={`/trending?page=${totalPages}`}>{totalPages}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

