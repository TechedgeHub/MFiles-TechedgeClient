/** @format */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

//fecth object types
export async function fetchObjectTypes() {
  const res = await fetch(
    `${BASE_URL}/api/MfilesObjects/GetVaultsObjectsTypes`
  );
  if (!res.ok) throw new Error("Failed to fetch object types");
  return await res.json();
}

// fetch class based on object type
export async function fetchObjectClasses(objectId) {
  const res = await fetch(
    `${BASE_URL}/api/MfilesObjects/GetObjectClasses/${objectId}`
  );
  if (!res.ok)
    throw new Error("Failed to fetch classes, ensure you pick object ID");
  return await res.json();
}
// show class properties
export async function fetchClassProps(objectTypeId, classId) {
  const res = await fetch(
    `${BASE_URL}/api/MfilesObjects/ClassProps/${objectTypeId}/${classId}`
  );
  if (!res.ok) throw new Error("Failed to fetch class properties");
  return await res.json();
}

// create new object to add to mfiles client
export async function createObjects(objectData) {
  try {
    console.log("Sending payload:", JSON.stringify(objectData, null, 2)); // Better formatting

    const res = await fetch(`${BASE_URL}/api/objectinstance/ObjectCreation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objectData, (key, value) => {
        if (value === "") return null;
        return value;
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Full API Error Response:", errorText); // THIS IS KEY
      console.error("Status:", res.status);
      console.error("Status Text:", res.statusText);

      // Try to parse the error for more details
      try {
        const errorData = JSON.parse(errorText);
        console.error("Parsed Error Data:", errorData);

        // Check for common ASP.NET validation error formats
        if (errorData.errors) {
          console.error("Validation Errors:", errorData.errors);
        }
        if (errorData.detail) {
          console.error("Error Detail:", errorData.detail);
        }
      } catch (parseError) {
        console.error("Could not parse error as JSON:", parseError);
      }

      throw new Error(errorText);
    }

    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

//objects with data file uploads
export async function uploadFiles(file) {
  const formData = new FormData();
  formData.append("formFiles", file);

  const res = await fetch(`${BASE_URL}/api/objectinstance/FilesUploadAsync`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Failled to upload Files: ${res.status}`);
  }
  return await res.json();
}
export const fetchClassMetadata = async (objectId, classId) => {
  const response = await fetch(
    `https://mfilesdemoapi.alignsys.tech/api/MfilesObjects/ClassProps/${objectId}/${classId}`
  );
  // const response = await fetch(
  //   `${BASE_URL}/api/MfilesObjects/ClassProps/${objectId}/${classId}`
  // )
  if (!response.ok) throw new Error("Failed to fetch class metadata");
  return response.json();
};

// Get all valid options for a lookup property
export async function fetchLookupOptions(propertyId) {
  const res = await fetch(`${BASE_URL}/api/ValuelistInstance/${propertyId}`);
  if (!res.ok) throw new Error("Failed to fetch lookup options");
  return await res.json();
}

// Search lookup values (optional)
export async function searchLookupOptions(propertyId, searchPhrase = "") {
  const res = await fetch(
    `${BASE_URL}/api/ValuelistInstance/Search/${encodeURIComponent(
      searchPhrase
    )}/${propertyId}`
  );
  if (!res.ok) throw new Error("Failed to search lookup options");
  return await res.json();
}
