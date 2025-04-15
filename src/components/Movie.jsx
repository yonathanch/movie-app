import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { UserAuth } from "../context/AuthContext.jsx";
import { db } from "../firebase.js";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import useMovieData from "../hooks/useMovieData"; // Import custom hook

const Movie = ({ item }) => {
  const [like, setLike] = useState(false);
  const { user } = UserAuth();

  // Menggunakan custom hook untuk mendapatkan trailer dan detail film
  const { trailer, movieDetails, fetchMovieData, loading } = useMovieData(
    item.id
  );

  const [showTrailer, setShowTrailer] = useState(false);
  const movieID = doc(db, "users", `${user?.email}`);

  const saveShow = async () => {
    if (user?.email) {
      setLike(!like);
      await updateDoc(movieID, {
        savedShows: arrayUnion({
          id: item.id,
          title: item.title,
          img: item.backdrop_path,
        }),
      });
    } else {
      alert("Please Login to save a Movie");
    }
  };

  const handleClick = async () => {
    await fetchMovieData(); // Memanggil fungsi fetch dari custom hook
    setShowTrailer(true); // Menampilkan modal
  };

  return (
    <div
      className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block cursor-pointer relative p-2"
      onClick={handleClick}
    >
      <img
        className="w-full h-auto block"
        src={`https://image.tmdb.org/t/p/w500/${item?.backdrop_path}`}
        alt={item?.title}
      />
      <div className="absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-white">
        <p className="white-space-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center">
          {item?.title}
        </p>
        <p
          onClick={(e) => {
            e.stopPropagation(); //mencegah event bubbling ke luar
            saveShow();
          }}
        >
          {like ? (
            <FaHeart className="absolute top-4 left-4 text-gray-300 cursor-pointer" />
          ) : (
            <FaRegHeart className="absolute top-4 left-4 text-gray-300 cursor-pointer" />
          )}
        </p>
      </div>

      {showTrailer && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/60 flex items-center justify-center z-50"
          onClick={() => setShowTrailer(false)} // Menutup jika klik area di luar trailer
        >
          <div
            className="relative w-3/4 h-3/4"
            onClick={(e) => e.stopPropagation()} //mencegah event bubbling ke luar
          >
            {/* Mencegah klik keluar modal */}
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
              onClick={() => setShowTrailer(false)} // Menutup trailer saat tombol X ditekan
            >
              X
            </div>
            {movieDetails && (
              <div className="absolute bottom-2 left-0 right-0 mx-2 text-white bg-black bg-opacity-50 p-3 rounded max-w-full overflow-hidden">
                <h2 className="text-lg font-bold mb-1 truncate">
                  {movieDetails.title}
                </h2>
                <p className="text-sm line-clamp-2 mb-1">
                  {movieDetails.overview}
                </p>
                <p className="text-xs opacity-80">
                  Release Date: {movieDetails.release_date}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Movie;
