import React, { useEffect, useState } from "react";
import "./App.css";
// import data from "./data.json";

function App() {
  const [data, setData] = useState({ shows: [], movies: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(async () => {
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
  }, []);

  const currentShows = data.shows.filter(
    (show) => show.season.current < show.season.latest
  );
  const pastShows = data.shows.filter(
    (show) => show.season.current >= show.season.latest
  );

  const showsFromData = (shows) =>
    shows.map((show) => (
      <li key={show.tmdbId}>
        {show.name}
        {show.nextEpisodeAirDate && <span>NEW!</span>}
      </li>
    ));

  function moviesFromData(movies) {
    return movies.map((movie) => <li key={movie.tmdbId}>{movie.name}</li>);
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
