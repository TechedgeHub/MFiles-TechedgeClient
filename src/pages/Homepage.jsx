/** @format */

import React from "react";
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
import { NavLink } from "react-router-dom";

//  cards for displaying object creation steps with an icon and label
const StepsCard = ({ icon: Icon, label, description, step }) => (
  <Card className="relative flex flex-col items-center justify-center p-6 gap-4 shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-lg">
    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-blue-900 to-blue-500 flex items-center justify-center text-white font-bold text-sm select-none z-10">
      {step}
    </div>
    <CardContent className="flex flex-col items-center justify-center gap-2 p-0 ">
      <Icon className="w-10 h-10 text-primary" />
      <p className="text-lg font-semibold text-center">{label}</p>
      <p className="text-center">{description}</p>
      {/* <span>{description}</span> */}
    </CardContent>
  </Card>
);

const Homepage = () => {
  return (
    <>
      {" "}
      <div className="h-screen flex flex-col gap-4 items-center py-8 mt-8 px-8">
        <div className="w-full px-4 sm:px-8 md:px-12 max-w-6xl mx-auto text-center space-y-6">
          <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl text-primary">
            M-Files Object Creator
          </h2>

          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Welcome to Your Smart M-Files Assistant
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:justify-center">
            <Button
              asChild
              className="text-white text-base sm:text-lg px-6 py-4"
            >
              <NavLink to="/create"> Start Creating</NavLink>
            </Button>
            <Button
              asChild
              className="text-white text-base sm:text-lg px-6 py-4"
            >
              <NavLink to="/views"> View Dashboard</NavLink>
            </Button>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-medium mt-6">
              Get started in 3 easy steps
            </h3>
            <ul className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-4 text-sm sm:text-base">
              <li className="flex items-center gap-2">
                <CircleCheck className="text-primary w-5 h-5" />
                <span>Select object type</span>
              </li>
              <li className="flex items-center gap-2">
                <SquareChartGantt className="text-primary w-5 h-5" />
                <span>Fill dynamic metadata</span>
              </li>
              <li className="flex items-center gap-2">
                <CircleChevronRight className="text-primary w-5 h-5" />
                <span>Submit & create</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-6xl w-full">
          <StepsCard
            icon={FileText}
            label="Select Type"
            description="Choose from pre-configured document types and templates"
            step="1"
          />
          <StepsCard
            icon={Grid3X3Icon}
            label="Choose Class"
            description="Set appropriate classification and security levels"
            step="2"
          />
          <StepsCard
            icon={RiFileList2Line}
            label="Fill Form"
            description="Fill intelligent forms with dynamic validation"
            step="3"
          />
          <StepsCard
            icon={FaLocationArrow}
            label="Submit"
            description="Submit for processing and integration into your system"
            step="4"
          />
        </div>
        <div className="flex gap-3 border bg-secondary p-4 rounded-md mt-8">
          <CircleCheck className="text-primary" />
          <p>
            Connected to: <span>Techedge Test Vault</span>
          </p>
        </div>
        <div className="mt-8 text-center">
          <p className="mb-2">Build by Elaine Yvette @ Techedge Africa</p>
          <p className="text-sm text-primary font-medium text-center uppercase tracking-wide">
            Powered by Techedge & M-Files
          </p>
        </div>
      </div>
    </>
  );
};

export default Homepage;
