import React, { useEffect, useState } from "react";
import axios from "axios";
import requests from "../Request";
import useMovieData from "../hooks/useMovieData";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

const Main = () => {
  const [movies, setMovies] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const { trailer, fetchMovieData } = useMovieData(currentMovie?.id);
  const { user } = UserAuth();
  const movieID = doc(db, "users", `${user?.email}`);

  useEffect(() => {
    axios.get(requests.requestPopular).then((response) => {
      setMovies(response.data.results);
      setCurrentMovie(
        response.data.results[
          Math.floor(Math.random() * response.data.results.length)
        ]
      );
    });
  }, []);

  const handlePlayClick = async () => {
    if (currentMovie?.id && !showTrailer) {
      setLoading(true);
      await fetchMovieData();
      setShowTrailer(true);
      setLoading(false);
    }
  };

  const handleWatchLaterClick = async () => {
    if (user?.email) {
      // Menyimpan film ke Firebase di dalam "savedShows"
      await updateDoc(movieID, {
        savedShows: arrayUnion({
          id: currentMovie.id,
          title: currentMovie.title,
          img: currentMovie.backdrop_path,
        }),
      });
      alert("Movie saved to Favourite shows");
    } else {
      alert("Please login to save movies to Watch Later");
    }
  };

  const truncateString = (str, num) => {
    if (str?.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  };

  return (
    <div className="w-full h-[550px] text-white">
      <div className="w-full h-full">
        <div className="absolute w-full h-[550px] bg-gradient-to-r from-black"></div>
        <img
          className="w-full h-full object-cover"
          src={`https://image.tmdb.org/t/p/original/${currentMovie?.backdrop_path}`}
          alt={currentMovie?.title}
        />
        <div className="absolute w-full top-[20%] p-4 md:p-8">
          <h1 className="text-3xl md:text-5xl ">{currentMovie?.title}</h1>
          <div className="my-4 ">
            <button
              className="border bg-gray-300 text-black border-gray-300 py-2 px-5"
              onClick={handlePlayClick}
            >
              Play
            </button>
            <button
              className="border text-white border-gray-300 py-2 px-5 ml-4"
              onClick={handleWatchLaterClick}
            >
              Watch Later
            </button>
          </div>
          <p className="text-gray-400 text-sm">
            Released: {currentMovie?.release_date}
          </p>
          <p className="w-full md:max-w-[70%] lg:max-w-[50%] xl:max-w-[35%] text-gray-200">
            {truncateString(currentMovie?.overview, 150)}
          </p>
        </div>
      </div>

      {/* Modal Trailer */}
      {showTrailer && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/60 flex items-center justify-center z-50"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="relative w-3/4 h-3/4"
            onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal
          >
            {loading ? (
              <p className="text-white text-xl">Loading...</p>
            ) : trailer ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${trailer}`}
                title="Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <p className="text-white text-xl">Trailer not available</p>
            )}
            <div
              className="absolute top-2 right-2 text-white cursor-pointer"
              onClick={() => setShowTrailer(false)}
            >
              X
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
