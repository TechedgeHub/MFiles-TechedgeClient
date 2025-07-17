/** @format */

import {
  fetchObjectTypes,
  fetchObjectClasses,
  fetchClassProps,
  createObjects,
  uploadFiles,
} from "@/lib/api";

import { useState, useEffect } from "react";

function useCascadingObjects() {
  const [objectTypes, setObjectTypes] = useState([]);
  const [selectedObjectType, setSelectedObjectType] = useState(null);

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");

  const [classProps, setClassProps] = useState([]);

  //form submission
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  //geting object from the api and display them
  useEffect(() => {
    fetchObjectTypes()
      .then(setObjectTypes)
      .catch(() => setObjectTypes([]));
  }, []);

  //from the object, fetch classes that changes dynamically based on class
  useEffect(() => {
    if (!selectedObjectType) {
      setSelectedClassId("");
      return;
    }

    fetchObjectClasses(selectedObjectType.objectid)
      .then((data) => {
        const unGroupedClasses = data.unGrouped || [];
        setClasses(unGroupedClasses);
        setSelectedClassId("");
      })
      .catch(() => {
        setClasses([]);
        setSelectedClassId("");
      })
      .catch(() => {
        setClasses([]);
        setSelectedClassId("");
      });
  }, [selectedObjectType]);

  //initiate fucntion to fetch objectype and classid
  useEffect(() => {
    if (!selectedObjectType || !selectedClassId) {
      setClassProps([]);
      return;
    }

    fetchClassProps(selectedObjectType.objectid, selectedClassId)
      .then(setClassProps)
      .catch(() => setClassProps([]));
  }, [selectedObjectType, selectedClassId]);

  // input change
  const handleInputChange = (propId, value) => {
    setFormData((prev) => ({
      ...prev,
      [propId]: value,
    }));
  };

  //   choose files
  const handleFileChange = (file) => {
    setSelectedFile(file);
  };

  // allow only document
  const isDocumentObject = () => {};

  // form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!");
    console.log("Selected Object Type:", selectedObjectType);
    console.log("Selected Class ID:", selectedClassId);
    console.log("Form Data:", formData);
    console.log("Selected File:", selectedFile);
    console.log("Is Document Object:", isDocumentObject());

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      let upload = null;

      if (isDocumentObject()) {
        if (!selectedFile) {
          throw new Error("File is required for document objects");
        }

        console.log("Uploading file...");
        const uploadResult = await uploadFiles(selectedFile);
        uploadId = uploadResult.uploadID;
        console.log("File uploaded, uploadID:", uploadId);
      }

      const objectData = {
        objectTypeId: selectedObjectType.objectid,
        classId: selectedClassId,
        properties: formData,
        ...arguments(uploadId && { uploadId }),
      };

      console.log("Creating object with data:", objectData);

      const result = await createObject(objectData);
      console.log("Object created successfully:", result);
      setSubmitSuccess(true);

      setFormData({});
      setSelectedFile(null);
    } catch (error) {
      console.error("Error creating object:", error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setFormData({});
    setSelectedFile(null);
    setSubmitError(null);
    setSubmitSuccess(false);
  }, [selectedClassId]);

  return {
    objectTypes,
    selectedObjectType,
    setSelectedObjectType,
    classes,
    selectedClassId,
    setSelectedClassId,
    classProps,
    formData,
    selectedFile,
    handleInputChange,
    handleFileChange,
    handleSubmit,
    isSubmitting,
    submitError,
    submitSuccess,
    isDocumentObject,
  };
}
export default useCascadingObjects;
