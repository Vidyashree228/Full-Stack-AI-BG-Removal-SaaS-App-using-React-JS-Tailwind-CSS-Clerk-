import React from 'react'
import { assets, plans } from "../assets/assets";

const BuyCredit = () => {
  return (
    <div className="min-h-[82vh] text-center pt-14 mb-10">
      <button className="border border-gray-400 px-10 py-2 rounded-full mb-6">
        Our Plans
      </button>

      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl font-semibold mt-4 bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent mb-8 sm:mb-10">
        Choose the plan that`s right for you
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-10 md:px-20">
        {plans.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <img width={40} src={assets.logo_icon} alt="Plan Logo" className="mx-auto mb-4" />
            <p className="mt-3 font-semibold text-lg">{item.id}</p>
            <p className="text-sm text-gray-600">{item.desc}</p>
            <p className="mt-6">
              <span className="text-3xl font-medium">${item.price}</span> / {item.credits} credits
            </p>
            <button
              className="w-full text-white text-sm mt-8 bg-gray-800 rounded-md py-2.5 hover:bg-gray-700 transition-colors duration-200"
            >
              Purchase
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyCredit;
