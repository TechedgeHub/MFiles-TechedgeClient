/** @format */

import {
  fetchObjectTypes,
  fetchObjectClasses,
  createObjects,
  uploadFiles,
  fetchClassMetadata,
} from "@/lib/api";
import useClassProps from "./useClassProps";
import { useState, useEffect, useCallback, useMemo } from "react";

function useCascadingObjects() {
  // State management
  const [objectTypes, setObjectTypes] = useState([]);
  const [selectedObjectType, setSelectedObjectType] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [typesLoading, setTypesLoading] = useState(false);
  const [documentMetadata, setDocumentMetadata] = useState([]);
  const [submissionState, setSubmissionState] = useState({
    loading: false,
    error: null,
    success: false,
  });

  // Helper functions
  const isDocumentObject = useCallback((objectType) => {
    if (!objectType) return false;
    return objectType.namesingular.toLowerCase().includes("document");
  }, []);

  const getMFilesPropertyType = useCallback((propertyType) => {
    if (!propertyType) return "MFDatatypeText";
    if (
      typeof propertyType === "string" &&
      propertyType.startsWith("MFDatatype")
    ) {
      return propertyType;
    }
//Datatype used in M-Files
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

  // Fetch class properties
  const {
    classProps,
    loading: propsLoading,
    error: propsError,
  } = useClassProps(selectedObjectType?.objectid, selectedClassId);

  // Combined properties for the form (specifically for document objects)
  const allProperties = useMemo(() => {
    if (!isDocumentObject(selectedObjectType)) {
      return classProps || [];
    }

    const combined = [...(classProps || []), ...(documentMetadata || [])];

    return combined.filter(
      (prop, index, self) =>
        index ===
        self.findIndex(
          (p) =>
            p.propId === prop.propId ||
            p.propertyDefId === prop.propertyDefId ||
            p.id === prop.id
        )
    );
  }, [classProps, documentMetadata, selectedObjectType, isDocumentObject]);

  // Data fetching effects
  useEffect(() => {
    const loadObjectTypes = async () => {
      setTypesLoading(true);
      try {
        const types = await fetchObjectTypes();
        setObjectTypes(types);
      } catch (error) {
        console.error("Error loading object types:", error);
        setObjectTypes([]);
      } finally {
        setTypesLoading(false);
      }
    };
    loadObjectTypes();
  }, []);

  // Fetch metadata for documents
  useEffect(() => {
    const fetchMetadata = async () => {
      if (
        selectedClassId &&
        selectedObjectType &&
        isDocumentObject(selectedObjectType)
      ) {
        try {
          const metadata = await fetchClassMetadata(
            selectedObjectType.objectid,
            selectedClassId
          );
          setDocumentMetadata(metadata);
        } catch (error) {
          console.error("Failed to fetch metadata:", error);
          setDocumentMetadata([]);
        }
      }
    };
    fetchMetadata();
  }, [selectedClassId, selectedObjectType, isDocumentObject]);

  // Fetch classes when object type changes
  useEffect(() => {
    const loadClasses = async () => {
      if (!selectedObjectType) {
        setClasses([]);
        setSelectedClassId("");
        return;
      }

      try {
        const data = await fetchObjectClasses(selectedObjectType.objectid);

        //Get all classes for documents only, for non-documents only ungrouped
        const allClasses = isDocumentObject(selectedObjectType)
          ? [
              ...(data.unGrouped || []),
              ...(data.grouped?.flatMap((group) => group.members) || []),
            ]
          : data.unGrouped || [];

        setClasses(allClasses);

        // Auto-select document class for document objects
        if (isDocumentObject(selectedObjectType)) {
          const documentClass = allClasses.find((c) =>
            c.className.toLowerCase().includes("document")
          );
          if (documentClass) {
            setSelectedClassId(documentClass.classId.toString());
          }
        } else {
          setSelectedClassId("");
        }
      } catch (error) {
        console.error("Error loading classes:", error);
        setClasses([]);
        setSelectedClassId("");
      }
    };
    loadClasses();
  }, [selectedObjectType, isDocumentObject]);

  // Reset form when class changes
  const resetForm = useCallback(() => {
    setFormData({});
    setSelectedFile(null);
    setSubmissionState((prev) => ({ ...prev, error: null, success: false }));
  }, []);

  useEffect(() => {
    resetForm();
  }, [selectedClassId, resetForm]);

  // Event handlers
  const handleInputChange = useCallback((propId, value) => {
    setFormData((prev) => ({ ...prev, [propId]: value }));
  }, []);

  const handleFileChange = useCallback((file) => {
    setSelectedFile(file);
  }, []);

  // Unified form submission handler
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmissionState({ loading: true, error: null, success: false });

      try {
        if (!selectedObjectType || !selectedClassId) {
          throw new Error("Please select both object type and class");
        }

        const isDocument = isDocumentObject(selectedObjectType);
        let uploadId = null;

        //File upload for documents
        if (isDocument) {
          if (!selectedFile) {
            throw new Error("File is required for document objects");
          }
          const uploadResult = await uploadFiles(selectedFile);
          uploadId = uploadResult.uploadID;
        }

        let finalTitle = "";

        if (isDocument) {
          // Name documents based on filename or form title else unititled doc
          finalTitle = formData[0] || selectedFile?.name || "Untitled Document";
        } else {
          // For non-documents,look for title in form data or use default
          finalTitle =
            formData[0] ||
            Object.values(formData)[0] || // specifically use first name if available
            selectedObjectType?.namesingular ||
            "New Object";
        }

        // Prepare properties from form data (excluding title which we'll add separately)
        const formProperties = Object.entries(formData)
          .filter(([propId]) => propId !== "0") 
          .filter(
            ([_, value]) =>
              value !== undefined && value !== null && value !== ""
          )
          .map(([propId, value]) => {
            // Autopopulate MD based on Class and Object.
            const propMeta = (
              isDocument ? allProperties : classProps || []
            ).find((p) => {
              const numPropId = Number(propId);
              return (
                p.propertyDefId === numPropId ||
                p.id === numPropId ||
                p.propertyDefinitionId === numPropId ||
                p.propertyId === numPropId ||
                p.ID === numPropId ||
                p.propId === numPropId
              );
            });

            return {
              value: String(value),
              propId: Number(propId),
              propertytype: getMFilesPropertyType(propMeta?.propertytype),
            };
          });

        // Title property is always the first property
        const properties = [
          {
            value: finalTitle,
            propId: 0, 
            propertytype: "MFDatatypeText",
          },
          ...formProperties,
        ];

        // Indicate the payload --for debug
        const payload = {
          objectID: selectedObjectType.objectid,
          classID: parseInt(selectedClassId),
          properties: properties,
          ...(uploadId && { uploadId }),
        };

        console.log("Final payload:", payload);

        // Send data --error prone
        await createObjects(payload);

        setSubmissionState({ loading: false, error: null, success: true });
      } catch (error) {
        console.error("Submission error:", error);
        setSubmissionState({
          loading: false,
          error:
            error.message.includes("name") || error.message.includes("title")
              ? "Please provide all required information including a title"
              : error.message,
          success: false,
        });
      }
    },
    [
      selectedObjectType,
      selectedClassId,
      formData,
      allProperties,
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
    typesLoading,
    documentMetadata,
    metadataLoading: typesLoading || propsLoading,
    allProperties: isDocumentObject(selectedObjectType)
      ? allProperties
      : classProps || [],
  };
}

export default useCascadingObjects;
