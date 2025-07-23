/** @format */
import {
  fetchObjectTypes,
  fetchObjectClasses,
  createObjects,
  uploadFiles,
} from "@/lib/api";
import useClassProps from "./useClassProps";
import { useState, useEffect, useCallback } from "react";

function useCascadingObjects() {
  // State management
  const [objectTypes, setObjectTypes] = useState([]);
  const [selectedObjectType, setSelectedObjectType] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [submissionState, setSubmissionState] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const {
    classProps,
    loading: propsLoading,
    error: propsError,
  } = useClassProps(selectedObjectType?.objectid, selectedClassId);

  // Helper functions
  const getMFilesPropertyType = useCallback((propertyType) => {
    if (!propertyType) return "MFDatatypeText";
    if (
      typeof propertyType === "string" &&
      propertyType.startsWith("MFDatatype")
    ) {
      return propertyType;
    }

    const typeMap = {
      1: "MFDatatypeText",
      2: "MFDatatypeInteger",
      3: "MFDatatypeReal",
      4: "MFDatatypeDate",
      5: "MFDatatypeBoolean",
      6: "MFDatatypeLookup",
      7: "MFDatatypeMultiSelectLookup",
      8: "MFDatatypeTime",
      9: "MFDatatypeTimestamp",
      10: "MFDatatypeMultiLineText",
      text: "MFDatatypeText",
      integer: "MFDatatypeInteger",
      boolean: "MFDatatypeBoolean",
      date: "MFDatatypeDate",
      lookup: "MFDatatypeLookup",
      multiline: "MFDatatypeMultiLineText",
    };

    return typeMap[propertyType] || "MFDatatypeText";
  }, []);

  const isDocumentObject = useCallback((objectType) => {
    if (!objectType) return false;
    return objectType.namesingular.toLowerCase().includes("document");
  }, []);

  const resetForm = useCallback(() => {
    setFormData({});
    setSelectedFile(null);
    setSubmissionState((prev) => ({ ...prev, error: null, success: false }));
  }, []);

  // Data fetching effects
  useEffect(() => {
    const loadObjectTypes = async () => {
      try {
        const types = await fetchObjectTypes();
        setObjectTypes(types);
      } catch {
        setObjectTypes([]);
      }
    };
    loadObjectTypes();
  }, []);

  useEffect(() => {
    const loadClasses = async () => {
      if (!selectedObjectType) {
        setClasses([]);
        setSelectedClassId("");
        return;
      }

      try {
        const data = await fetchObjectClasses(selectedObjectType.objectid);
        setClasses(data.unGrouped || []);
        setSelectedClassId("");
        resetForm();
      } catch {
        setClasses([]);
        setSelectedClassId("");
        resetForm();
      }
    };
    loadClasses();
  }, [selectedObjectType, resetForm]);

  // Event handlers
  const handleInputChange = useCallback((propId, value) => {
    setFormData((prev) => ({ ...prev, [propId]: value }));
  }, []);

  const handleFileChange = useCallback((file) => {
    setSelectedFile(file);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmissionState({ loading: true, error: null, success: false });

      try {
        // Validate inputs
        if (!selectedObjectType || !selectedClassId) {
          throw new Error("Please select both object type and class");
        }

        const isDocument = isDocumentObject(selectedObjectType);
        let uploadId = null;

        // Handle file upload for documents
        if (isDocument) {
          if (!selectedFile) {
            throw new Error("File is required for document objects");
          }
          const uploadResult = await uploadFiles(selectedFile);
          uploadId = uploadResult.uploadID;
        }

        const titleProperty = {
          value: formData.title || "Untitled Document", 
          propId: 0,
          propertytype: "MFDatatypeText",
        };

        // Prepare other properties
        const otherProperties = Object.entries(formData)
          .filter(([propId]) => propId !== "0" && propId !== "title") 
          .filter(
            ([_, value]) =>
              value !== undefined && value !== null && value !== ""
          )
          .map(([propId, value]) => {
            const propMeta = classProps.find((p) =>
              [
                p.propertyDefId,
                p.id,
                p.propertyDefinitionId,
                p.propertyId,
                p.ID,
                p.propId,
              ].some((id) => id === Number(propId))
            );

            return {
              value: String(value),
              propId: Number(propId),
              propertytype: getMFilesPropertyType(propMeta?.propertytype),
            };
          });

        // Combine all properties (title first)
        const properties = [titleProperty, ...otherProperties];

        console.log("Final payload:", {
          objectID: selectedObjectType.objectid,
          classID: parseInt(selectedClassId),
          properties,
          ...(uploadId && { uploadId }),
        });

        // Submit data
        await createObjects({
          objectID: selectedObjectType.objectid,
          classID: parseInt(selectedClassId),
          properties,
          ...(uploadId && { uploadId }),
        });

        setSubmissionState({ loading: false, error: null, success: true });
        resetForm();
      } catch (error) {
        console.error("Submission error:", error);
        setSubmissionState({
          loading: false,
          error: error.message,
          success: false,
        });
      }
    },
    [
      selectedObjectType,
      selectedClassId,
      formData,
      classProps,
      selectedFile,
      getMFilesPropertyType,
      isDocumentObject,
      resetForm,
    ]
  );

  return {
    objectTypes,
    selectedObjectType,
    setSelectedObjectType,
    classes,
    selectedClassId,
    setSelectedClassId,
    classProps,
    propsLoading,
    propsError,
    formData,
    selectedFile,
    handleInputChange,
    handleFileChange,
    handleSubmit,
    isSubmitting: submissionState.loading,
    submitError: submissionState.error,
    submitSuccess: submissionState.success,
    isDocumentObject,
  };
}

export default useCascadingObjects;
