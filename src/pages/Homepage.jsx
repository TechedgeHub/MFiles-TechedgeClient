/** @format */

import React from "react";
import Navbar from "../layout/Navbar";
import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";

const Homepage = () => {
  return (
    <>
      {" "}
      <Navbar />
      <div className="flex flex-col gap-4 items-center py-8">
        <h2 className="text-sbold text-4xl text-primary">
          M-Files Object Creator
        </h2>
        <p>Create and manage vaults easily-no login required</p>

        <Button>Start Creating</Button>
        <div className="gap-3">
          <ul className="flex gap-3">
            <li className="flex gap-2">
              {" "}
              <span>
                {" "}
                <CircleCheck />
              </span>{" "}
              Select object type
            </li>
            <li className="flex gap-2">
              {" "}
              <span>
                {" "}
                <SquareChartGantt />
              </span>
              Fill dynamic metadata
            </li>
            <li className="flex gap-2">submit & create</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Homepage;
