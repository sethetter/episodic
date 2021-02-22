export interface AppData {
  currentShows: Show[],
  pastShows: Show[],
  movies: Movie[],
}

interface ApiResponse {
  shows: Show[],
  movies: Movie[],
}

export interface Show {
  name: string;
  tmdb_id: string;
  last_season_watched: number;
  tmdb_data: TmdbShow;
}

interface TmdbShow {
  next_episode_to_air: string;
  seasons: TmdbSeason[];
}

interface TmdbSeason {
  season_number: number;
  air_date: string;
}

export interface Movie {
  name: string;
  watched: string;
  tmdb_id: string;
  tmdb_data: TmdbMovie;
}

interface TmdbMovie {

}

export async function getData() {
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