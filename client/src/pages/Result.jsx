import React from 'react';
import { assets } from "../assets/assets";

const Result = () => {
  return (
    <div className="mx-4 my-3 lg:mx-44 mt-14 min-h-[75vh]">
      <div className="bg-white rounded-lg px-8 py-8 drop-shadow-sm">
        <div className="flex flex-col sm:grid grid-cols-2 gap-8">
          <div>
            <p className="font-semibold text-gray-600 mb-4">Original</p>
            <img
              className="rounded-md border"
              src={assets.image_w_bg}
              alt="Original"
            />
          </div>

          <div  className="flex flex-col">
            <p className="font-semibold text-gray-600 mb-4">Background Removed</p>
            <div className="rounded-md border border-gray-300 h-full relative bg-layer overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-4 border-violet-600 rounded-full h-12 w-12 border-t-transparent animate-spin"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center sm:justify-end items-center flex-wrap gap-4 mt-6">
          <button className="px-8 py-2.5 text-violet-600 text-sm border border-violet-600 rounded-full hover:scale-105 transition-all duration-700">
            Try another image
          </button>
          <a  className="px-8 py-2.5 text-white teext-sm bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full hover:scale-105 transition-all duration-700"
            href=""
            
          
            >Download image 
          </a>
        </div>
      </div>
    </div>
  );
};

export default Result;
