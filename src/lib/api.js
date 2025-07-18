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
  const res = await fetch(`${BASE_URL}/api/objectinstance/ObjectCreation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objectData),
  });

  if (!res.ok) {
    let errorBody =`HTTP ${res.status}: ${res.statusText}`;
    try {
      const errorData = await res.json();
      errorMessage =
        errorData.message || errorData.error || JSON.stringify(errorData);
    } catch {
      try {
        const errorText = await res.text();
        errorMessage = errorText || errorMessage;
      } catch {
        errorBody = await res.text();
      }
    }
    throw new Error(`Failed to create object: ${errorMessage}`);
  }
  return await res.json();
}

//data with file uploads

export async function uploadFiles(file) {
  const formData = new FormData();
  formData.append("formFiles,=", file);

  const res = await fetch(`${BASE_URL}/api/objectinstance/FilesUploadAsync`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Failled to upload Files: ${res.status}`);
  }
  return await res.json();
}
