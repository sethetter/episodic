import { useEffect, useState } from "react";
import { AppData, Show, Movie, getData } from "./data";
import "./App.css";

function App() {
  const [data, setData] = useState<AppData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setError("");
      setLoading(true);
      try {
        setData(await getData());
        setLoading(false);
        setError("");
      } catch (e) {
        setLoading(false);
        setError("Failed to fetch data");
      }
    })();
  }, []);

  const renderShows = (shows: Show[]) =>
    shows.map((show) => (
      <li key={show.tmdb_id}>
        <a href={`https://themoviedb.org/tv/${show.tmdb_id}`} target="_blank">{show.name}</a>
        {show.tmdb_data.next_episode_to_air && <span>&nbsp;(in-progress)</span>}
      </li>
    ));

  function moviesFromData(movies: Movie[]) {
    return movies.map((movie) => <li key={movie.tmdb_id}>
      <a href={`https://themoviedb.org/movie/${movie.tmdb_id}`} target="_blank">{movie.name}</a>
    </li>);
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
              <ul>{renderShows(data!.currentShows)}</ul>

              <h2>Shows Watched</h2>
              <ul>{renderShows(data!.pastShows)}</ul>
            </div>

            <div>
              <h2>Movies</h2>
              <ul>{moviesFromData(data!.movies)}</ul>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default App;
