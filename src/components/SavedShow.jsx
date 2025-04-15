import React, { useState, useEffect } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { updateDoc, doc, onSnapshot } from "firebase/firestore";
import useMovieData from "../hooks/useMovieData";

const SavedShow = () => {
  const [movies, setMovies] = useState([]);
  const [currentMovieId, setCurrentMovieId] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const { user } = UserAuth();

  const { trailer, movieDetails, loading, hasData } =
    useMovieData(currentMovieId);

  useEffect(() => {
    if (!user?.email) return;

    const unsub = onSnapshot(doc(db, "users", `${user.email}`), (docSnap) => {
      const saved = docSnap.data()?.savedShows || [];
      const filtered = saved.filter((item) => item?.id && item?.img);
      setMovies(filtered);
    });

    return () => unsub();
  }, [user?.email]);

  useEffect(() => {
    if (hasData) {
      setShowTrailer(true);
    }
  }, [hasData]);

  const slideLeft = () => {
    const slider = document.getElementById("slider");
    slider.scrollLeft -= 500;
  };

  const slideRight = () => {
    const slider = document.getElementById("slider");
    slider.scrollLeft += 500;
  };

  const handleClick = (itemId) => {
    setCurrentMovieId(itemId); // otomatis trigger useMovieData
  };

  const deleteShow = async (passedID) => {
    try {
      const movieRef = doc(db, "users", `${user?.email}`);
      const filtered = movies.filter((item) => item.id !== passedID);
      await updateDoc(movieRef, { savedShows: filtered });
    } catch (err) {
      console.log("Error deleting show:", err);
    }
  };

  return (
    <div>
      <h2 className="text-white font-bold md:text-xl p-4">
        My Favourite Shows
      </h2>
      <div className="relative flex items-center group">
        <MdChevronLeft
          onClick={slideLeft}
          className="bg-white left-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
          size={40}
        />
        <div
          id="slider"
          className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative"
        >
          {movies.map((item, id) => (
            <div
              key={id}
              className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block cursor-pointer relative p-2"
              onClick={() => handleClick(item.id)}
            >
              <img
                className="w-full h-auto block"
                src={`https://image.tmdb.org/t/p/w500/${item.img}`}
                alt={item.title}
              />
              <div className="absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-white">
                <p className="white-space-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center">
                  {item.title}
                </p>
                <p
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteShow(item.id);
                  }}
                  className="absolute text-gray-300 top-4 right-4"
                >
                  X
                </p>
              </div>
            </div>
          ))}
        </div>
        <MdChevronRight
          onClick={slideRight}
          className="bg-white right-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
          size={40}
        />
      </div>

      {showTrailer && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/60 flex items-center justify-center z-50">
          <div className="relative w-3/4 h-3/4">
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
              ></iframe>
            ) : (
              <p className="text-white text-xl">Trailer not available</p>
            )}
            <div
              className="absolute top-2 right-2 text-white cursor-pointer"
              onClick={() => setShowTrailer(false)}
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

export default SavedShow;
