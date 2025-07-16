/** @format */

import React from "react";
import Homepage from "./pages/Homepage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Create from "./pages/Create";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/create" element={<Create />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
