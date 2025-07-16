/** @format */

import { fetchClassProps } from "@/lib/api";
import { useState, useEffect } from "react";

const useClassProps = (objectTypeId, classId) => {
  const [classProps, setClassProps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!objectTypeId || !classId) {
      setClassProps([]);
      return;
    }

    setLoading(true);
    fetchClassProps(objectTypeId, classId)
      .then((data) => {
        setClassProps(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setClassProps([]);
      })
      .finally(() => setLoading(false));
  }, [objectTypeId, classId]);

  return { classProps, loading, error };
};

export default useClassProps;
