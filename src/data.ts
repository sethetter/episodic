export interface AppData {
  currentShows: Show[],
  pastShows: Show[],
  movies: Movie[],
}

export interface Movie extends ApiMovie {}
export interface Show extends ApiShow {}

interface ApiResponse {
  shows: ApiShow[],
  movies: ApiMovie[],
}

interface ApiShow {
  name: string;
  tmdb_id: string;
  last_season_watched: number;
  tmdb_data: TmdbShow;
}

interface ApiMovie {
  name: string;
  watched: string;
  tmdb_id: string;
  tmdb_data: TmdbMovie;
}

interface TmdbShow {
  next_episode_to_air: string;
  seasons: TmdbSeason[];
}

interface TmdbSeason {
  season_number: number;
  air_date: string;
}

interface TmdbMovie {

}

export async function getData(): Promise<AppData> {
  const resp = await fetch("/.netlify/functions/get-data");
  if (!resp.ok) throw new Error("Failed to fetch data");
  const data: ApiResponse =  await resp.json();

  const currentShows = data.shows.filter(
    (show) => show.last_season_watched < Math.max(...show.tmdb_data.seasons.map(s => s.season_number))
  );
  const pastShows = data.shows.filter(
    (show) => show.last_season_watched >= Math.max(...show.tmdb_data.seasons.map(s => s.season_number))
  );

  return { movies: data.movies, currentShows, pastShows}
}