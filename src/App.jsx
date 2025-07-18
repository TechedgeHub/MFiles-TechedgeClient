/** @format */

import React from "react";
import Homepage from "./pages/Homepage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Create from "./pages/Create";
import Views from "./pages/Views";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/create" element={<Create />} />
          <Route path="/views" element={<Views />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
