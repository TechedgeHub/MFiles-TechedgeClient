/** @format */

import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg sm:text-xl font-bold">
          <span className="font-bold text-white">TechEdge</span>{" "}
          <span className="text-gray-200">M-Files Tool</span>
        </h1>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "bg-[#000042] text-white font-bold px-3 py-1 rounded"
                : "hover:text-gray-300"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              isActive
                ? "bg-[#000042] text-white font-bold px-3 py-1 rounded"
                : "hover:text-gray-300"
            }
          >
            Create
          </NavLink>
          <NavLink
            to="/help"
            className={({ isActive }) =>
              isActive
                ? "bg-[#000042] text-white font-bold px-3 py-1 rounded"
                : "hover:text-gray-300"
            }
          >
            Help
          </NavLink>
        </nav>

        {/*  mobile Hamburger*/}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-2">
          <NavLink
            to="/"
            end
            className="block py-2 border-b border-white/20"
            onClick={toggleMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/create"
            className="block py-2 border-b border-white/20"
            onClick={toggleMenu}
          >
            Create
          </NavLink>
          <NavLink to="/help" className="block py-2" onClick={toggleMenu}>
            Help
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Navbar;
