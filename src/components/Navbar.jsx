import React from "react";

const Navbar = () => {
  return (
    <div className="text-white ">
      <h1 className="text-amber-600 text-4xl font-bold cursor-pointer">
        CINEMA
      </h1>
      <div>
        <button>Sign in</button>
        <button>Sign up</button>
      </div>
    </div>
  );
};

export default Navbar;
