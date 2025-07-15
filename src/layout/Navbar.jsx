/** @format */

import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <div className="flex items-center justify-between bg-primary text-white px-6 py-5">
        <h1 className="text-bolder">
          {" "}
          <span className="font-bold ">TechEdge </span>M-Files Tool
        </h1>
        <nav className="flex items-center gap-6">
          <NavLink
            to="/"
            end
            // className={({ isActive }) =>
            //   isActive
            //     ? "bg-[#000042] text-white font-bold px-3 py-1 rounded"
            //     : "text-white hover:text-gray-300"
            // }
          >
            Home
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              isActive
                ? "bg-[#000042] text-white font-bold px-3 py-1 rounded"
                : "text-white hover:text-gray-300"
            }
          >
            Create
          </NavLink>
          <NavLink
            to="/help"
            className={({ isActive }) =>
              isActive
                ? "bg-[#000042] text-white font-bold px-3 py-1 rounded"
                : "text-white hover:text-gray-300"
            }
          >
            Help
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
