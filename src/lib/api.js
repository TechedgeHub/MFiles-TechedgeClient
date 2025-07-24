/** @format */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchObjectTypes() {
  const res = await fetch(
    `${BASE_URL}/api/MfilesObjects/GetVaultsObjectsTypes`
  );
  if (!res.ok) throw new Error("Failed to fetch object types");
  return await res.json();
}

//class objectId
export async function fetchObjectClasses(objectId) {
  const res = await fetch(
    `${BASE_URL}/api/MfilesObjects/GetObjectClasses/${objectId}`
  );
  if (!res.ok)
    throw new Error("Failed to fetch classes, ensure you pick object ID");
  return await res.json();
}
// class properties
export async function fetchClassProps(objectTypeId, classId) {
  const res = await fetch(
    `${BASE_URL}/api/MfilesObjects/ClassProps/${objectTypeId}/${classId}`
  );
  if (!res.ok) throw new Error("Failed to fetch class properties");
  return await res.json();
}

// create object to add to mfiles client
export async function createObjects(objectData) {
  try {
    const res = await fetch(`${BASE_URL}/api/objectinstance/ObjectCreation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objectData),
    });

    const responseText = await res.text();

    if (!res.ok) {
      let errorMessage = `HTTP ${res.status}: ${res.statusText}`;

      try {
        const errorData = JSON.parse(responseText);
        errorMessage =
          errorData.message || errorData.error || JSON.stringify(errorData);
      } catch (e) {
        errorMessage = responseText || errorMessage;
      }

      console.error("API Error Details:", {
        status: res.status,
        statusText: res.statusText,
        responseBody: responseText,
        sentData: objectData,
      });

      throw new Error(`Failed to create object: ${errorMessage}`);
    }

    try {
      return JSON.parse(responseText);
    } catch (e) {
      return responseText;
    }
  } catch (error) {
    console.error("Network or parsing error:", error);
    throw new Error(`Network error: ${error.message}`);
  }
}

//data with file uploads

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
// Add this function to your API file
export const fetchDocumentMetadata = async (classId) => {
  const response = await fetch(`/api/document-metadata/${classId}`);
  if (!response.ok) throw new Error('Failed to fetch document metadata');
  return response.json();
};