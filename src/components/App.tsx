import ShowLine from "./ShowLine"
import MovieLine from "./MovieLine"
import { useData } from "../hooks/useData"
import "./App.css";

function App() {
  const { loading, error, data } = useData();

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
              <ul>{data!.currentShows.map(s => <ShowLine show={s} />)}</ul>

              <h2>Shows Watched</h2>
              <ul>{data!.pastShows.map(s => <ShowLine show={s} />)}</ul>
            </div>

            <div>
              <h2>Movies</h2>
              <ul>{data!.movies.map(m => <MovieLine movie={m} />)}</ul>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default App;
