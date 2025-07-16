/** @format */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useObjectTypes from "@/hooks/useObjectTypes";

import Navbar from "@/layout/Navbar";

import React, { useState, useEffect } from "react";

const Create = () => {
  const { objectTypes, selectedObjectType, setSelectedObjectType } =
    useObjectTypes();

  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-5 justify-center mt-10 items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl text-primary">Create New Object</h1>
          <p>Follow the steps to create a new entry in your vault</p>
        </div>
        <form
          action=""
          className="w-3/4 rounded-lg shadow-sm border border-gray-200 bg-white p-4 "
        >
          <div className="mb-5">
            <label
              htmlFor="selectobjectType"
              className="block mb-2 text-lg font-medium "
            >
              Select Object Type
            </label>
            <Select
              onValueChange={setSelectedObjectType}
              value={selectedObjectType}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Student" />
              </SelectTrigger>
              <SelectContent>
                {objectTypes.map((item) => (
                  <SelectItem key={item.objectid} value={item.namesingular}>
                    {item.namesingular}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* <div className="mb-5">
            <label
              htmlFor="selectobjectType"
              className="block mb-2 text-lg font-medium "
            >
              Choose Class
            </label>
            <Select
              onValueChange={setSelectedObjectType}
              value={selectedObjectType}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Class A" />
              </SelectTrigger>
              <SelectContent>
                {objectTypes.map((item) => (
                  <SelectItem key={item.objectid} value={item.namesingular}>
                    {item.namesingular}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}
        </form>
      </div>
    </>
  );
};

export default Create;
