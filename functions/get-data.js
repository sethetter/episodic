const fetch = require("node-fetch");
const csvParse = require("csv-parse/lib/sync");

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const SHOWS_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=shows`;
const MOVIES_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=movies`;
// const DOCUMENTARIES_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=documentaries`;

const tmdbUrl = (path) =>
  `https://api.themoviedb.org/3${path}?api_key=${TMDB_API_KEY}`;

exports.handler = async () => {
  try {
    const showRows = await getCsvData(SHOWS_URL);
    const movieRows = await getCsvData(MOVIES_URL);

    const shows = (
      await Promise.all(
        showRows.map(async (show) => {
          if (!show.tmdb_id || show.hide === "true") return null;

          const resp = await fetch(tmdbUrl(`/tv/${show.tmdb_id}`));
          if (!resp.ok) throw new Error("Response not ok");

          const tmdb_data = await resp.json();
          const last_season_watched = parseInt(show.last_season_watched);
          return { ...show, last_season_watched, tmdb_data };
        })
      )
    ).filter((s) => s !== null);

    const movies = await Promise.all(
      movieRows.map(async (movie) => {
        if (!movie.tmdb_id || movie.tmdb_id === "") return movie;

        const resp = await fetch(tmdbUrl(`/movie/${movie.tmdb_id}`));
        if (!resp.ok) throw new Error("Response not ok");

        const tmdb_data = await resp.json();
        return { ...movie, tmdb_data };
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ shows, movies }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};

async function getCsvData(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error("Response not ok");
  const data = await resp.text();
  return csvParse(data, { columns: true, skip_empty_lines: true });
}
