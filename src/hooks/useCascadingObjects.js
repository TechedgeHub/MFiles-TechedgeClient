/** @format */

import {
  fetchObjectTypes,
  fetchObjectClasses,
  fetchClassProps,
} from "@/lib/api";

import { useState, useEffect } from "react";

function useCascadingObjects() {
  const [objectTypes, setObjectTypes] = useState([]);
  const [selectedObjectType, setSelectedObjectType] = useState(null);

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");

  const [classProps, setClassProps] = useState([]);

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
  return {
    objectTypes,
    selectedObjectType,
    setSelectedObjectType,
    classes,
    selectedClassId,
    setSelectedClassId,
    classProps,
  };
}
export default useCascadingObjects;
