import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Header = () => {
  const { removeBg } = useContext(AppContext);

  return (
    <div className="flex items-center justify-around max-sm:flex-col-reverse gap-y-6 px-4 sm:px-8 my-6 lg:px-44 sm:mt-12">
      <div>
        <h1 className="text-3xl lg:text-5xl 2xl:text-6xl font-bold text-neutral-700 leading-snug">
          Remove the <br />
          <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
            background
          </span>{" "}
          from <br />
          images for free.
        </h1>
        <p className="my-4 text-sm text-gray-500">
        Easily upload any image and get a clean, transparent background in seconds—no design skills needed. 


          <br className="max-md:hidden" />
          Perfect for e-commerce, resumes, design projects, and more!
        </p>
        <div>
          <input
            type="file"
            accept="image/*"
            id="upload1"
            hidden
            onChange={(e) => removeBg(e.target.files[0])}
          />
          <label
            className="inline-flex gap-2 px-6 py-2 rounded-full cursor-pointer bg-gradient-to-r from-violet-600 to-fuchsia-500 m-auto hover:scale-105 transition-all duration-700"
            htmlFor="upload1"
          >
            <img width={20} src={assets.upload_btn_icon} alt="Upload Icon" />
            <p className="text-white text-sm">Upload your image</p>
          </label>
        </div>
      </div>

      <div className="w-full max-w-md">
        <img src={assets.header_img} alt="Header" />
      </div>
    </div>
  );
};

export default Header;
