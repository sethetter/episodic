import React, { useEffect, useState } from "react";
import "./App.css";

interface Data {
  shows: Show[],
  movies: Movie[],
}

interface Show {
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

interface Movie {
  name: string;
  watched: string;
  tmdb_id: string;
  tmdb_data: TmdbMovie;
}

interface TmdbMovie {

}

function App() {
  const [data, setData] = useState<Data>({ shows: [], movies: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setError("");
      setLoading(true);
      try {
        const resp = await fetch("/.netlify/functions/get-data");
        if (!resp.ok) throw new Error("Failed to fetch data");

        const respBody = await resp.json();
        setData(respBody);

        setLoading(false);
        setError("");
      } catch (e) {
        setLoading(false);
        setError("Failed to fetch data");
      }
    })();
  }, []);

  const currentShows = data.shows.filter(
    (show) => show.last_season_watched < Math.max(...show.tmdb_data.seasons.map(s => s.season_number))
  );
  const pastShows = data.shows.filter(
    (show) => show.last_season_watched >= Math.max(...show.tmdb_data.seasons.map(s => s.season_number))
  );

  const showsFromData = (shows: Show[]) =>
    shows.map((show) => (
      <li key={show.tmdb_id}>
        {show.name}
        {show.tmdb_data.next_episode_to_air && <span>NEW!</span>}
      </li>
    ));

  function moviesFromData(movies: Movie[]) {
    return movies.map((movie) => <li key={movie.tmdb_id}>{movie.name}</li>);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Episodic</h1>
      </header>
      <section className="App-content">
        {loading && !error ? (
          <p>Loading!</p>
        ) : error !== "" ? (
          <p>{`Something went wrong: ${error}`}</p>
        ) : (
          <>
            <div>
              <h2>Shows To Watch</h2>
              <ul>{showsFromData(currentShows)}</ul>

              <h2>Shows Watched</h2>
              <ul>{showsFromData(pastShows)}</ul>
            </div>

            <div>
              <h2>Movies</h2>
              <ul>{moviesFromData(data.movies)}</ul>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default App;
