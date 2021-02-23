import React from "react";
import { Movie } from "../data"

interface MovieLineProps {
  movie: Movie;
}

const MovieLine: React.FC<MovieLineProps> = ({ movie }) => (
  <li key={movie.tmdb_id}>
    <a href={`https://themoviedb.org/movie/${movie.tmdb_id}`} target="_blank">{movie.name}</a>
  </li>
);

export default MovieLine