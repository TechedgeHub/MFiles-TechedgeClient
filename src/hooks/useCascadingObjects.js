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
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [typesLoading, setTypesLoading] = useState(false);
  const [documentMetadata, setDocumentMetadata] = useState([]);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [submissionState, setSubmissionState] = useState({
    loading: false,
    error: null,
    success: false,
  });

  // Memoized derived state
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

  const {
    classProps,
    loading: propsLoading,
    error: propsError,
  } = useClassProps(selectedObjectType?.objectid, selectedClassId);

  // Combined properties for the form
  const allProperties = useMemo(() => {
    const combined = [
      ...(classProps || []),
      ...(isDocumentObject(selectedObjectType) ? documentMetadata || [] : []),
    ];

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

  useEffect(() => {
    const fetchMetadata = async () => {
      if (selectedClassId && selectedObjectType) {
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
  }, [selectedClassId, selectedObjectType?.objectid]);

  useEffect(() => {
    const loadClasses = async () => {
      if (!selectedObjectType) {
        setClasses([]);
        setSelectedClassId("");
        return;
      }

      try {
        const data = await fetchObjectClasses(selectedObjectType.objectid);
        const allClasses = [
          ...(data.unGrouped || []),
          ...(data.grouped?.flatMap((group) => group.members) || []),
        ];

        setClasses(allClasses);

        if (isDocumentObject(selectedObjectType)) {
          const documentClass = allClasses.find((c) =>
            c.className.toLowerCase().includes("document")
          );
          if (documentClass) {
            setSelectedClassId(documentClass.classId.toString());
            setSelectedClass(documentClass);
          } else {
            setSelectedClassId("");
          }
          resetForm();
        }
      } catch (error) {
        console.error("Error loading classes:", error);
        setClasses([]);
        setSelectedClassId("");
        resetForm();
      }
    };
    loadClasses();
  }, [selectedObjectType, isDocumentObject]);

  const resetForm = useCallback(() => {
    setFormData({});
    setSelectedFile(null);
    setSubmissionState((prev) => ({ ...prev, error: null, success: false }));
  }, []);

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

        // Prepare all non-automatic properties with values
        const properties = allProperties
          .filter(
            (prop) =>
              !prop.isAutomatic &&
              formData[prop.propId] !== undefined &&
              formData[prop.propId] !== ""
          )
          .map((prop) => ({
            value: String(formData[prop.propId]),
            propId: Number(prop.propId),
            propertytype: getMFilesPropertyType(prop.propertyType),
          }));

        // Determine the title - this will be our single source of truth
        let finalTitle = "";

        // 1. Check for explicit title property in form data
        const titleProperty = allProperties.find(
          (prop) =>
            prop.propId === 0 ||
            prop.title?.toLowerCase() === "title" ||
            prop.name?.toLowerCase() === "title"
        );

        if (titleProperty && formData[titleProperty.propId]) {
          finalTitle = String(formData[titleProperty.propId]);
        }
        // 2. For documents, use filename as title
        else if (isDocument) {
          finalTitle = selectedFile?.name || "Untitled Document";
        }
        // 3. For non-documents, look for name fields
        else {
          const nameProp = allProperties.find(
            (p) =>
              p.title?.toLowerCase().includes("name") ||
              p.name?.toLowerCase().includes("name")
          );
          finalTitle =
            nameProp && formData[nameProp.propId]
              ? String(formData[nameProp.propId])
              : selectedObjectType?.namesingular || "New Object";
        }

        // Remove any existing title properties to prevent duplicates
        const filteredProperties = properties.filter(
          (prop) => prop.propId !== 0
        );

        // Add our single title property
        filteredProperties.unshift({
          value: finalTitle,
          propId: 0, // M-Files standard title property ID
          propertytype: "MFDatatypeText",
        });

        console.log("Final payload:", {
          objectID: selectedObjectType.objectid,
          classID: parseInt(selectedClassId),
          properties: filteredProperties,
          ...(uploadId && { uploadId }),
        });

        // Submit data
        await createObjects({
          objectID: selectedObjectType.objectid,
          classID: parseInt(selectedClassId),
          properties: filteredProperties,
          ...(uploadId && { uploadId }),
        });

        setSubmissionState({ loading: false, error: null, success: true });
        resetForm();
      } catch (error) {
        console.error("Submission error:", error);
        setSubmissionState({
          loading: false,
          error: error.message.includes("name")
            ? "Please provide all required information"
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
    allProperties,
  };
}

export default useCascadingObjects;

// /** @format */
// import {
//   fetchObjectTypes,
//   fetchObjectClasses,
//   createObjects,
//   uploadFiles,
//   fetchClassMetadata,
// } from "@/lib/api";
// import useClassProps from "./useClassProps";
// import { useState, useEffect, useCallback } from "react";

// function useCascadingObjects() {
//   // State management
//   const [objectTypes, setObjectTypes] = useState([]);
//   const [selectedObjectType, setSelectedObjectType] = useState(null);
//   const [classes, setClasses] = useState([]);
//   const [selectedClassId, setSelectedClassId] = useState("");
//   const [selectedClass, setSelectedClass] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [typesLoading, setTypesLoading] = useState(false);
//   const [documentMetadata, setDocumentMetadata] = useState([]);

//   const isDocumentObject = useCallback((objectType) => {
//     if (!objectType) return false;
//     return objectType.namesingular.toLowerCase().includes("document");
//   }, []);
//   const getMFilesPropertyType = useCallback((propertyType) => {
//     if (!propertyType) return "MFDatatypeText";
//     if (
//       typeof propertyType === "string" &&
//       propertyType.startsWith("MFDatatype")
//     ) {
//       return propertyType;
//     }

//     const typeMap = {
//       1: "MFDatatypeText",
//       2: "MFDatatypeInteger",
//       3: "MFDatatypeReal",
//       4: "MFDatatypeDate",
//       5: "MFDatatypeBoolean",
//       6: "MFDatatypeLookup",
//       7: "MFDatatypeMultiSelectLookup",
//       8: "MFDatatypeTime",
//       9: "MFDatatypeTimestamp",
//       10: "MFDatatypeMultiLineText",
//       text: "MFDatatypeText",
//       integer: "MFDatatypeInteger",
//       boolean: "MFDatatypeBoolean",
//       date: "MFDatatypeDate",
//       lookup: "MFDatatypeLookup",
//       multiline: "MFDatatypeMultiLineText",
//     };

//     return typeMap[propertyType] || "MFDatatypeText";
//   }, []);

//   const resetForm = useCallback(() => {
//     setFormData({});
//     setSelectedFile(null);
//     setSubmissionState((prev) => ({ ...prev, error: null, success: false }));
//   }, []);

//   // Data fetching effects
//   useEffect(() => {
//     const loadObjectTypes = async () => {
//       try {
//         const types = await fetchObjectTypes();
//         setObjectTypes(types);
//       } catch {
//         setObjectTypes([]);
//       }
//     };
//     loadObjectTypes();
//   }, []);
//   const [submissionState, setSubmissionState] = useState({
//     loading: false,
//     error: null,
//     success: false,
//   });

//   const {
//     classProps,
//     loading: propsLoading,
//     error: propsError,
//   } = useClassProps(selectedObjectType?.objectid, selectedClassId);

//   useEffect(() => {
//     const fetchMetadata = async () => {
//       if (selectedClassId && selectedObjectType) {
//         try {
//           const metadata = await fetchClassMetadata(
//             selectedObjectType.objectid,
//             selectedClassId
//           );
//           setDocumentMetadata(metadata);
//         } catch (error) {
//           console.error("Failed to fetch metadata:", error);
//           setDocumentMetadata([]);
//         }
//       }
//     };
//     fetchMetadata();
//   }, [selectedClassId, selectedObjectType?.objectid]);

//   // Helper functions

//   useEffect(() => {
//     const loadClasses = async () => {
//       if (!selectedObjectType) {
//         setClasses([]);
//         setSelectedClassId("");
//         return;
//       }

//       try {
//         const data = await fetchObjectClasses(selectedObjectType.objectid);

//         //show both grouped and ungrouped claases
//         const allClasses = [
//           ...(data.unGrouped || []),
//           ...(data.grouped?.flatMap((group) => group.members) || []),
//         ];

//         setClasses(allClasses);

//         if (isDocumentObject(selectedObjectType)) {
//           const documentClass = allClasses.find((c) =>
//             c.className.toLowerCase().includes("document")
//           );
//           if (documentClass) {
//             setSelectedClassId(documentClass.classId.toString());
//             setSelectedClass(documentClass);
//           } else {
//             setSelectedClassId("");
//           }
//           resetForm();
//         }
//       } catch {

//         setClasses([]);
//         setSelectedClassId("");
//         resetForm();
//       }
//     };
//     loadClasses();
//   }, [selectedObjectType, resetForm]);

//   // Event handlers
//   const handleInputChange = useCallback((propId, value) => {
//     setFormData((prev) => ({ ...prev, [propId]: value }));
//   }, []);

//   const handleFileChange = useCallback((file) => {
//     setSelectedFile(file);
//   }, []);

//   const handleSubmit = useCallback(
//     async (e) => {
//       e.preventDefault();
//       setSubmissionState({ loading: true, error: null, success: false });

//       try {
//         // Validate inputs
//         if (!selectedObjectType || !selectedClassId) {
//           throw new Error("Please select both object type and class");
//         }

//         const isDocument = isDocumentObject(selectedObjectType);
//         let uploadId = null;

//         // Handle file upload for documents
//         if (isDocument) {
//           if (!selectedFile) {
//             throw new Error("File is required for document objects");
//           }
//           const uploadResult = await uploadFiles(selectedFile);
//           uploadId = uploadResult.uploadID;
//         }

//         // Get default title based on object type
//         const getDefaultTitle = () => {
//           if (isDocument) {
//             return selectedFile?.name || "No Document--error";
//           }
//           return (
//             formData.title || selectedObjectType?.namesingular || "New Object"
//           );
//         };

//         // Ensure we have a title property
//         const titleProperty = {
//           value: getDefaultTitle(),
//           propId: 0,
//           propertytype: "MFDatatypeText",
//         };

//         // Prepare other properties
//         const otherProperties = Object.entries(formData)
//           .filter(([propId]) => propId !== "0" && propId !== "title")
//           .filter(
//             ([_, value]) =>
//               value !== undefined && value !== null && value !== ""
//           )
//           .map(([propId, value]) => {
//             const propMeta = classProps.find((p) =>
//               [
//                 p.propertyDefId,
//                 p.id,
//                 p.propertyDefinitionId,
//                 p.propertyId,
//                 p.ID,
//                 p.propId,
//               ].some((id) => id === Number(propId))
//             );

//             return {
//               value: String(value),
//               propId: Number(propId),
//               propertytype: getMFilesPropertyType(propMeta?.propertytype),
//             };
//           });

//         // Only log file details if it's a document with a file
//         if (isDocument && selectedFile) {
//           console.log("File details:", {
//             name: selectedFile.name,
//             type: selectedFile.type,
//             size: selectedFile.size,
//           });
//         }

//         // Combine all properties (title first)
//         const properties = [titleProperty, ...otherProperties];

//         console.log("Final payload:", {
//           objectID: selectedObjectType.objectid,
//           classID: parseInt(selectedClassId),
//           properties,
//           ...(uploadId && { uploadId }),
//         });

//         // Submit data
//         await createObjects({
//           objectID: selectedObjectType.objectid,
//           classID: parseInt(selectedClassId),
//           properties,
//           ...(uploadId && { uploadId }),
//         });

//         setSubmissionState({ loading: false, error: null, success: true });
//         resetForm();
//       } catch (error) {
//         console.error("Submission error:", error);
//         setSubmissionState({
//           loading: false,
//           error: error.message.includes("name")
//             ? "Please provide all required information"
//             : error.message,
//           success: false,
//         });
//       }
//     },
//     [
//       selectedObjectType,
//       selectedClassId,
//       formData,
//       classProps,
//       selectedFile,
//       getMFilesPropertyType,
//       isDocumentObject,
//       resetForm,
//     ]
//   );

//   return {
//     objectTypes,
//     selectedObjectType,
//     setSelectedObjectType,
//     classes,
//     selectedClassId,
//     setSelectedClassId,
//     classProps,
//     propsLoading,
//     propsError,
//     formData,
//     selectedFile,
//     handleInputChange,
//     handleFileChange,
//     handleSubmit,
//     isSubmitting: submissionState.loading,
//     submitError: submissionState.error,
//     submitSuccess: submissionState.success,
//     isDocumentObject,
//     typesLoading,
//     documentMetadata,
//     metadataLoading: typesLoading,
//   };
// }

// export default useCascadingObjects;
