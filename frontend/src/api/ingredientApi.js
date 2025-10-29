// frontend/src/api/ingredientsApi.js
const BASE_URL = "http://localhost:3006/api/ingredients";

// ดึง ingredient ทั้งหมด
export const getIngredients = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch ingredients");
  return await res.json();
};
