/** @format */

import {
  fetchObjectTypes,
  fetchObjectClasses,
  createObjects,
  uploadFiles,
  fetchLookupOptions,
  fetchClassMetadata,
} from "@/lib/api";
import useClassProps from "./useClassProps";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";

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
  const [lookupOptions, setLookupOptions] = useState({});
  const [submissionState, setSubmissionState] = useState({
    loading: false,
    error: null,
    success: false,
  });

  // Use refs to prevent infinite re-renders
  const isDocumentObjectRef = useRef();
  const getMFilesPropertyTypeRef = useRef();

  // Helper functions ,utilize callback functions
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

  // Store refs
  isDocumentObjectRef.current = isDocumentObject;
  getMFilesPropertyTypeRef.current = getMFilesPropertyType;

  // Fetch class properties
  const {
    classProps,
    loading: propsLoading,
    error: propsError,
  } = useClassProps(selectedObjectType?.objectid, selectedClassId);

  // Combined properties for the form , both document and non-document
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

  // Fetch lookup options when object type changes
  useEffect(() => {
    if (!selectedObjectType) return;

    // Fetch Driver options for Cars (objectid 130)
    if (selectedObjectType.objectid === 130) {
      fetchLookupOptions(1104).then((data) =>
        setLookupOptions((prev) => ({ ...prev, 1104: data }))
      );
    }
  }, [selectedObjectType]);

  // Fetch lookup options when properties change
  useEffect(() => {
    const fetchAllLookups = async () => {
      const lookups = allProperties.filter(
        (p) =>
          p.propertytype === "MFDatatypeLookup" ||
          p.propertytype === "MFDatatypeMultiSelectLookup"
      );

      const options = {};
      for (const prop of lookups) {
        try {
          const data = await fetchLookupOptions(prop.propId);
          options[prop.propId] = data;
        } catch (error) {
          console.error(`Failed to fetch options for ${prop.title}:`, error);
          options[prop.propId] = [];
        }
      }
      setLookupOptions(options);
    };

    if (allProperties.length > 0) fetchAllLookups();
  }, [allProperties]);

  // Reset form when class changes - stabilized with useCallback
  const resetForm = useCallback(() => {
    const currentProps = isDocumentObjectRef.current(selectedObjectType)
      ? allProperties
      : classProps || [];

    const initialValues = {};
    currentProps.forEach((prop) => {
      initialValues[prop.propId] =
        prop.propertytype === "MFDatatypeBoolean"
          ? false
          : prop.propertytype === "MFDatatypeMultiSelectLookup"
          ? []
          : prop.propertytype === "MFDatatypeLookup"
          ? null
          : "";
    });
    setFormData(initialValues);
    setSelectedFile(null);
    setSubmissionState({ loading: false, error: null, success: false });
  }, [selectedObjectType, allProperties, classProps]);

  useEffect(() => {
    resetForm();
  }, [selectedClassId, resetForm]);

  // Event handlers
  const handleInputChange = useCallback(
    (propId, value) => {
      setFormData((prev) => {
        const currentProps = isDocumentObjectRef.current(selectedObjectType)
          ? allProperties
          : classProps || [];
        const prop = currentProps.find((p) => p.propId === propId);
        let formattedValue = value;

        // Special formatting for lookup types
        if (prop?.propertytype === "MFDatatypeLookup") {
          formattedValue = value?.id ? value : { id: Number(value) };
        } else if (prop?.propertytype === "MFDatatypeMultiSelectLookup") {
          formattedValue = Array.isArray(value)
            ? value.map((item) => ({ id: Number(item?.id || item) }))
            : [];
        }

        return { ...prev, [propId]: formattedValue };
      });
    },
    [allProperties, classProps, selectedObjectType]
  );

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

        const isDocument = isDocumentObjectRef.current(selectedObjectType);
        let uploadId = null;

        if (isDocument) {
          if (!selectedFile) {
            throw new Error("File is required for document objects");
          }
          const uploadResult = await uploadFiles(selectedFile);
          uploadId = uploadResult.uploadID;
        }

        let finalTitle = "";

        if (isDocument) {
          finalTitle = formData[0] || selectedFile?.name || "Untitled Document";
        } else {
          finalTitle =
            formData[0] ||
            (isDocument ? selectedFile?.name : null) ||
            selectedObjectType?.namesingular ||
            "New Object";
        }

        // Prepare properties from form data
        const currentProps = isDocument ? allProperties : classProps || [];

        const properties = allProperties
          .filter((prop) => !prop.isHidden && !prop.isAutomatic)
          .map((prop) => {
            let value = formData[prop.propId];
            if (prop.propertytype === "MFDatatypeDate" && value) {
              value = new Date(value).toISOString().split("T")[0];
            } else if (prop.propertytype === "MFDatatypeTimestamp" && value) {
              value = new Date(value).toISOString();
            } else if (prop.propertytype === "MFDatatypeInteger" && value) {
              value = parseInt(value);
            } else if (prop.propertytype === "MFDatatypeBoolean") {
              value = Boolean(value);
            }

            return {
              propId: prop.propId,
              propertytype: prop.propertytype,
              value: value !== undefined ? value : null,
            };
          });

        const checkRequiredFields = () => {
          const requiredFields = classMetadata.filter(
            (prop) => prop.isRequired && !prop.isAutomatic
          );

          const missingFields = requiredFields.filter((field) => {
            const property = properties.find((p) => p.propId === field.propId);
            return !property || !property.value || property.value === "";
          });

          if (missingFields.length > 0) {
            const fieldNames = missingFields
              .map((field) => field.title)
              .join(", ");
            throw new Error(`Missing required fields: ${fieldNames}`);
          }
        };

        console.log("Properties array structure:", properties);
        console.log(
          "Properties detailed:",
          JSON.stringify(properties, null, 2)
        );

        const payload = {
          objectId: selectedObjectType.objectid,
          classId: parseInt(selectedClassId),
          properties: properties
            .filter(
              (property) =>
                !property.isAutomatic && property.value && property.value !== ""
            )
            .map((property) => ({
              propId: property.propId,
              value: formatPropertyValue(property),
              propertytype: property.propertytype,
            })),
          mfilesCreate: true,
          ...(isDocumentObject(selectedObjectType) && { uploadId }),
        };

        function formatPropertyValue(property) {
          switch (property.propertytype) {
            case "MFDatatypeLookup":
              // Extract id for Single lookup
              return String(property.value.id);
            case "MFDatatypeMultiSelectLookup":
              return property.value.map((item) => item.id).join(",");
            case "MFDatatypeBoolean":
              return String(property.value);
            default:
              return String(property.value);
          }
        }

        console.log("Final payload:", payload);

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
    lookupOptions,
  };
}

export default useCascadingObjects;
