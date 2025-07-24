/** @format */

import { Button } from "@/components/ui/button";
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
    formData,
    handleInputChange,
    handleSubmit,
    isSubmitting,
    submitError,
    submitSuccess,
  } = useCascadingObjects();
  const [selectedClass, setSelectedClass] = useState(null);
  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-5 justify-center mt-10 items-center">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-4xl text-primary">Create New Object</h1>
          <p>Follow the steps to create a new entry in your vault</p>
        </div>

        <form
          onSubmit={handleSubmit}
          // action=""
          className="w-3/4 rounded-lg shadow-sm border border-gray-200 bg-white p-4 space-y-6"
        >
          <div className="mb-5">
            <label
              htmlFor="selectobjectType"
              id="selectobjectType"
              className="block mb-2 text-lg font-medium"
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

          <div className="mb-5">
            <label
              htmlFor="selectClass"
              className="block mb-2 text-lg font-medium "
            >
              Choose Class
            </label>
            <Select
              onValueChange={(val) => {
                const parsed = JSON.parse(val);
                setSelectedClass(parsed);
                setSelectedClassId(parsed.classId);
              }}
              value={selectedClass ? JSON.stringify(selectedClass) : ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Class A" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.classId} value={JSON.stringify(cls)}>
                    {cls.className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* class properties */}
          {classProps.length > 0 && (
            <div className="space-y-4">
              <h3 className="block mb-2 text-lg font-medium">
                Fill Metadata Form
              </h3>
              {classProps.map((prop) => (
                <div key={prop.propId}>
                  <label
                    htmlFor={`prop-${prop.propId}`}
                    id={`prop-${prop.propId}`}
                    className="block mb-1 font-medium"
                  >
                    {prop.title}
                    {prop.isRequired && <span className="text-red-600">*</span>}
                  </label>

                  {prop.isAutomatic ? (
                    <input
                      type="text"
                      value="Automatic"
                      readOnly
                      className="w-full p-2 boarder rounded bg-gray-100"
                    />
                  ) : (
                    <input
                      type={getInputType(prop.propertyType)}
                      value={formData[prop.propId] || ""}
                      onChange={(e) =>
                        handleInputChange(prop.propId, e.target.value)
                      }
                      required={prop.isRequired}
                      className="w-full p-2 border rounded"
                    />
                  )}
                </div>
              ))}
              {/* Error and Success messages */}
              {submitError && (
                <div className="text-red-600 bg-red-50 p-3 rounded">
                  Error: {submitError}
                </div>
              )}

              {submitSuccess && (
                <div className="text-green-600 bg-green-50 p-3 rounded">
                  Object created successfully!
                </div>
              )}
            </div>
          )}

          {/* submit button */}
          <div className="mb-5">
            <label htmlFor="submit" className="block mb-2 text-lg font-medium">
              Submit
            </label>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedObjectType || !selectedClassId}
            >
              {" "}
              {isSubmitting ? "Creating..." : "Create Object"}
            </Button>
          </div>
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
