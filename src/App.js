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

  function showsFromData(data) {
    return data.shows.map((show) => {
      const newSeason = show.season.current < show.season.latest;
      return (
        <li key={show.tmdbId}>
          <span>{show.name}</span>
          {newSeason && <span>&nbsp;(New!)</span>}
        </li>
      );
    });
  }

  function moviesFromData(data) {
    return data.movies.map((movie) => <li key={movie.tmdbId}>{movie.name}</li>);
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
              <h2>Shows</h2>
              <ul>{showsFromData(data)}</ul>
            </div>

            <div>
              <h2>Movies</h2>
              <ul>{moviesFromData(data)}</ul>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default App;
