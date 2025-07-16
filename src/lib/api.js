/** @format */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchObjectTypes() {
  const res = await fetch(
    `${BASE_URL}/api/MfilesObjects/GetVaultsObjectsTypes`
  );
  if (!res.ok) throw new Error("Failed to fetch object types");
  return await res.json();
}
