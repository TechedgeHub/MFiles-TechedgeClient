/** @format */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useCascadingObjects from "@/hooks/useCascadingObjects";
import Navbar from "@/layout/Navbar";
import React, { useState, useEffect } from "react";

const Create = () => {
  const {
    objectTypes,
    selectedObjectType,
    setSelectedObjectType,
    classes,
    selectedClassId,
    setSelectedClassId,
    classProps,
  } = useCascadingObjects();

  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-5 justify-center mt-10 items-center">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-4xl text-primary">Create New Object</h1>
          <p>Follow the steps to create a new entry in your vault</p>
        </div>
        <form
          action=""
          className="w-3/4 rounded-lg shadow-sm border border-gray-200 bg-white p-4 space-y-6"
        >
          <div className="mb-5">
            <label
              htmlFor="selectobjectType"
              className="block mb-2 text-lg font-medium "
            >
              Select Object Type
            </label>
            <Select
              onValueChange={(val) => {
                const parsed = JSON.parse(val);
                setSelectedObjectType(parsed);
              }}
              value={
                selectedObjectType ? JSON.stringify(selectedObjectType) : ""
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Student" />
              </SelectTrigger>
              <SelectContent>
                {objectTypes.map((item) => (
                  <SelectItem key={item.objectid} value={JSON.stringify(item)}>
                    {item.namesingular}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* sellect class */}
          <div className="mb-5">
            <label
              htmlFor="selectClass"
              className="block mb-2 text-lg font-medium "
            >
              Choose Class
            </label>
            <Select
              onValueChange={(val) => setSelectedClassId(val)}
              value={selectedClassId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Class A" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.classId} value={cls.classId}>
                    {cls.className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* class properties */}
          {classProps.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Fill in the Fields</h3>
              {classProps.map((prop) => (
                <div key={prop.propId}>
                  <label htmlFor="" className="block mb-1 font-medium">
                    {prop.title}
                    {prop.isRequired && <span className="text-red-600">*</span>}
                  </label>
                  <input
                    type={getInputType(prop.propertyType)}
                    name={`prop-${prop.propId}`}
                    required={prop.isRequired}
                    readOnly={prop.isAutomatic}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
    </>
  );
};

function getInputType(type) {
  switch (type) {
    case "MFDatatypeText":
      return "text";
    case "MFDatatypeInteger":
      return "number";
    case "MFDatatypeDate":
      return "date";
    case "MFDatatypeTimestamp":
      return "datetime-local";
    default:
      return "text";
  }
}
export default Create;
