import React from "react";
import { FadeLoader } from "react-spinners";

const Loader = () => {
  return (
    <>
      <div className="main-loader">
        <div className="main-spinner">
          <FadeLoader color={"rgb(188, 13, 13)"} size={5} />
        </div>
      </div>
    </>
  );
};

export default Loader;
