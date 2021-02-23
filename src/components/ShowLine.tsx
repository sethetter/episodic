import React from "react"
import { Show } from "../data"

interface ShowProps {
  show: Show;
}

const ShowLine: React.FC<ShowProps> = ({ show }) => (
  <li key={show.tmdb_id}>
    <a href={`https://themoviedb.org/tv/${show.tmdb_id}`} target="_blank">{show.name}</a>
    {show.tmdb_data.next_episode_to_air && <span>&nbsp;(in-progress)</span>}
  </li>
)

export default ShowLine;