import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";

const MainBanner = () => {
  return (
    <div className="relative">
      <img
        src={assets.main_banner_bg}
        alt="banner"
        className="w-full hidden md:block brightness-50"
      />
      <img
        src={assets.main_banner_bg_sm}
        alt="banner"
        className="w-full md:hidden brightness-50"
      />
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-2-72 md:max-w-80 lg:max-w-105 leading-tight lg:leading-15 text-white">
          Freshness you can trust ,saving you will love
        </h1>

        <div className="flex items-center mt-6 font-medium">
          <NavLink
            to="/products"
            className="group flex items-center gap-2 md:px-9 py-3 bg-[#00FF41] hover:bg-[#00CC33] transition rounded text-black cursor-pointer font-semibold"
          >
            shop now
            <img
              className="md:hidden transition group-focus:translate-x-1"
              src={assets.white_arrow_icon}
              alt=""
            />
          </NavLink>

          <NavLink
            to="/products"
            className="group hidden md:flex items-center gap-2 px-9 py-2 cursor-pointer text-[#00FF41] hover:text-[#00CC33] transition"
          >
            explor deals
            <img
              className="transition group-hover:translate-x-1"
              src={assets.black_arrow_icon}
              alt="arrow"
            />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
