import { useState, useEffect } from "react";
import axios from "axios";
import { getTmdbApiKey } from "../utils/GetApi";

const key = getTmdbApiKey();

const useMovieData = (movieId) => {
  const [trailer, setTrailer] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(false);

  const fetchMovieData = async () => {
    if (!movieId) return;

    try {
      setLoading(true);

      const trailerUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${key}&language=en-US`;
      const trailerRes = await axios.get(trailerUrl);
      const trailerVideo = trailerRes.data.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );

      setTrailer(trailerVideo?.key || null);

      const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${key}&language=en-US`;
      const detailsRes = await axios.get(detailsUrl);
      setMovieDetails(detailsRes.data);

      setHasData(!!trailerVideo?.key || !!detailsRes.data);
    } catch (err) {
      console.error("Error fetching movie data:", err);
      setTrailer(null);
      setMovieDetails(null);
      setHasData(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (movieId) {
      fetchMovieData();
    }
  }, [movieId]);

  return { trailer, movieDetails, fetchMovieData, loading, hasData }; // Pastikan fetchMovieData ditambahkan di sini
};

export default useMovieData;
