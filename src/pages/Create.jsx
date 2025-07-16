/** @format */

import Navbar from "@/layout/Navbar";
import React from "react";

const Create = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-5 justify-center mt-10 items-center">
        <div className="flex flex-col">
          <h1 className="text-4xl text-primary">Create New Object</h1>
          <p>Follow the steps to create a new entry in your vault</p>
        </div>
        <form action="" className=""></form>
      </div>
    </>
  );
};

export default Create;
