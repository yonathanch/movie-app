import React from "react";
import bgMovie from "../assets/bg-movie.jpg";
import SavedShow from "../components/SavedShow";

const Account = () => {
  return (
    <>
      <div className="w-full text-white">
        <img
          src={bgMovie}
          alt="bg-Movie"
          className=" w-full h-[400px] object-cover"
        />
        <div className="bg-black/60 fixed top-0 left-0 w-full h-[550px]"></div>
        <div className="absolute top-[20%] p-4 md:p-8">
          <h1 className="text-3xl md:text-5xl font-bold">My Favorite Shows</h1>
        </div>
      </div>
      <SavedShow />
    </>
  );
};

export default Account;
