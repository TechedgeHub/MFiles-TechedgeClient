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
import React from "react";

const Create = () => {
  const {
    objectTypes,
    selectedObjectType,
    setSelectedObjectType,
    classes,
    selectedClassId,
    setSelectedClassId,
    formData,
    handleInputChange,
    handleFileChange,
    handleSubmit,
    isSubmitting,
    submitError,
    submitSuccess,
    isDocumentObject,
    metadataLoading,
    allProperties,
    lookupOptions, // Added this
  } = useCascadingObjects();

  if (metadataLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading metadata...
      </div>
    );
  }

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
          className="w-3/4 rounded-lg shadow-sm border border-gray-200 bg-white p-4 space-y-6"
        >
          {/* Select Object Type */}
          <div className="mb-5">
            <label className="block mb-2 text-lg font-medium">
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
                <SelectValue placeholder="Select object type" />
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

          {/* Select Class */}
          <div className="mb-5">
            <label className="block mb-2 text-lg font-medium">
              Choose Class
            </label>
            <Select
              onValueChange={(val) => {
                const parsed = JSON.parse(val);
                setSelectedClassId(parsed.classId.toString());
              }}
              value={
                classes.find((c) => c.classId.toString() === selectedClassId)
                  ? JSON.stringify(
                      classes.find(
                        (c) => c.classId.toString() === selectedClassId
                      )
                    )
                  : ""
              }
              disabled={!selectedObjectType}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select class" />
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

          <h2 className="block mb-2 text-lg font-medium">Fill Metadata Form</h2>

          {allProperties.map((prop) => {
            if (prop.isHidden) return null;

            // Single Lookup property
            if (prop.propertytype === "MFDatatypeLookup") {
              return (
                <div key={prop.propId} className="mb-4">
                  <label className="block mb-1 font-medium">
                    {prop.title}
                    {prop.isRequired && <span className="text-red-600">*</span>}
                  </label>
                  <Select
                    value={formData[prop.propId]?.id?.toString() || ""}
                    onValueChange={(val) => {
                      if (val === "__none__") {
                        handleInputChange(prop.propId, null);
                      } else {
                        handleInputChange(prop.propId, { id: parseInt(val) });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${prop.title}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">None</SelectItem>
                      {lookupOptions?.[prop.propId]?.map((option) => (
                        <SelectItem
                          key={option.id}
                          value={option.id.toString()}
                        >
                          {option.name || option.title || `ID: ${option.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            }

            // Multi-select lookup with checkboxes
            if (prop.propertytype === "MFDatatypeMultiSelectLookup") {
              const selectedValues = formData[prop.propId] || [];

              return (
                <div key={prop.propId} className="mb-4">
                  <label className="block mb-1 font-medium">
                    {prop.title}
                    {prop.isRequired && <span className="text-red-600">*</span>}
                  </label>

                  <div className="border rounded p-2 max-h-40 overflow-y-auto bg-white">
                    {lookupOptions?.[prop.propId]?.map((option) => {
                      const isSelected = selectedValues.some(
                        (item) => (item.id || item) === option.id
                      );

                      return (
                        <div
                          key={option.id}
                          className="flex items-center space-x-2 mb-1"
                        >
                          <input
                            type="checkbox"
                            id={`${prop.propId}-${option.id}`}
                            checked={isSelected}
                            onChange={(e) => {
                              let newValues;
                              if (e.target.checked) {
                                // Add to selection
                                newValues = [
                                  ...selectedValues,
                                  { id: option.id },
                                ];
                              } else {
                                // Remove from selection
                                newValues = selectedValues.filter(
                                  (item) => (item.id || item) !== option.id
                                );
                              }
                              handleInputChange(prop.propId, newValues);
                            }}
                            className="rounded"
                          />
                          <label
                            htmlFor={`${prop.propId}-${option.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {option.name || option.title || `ID: ${option.id}`}
                          </label>
                        </div>
                      );
                    })}
                  </div>

                  {/* Show selected count */}
                  {selectedValues.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      Selected: {selectedValues.length} item(s)
                    </div>
                  )}
                </div>
              );
            }

            // Boolean property
            if (prop.propertytype === "MFDatatypeBoolean") {
              return (
                <div key={prop.propId} className="mb-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData[prop.propId] || false}
                      onChange={(e) =>
                        handleInputChange(prop.propId, e.target.checked)
                      }
                      className="rounded"
                    />
                    <span className="font-medium">
                      {prop.title}
                      {prop.isRequired && (
                        <span className="text-red-600">*</span>
                      )}
                    </span>
                  </label>
                </div>
              );
            }

            // Automatic property
            if (prop.isAutomatic) {
              return (
                <div key={prop.propId} className="mb-4">
                  <label className="block mb-1 font-medium">{prop.title}</label>
                  <input
                    type="text"
                    value="Automatic"
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
              );
            }

            // Regular property
            return (
              <div key={prop.propId} className="mb-4">
                <label className="block mb-1 font-medium">
                  {prop.title}
                  {prop.isRequired && <span className="text-red-600">*</span>}
                </label>
                <input
                  type={getInputType(prop.propertytype)}
                  value={formData[prop.propId] || ""}
                  onChange={(e) =>
                    handleInputChange(prop.propId, e.target.value)
                  }
                  required={prop.isRequired}
                  className="w-full p-2 border rounded"
                />
              </div>
            );
          })}

          {/* File upload for documents */}
          {isDocumentObject(selectedObjectType) && (
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                Document File
                <span className="text-red-600">*</span>
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e.target.files[0])}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}

          {/* Status Messages */}
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

          {/* Submit Button */}
          <div className="mb-5">
            <Button
              type="submit"
              disabled={isSubmitting || !selectedObjectType || !selectedClassId}
              className="w-full"
            >
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
    case "MFDatatypeReal":
      return "number";
    case "MFDatatypeDate":
      return "date";
    case "MFDatatypeTime":
      return "time";
    case "MFDatatypeTimestamp":
      return "datetime-local";
    case "MFDatatypeMultiLineText":
      return "textarea";
    default:
      return "text";
  }
}

export default Create;
