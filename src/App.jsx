/** @format */

import React from "react";
import Homepage from "./pages/Homepage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Create from "./pages/Create";
import Views from "./pages/Views";
import Navbar from "./layout/Navbar";
import Help from "./pages/Help";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/create" element={<Create />} />
        <Route path="/views" element={<Views />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
