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
    `${BASE_URL}/api/MfilesObjects/GetObjectClasses/${objectId}` // Fixed: added $ and used objectId parameter
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
