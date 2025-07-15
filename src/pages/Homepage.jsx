/** @format */

import React from "react";
import Navbar from "../layout/Navbar";
import { Button } from "@/components/ui/button";
import {
  CircleCheck,
  CircleChevronRight,
  FileText,
  Grid3X3Icon,
  ListCheck,
  SquareChartGantt,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FaLocationArrow } from "react-icons/fa6";
import { RiFileList2Line } from "react-icons/ri";

const StepsCard = ({ icon: Icon, label }) => (
  <Card className="flex flex-col items-center justify-center p-4 gap-2 shadow-sm hover:shadow-md transition">
    <CardContent className="flex flex-col items-center justify-center ">
      <Icon className="w-8 h-8 text-primary" />
      <p className="text-sm font-medium mt-2 text-center">{label}</p>
    </CardContent>
  </Card>
);

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
            <li className="flex gap-2">
              <span>
                {" "}
                <CircleChevronRight />
              </span>
              submit & create
            </li>
          </ul>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StepsCard icon={FileText} label="Select Type" />
          <StepsCard icon={Grid3X3Icon} label="Choose Class" />
          <StepsCard icon={RiFileList2Line} label="Fill Form" />
          <StepsCard icon={FaLocationArrow} label="Submit" />
        </div>
      </div>
    </>
  );
};

export default Homepage;
