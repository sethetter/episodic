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

    const shows = await Promise.all(
      showRows.map(async ({ name, tmdb_id, last_season_watched }) => {
        const { latestSeason, nextEpisodeAirDate } = await tmdbApiShow(tmdb_id);
        return {
          name,
          tmdbId: tmdb_id,
          nextEpisodeAirDate,
          season: {
            current: parseInt(last_season_watched),
            latest: latestSeason,
          },
        };
      })
    );

    const movies = await Promise.all(
      movieRows.map(async ({ name, tmdb_id, watched }) => {
        return { name, tmdbId: tmdb_id, watched };
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

async function tmdbApiShow(id) {
  const resp = await fetch(tmdbUrl(`/tv/${id}`));
  if (!resp.ok) throw new Error("Response not ok");
  const data = await resp.json();

  const latestSeason = Math.max(...data.seasons.map((s) => s.season_number));
  const nextEpisodeAirDate = data.next_episode_to_air;

  console.log(data.next_episode_to_air);

  return { latestSeason, nextEpisodeAirDate };
}

async function tmdbApiMovie(id) {}
