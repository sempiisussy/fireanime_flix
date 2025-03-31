import NetflixBillboard from "@/components/netflix-billboard"
import NetflixSlider from "@/components/netflix-slider"
import NetflixCard from "@/components/netflix-card"
import NetflixEpisodeCard from "@/components/netflix-episode-card"
import { getAnimeFromGenre, getBest, getNewestEpisodes } from "@/lib/api"

export const metadata = {
  title: "FireAnime - Home",
  description: "Watch the latest anime episodes and explore new series.",
}

export default async function HomePage() {
  try {
    // Fetch data server-side
    const [
      trendingResponse,
      newReleasesResponse,
      actionAnimeRespone,
      fantasyAnimeResponse,
      comedyAnimeResponse,
      dramaAnimeResponse] = await Promise.allSettled([
      getBest(1),
      getNewestEpisodes(1),
      getAnimeFromGenre("Action", 1),
      getAnimeFromGenre("Fantasy", 1),
      getAnimeFromGenre("Komödie", 1),
      getAnimeFromGenre("Drama", 1),
    ])

    const trendingAnime = trendingResponse.status == 'fulfilled' ? trendingResponse.value.data : []
    const newReleases = newReleasesResponse.status == 'fulfilled' ? newReleasesResponse.value.data : []
    const actionAnime = actionAnimeRespone.status == 'fulfilled' ? actionAnimeRespone.value.data : []
    const fantasyAnime = fantasyAnimeResponse.status == 'fulfilled' ? fantasyAnimeResponse.value.data : []
    const comedyAnime = comedyAnimeResponse.status == 'fulfilled' ? comedyAnimeResponse.value.data : []
    const dramaAnime = dramaAnimeResponse.status == 'fulfilled' ? dramaAnimeResponse.value.data : []

    return (
      <div className="flex flex-col bg-background pt-16">
        <NetflixBillboard />

        <div className="mt-[-100px] relative z-10">
          <NetflixSlider title="Trending Now">
            {trendingAnime.map((anime) => (
              <NetflixCard key={anime.id} anime={anime} priority={true} backdrop={true} />
            ))}
          </NetflixSlider>

          <NetflixSlider title="New Episodes" itemWidth={320}>
            {newReleases.map((anime) => (
              <NetflixEpisodeCard key={anime.episode_id} anime={anime} width={320} height={180} />
            ))}
          </NetflixSlider>

          <NetflixSlider title="Action Anime">
            {actionAnime.map((anime) => (
              <NetflixCard key={anime.id} anime={anime} backdrop={true} />
            ))}
          </NetflixSlider>

          <NetflixSlider title="Fantasy">
            {fantasyAnime.map((anime) => (
              <NetflixCard key={anime.id} anime={anime} backdrop={true} />
            ))}
          </NetflixSlider>

          <NetflixSlider title="Comedy">
            {comedyAnime.map((anime) => (
              <NetflixCard key={anime.id} anime={anime} backdrop={true} />
            ))}
          </NetflixSlider>

          <NetflixSlider title="Drama">
            {dramaAnime.map((anime) => (
              <NetflixCard key={anime.id} anime={anime} backdrop={true} />
            ))}
          </NetflixSlider>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="flex flex-col bg-background pt-16">
        <NetflixBillboard />
        <p>Loading Content Failed {`${error}`}</p>
      </div>
    )
  }
}

