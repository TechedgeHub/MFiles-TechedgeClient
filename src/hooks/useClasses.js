/** @format */

import { fetchClasses } from "@/lib/api";
import { useEffect, useState } from "react";

export default function useClasses(objectId) {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!objectId) {
      setClasses([]);
      return;
    }
    setLoading(true);
    fetchClasses(objectId)
      .then((data) => {
        const combined = [...(data.grouped || []), ...(data.ungrouped || {})];
        setClasses(combined);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setClasses([]);
      })
      .finally(() => setLoading(false));
  }, [objectId]);
  return { classes, loading, error };
}
