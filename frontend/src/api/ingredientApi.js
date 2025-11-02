// frontend/src/api/ingredientsApi.js
const BASE_URL = "http://localhost:3006/api/ingredients";

// -----------------------------
// ดึง ingredient ทั้งหมด
// -----------------------------
export const getIngredients = async (token) => {
  if (!token) token = localStorage.getItem("token");

  const res = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch ingredients");
  return await res.json(); // [{ id, name, quantity, unit }, ...]
};

// -----------------------------
// เพิ่ม ingredient ใหม่
// -----------------------------
export const addIngredient = async (ingredient) => {
  const token = localStorage.getItem("token");
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(ingredient), // { name, unit, quantity }
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || "Failed to add ingredient");
  }
  return await res.json();
};

// -----------------------------
// แก้ไข stock ของ ingredient (เพิ่ม/ลดจำนวน)
// -----------------------------
export const updateIngredientStock = async (id, delta) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ delta }), // delta เป็นจำนวนเพิ่ม/ลด
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || "Failed to update ingredient stock");
  }
  return await res.json();
};

// -----------------------------
// (Optional) ลบ ingredient
// -----------------------------
export const deleteIngredient = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete ingredient");
  return await res.json();
};
// สำหรับ IngredientsManager
export const getAllIngredients = async (token) => {
  if (!token) token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch ingredients");
  return await res.json();
};