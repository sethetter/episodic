const fetch = require("node-fetch");
const fs = require("fs/promises");

fs.readFile("./shows.txt").then(async (f) => {
  const shows = f.toString().split("\n");
  for (let show of shows) {
    const searchResp = await fetch(
      `https://api.themoviedb.org/3/search/tv?query=${show}&api_key=${process.env.TMDB_API_KEY}`
    );
    if (!searchResp.ok) {
      throw new Error("Response not ok!");
    }

    // TODO: get the first result, show name and id
    const searchJson = await searchResp.json();
    const { name, id } = searchJson.results[0];

    console.log(id);
  }
});
