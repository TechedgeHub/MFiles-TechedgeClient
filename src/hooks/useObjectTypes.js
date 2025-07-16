/** @format */

import { fetchObjectTypes } from "@/lib/api";
import { useEffect, useState } from "react";

export default function useObjectTypes() {
  const [objectTypes, setObjectTypes] = useState([]);
  const [selectedObjectType, setSelectedObjectType] = useState("");

  useEffect(() => {
    fetchObjectTypes()
      .then(setObjectTypes)
      .catch((err) => console.log("Failed to fetch object types", err));
  }, []);

  return {
    objectTypes,
    selectedObjectType,
    setSelectedObjectType,
  };
}
