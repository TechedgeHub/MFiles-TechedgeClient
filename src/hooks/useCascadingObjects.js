/** @format */

import {
  fetchObjectTypes,
  fetchObjectClasses,
  fetchClassProps,
  createObjects,
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
      });
    //   .catch(() => setClasses([]));
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

  // form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const objectData = {
        objectTypeId: selectedObjectType.objectid,
        classId: selectedClassId,
        properties: formData,
      };
      const result = await createObject(objectData);
      console.log("Object created successfully:", result);
      setSubmitSuccess(true);

      setFormData({});
    } catch (error) {
      console.error("Error creating object:", error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setFormData({});
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
    handleInputChange,
    isSubmitting,
    submitError,
    submitSuccess,
  };
}
export default useCascadingObjects;
