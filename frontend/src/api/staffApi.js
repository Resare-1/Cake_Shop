const BASE_URL = "http://localhost:3006/api/staff";

// ดึงพนักงานทั้งหมด
export const getStaff = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch staff");
  return await res.json();
};

// เพิ่มพนักงานใหม่
export const addStaff = async (staff) => {
  const token = localStorage.getItem("token");
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(staff),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || "Failed to add staff");
  }
  return await res.json();
};

// เปิด/ปิดใช้งานพนักงาน
export const toggleStaff = async (id, Staff_is_available) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/${id}/toggle`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ Staff_is_available }),
  });
  if (!res.ok) throw new Error("Failed to toggle staff");
  return await res.json();
};
// แก้ไขข้อมูลพนักงาน
export const updateStaff = async (id, updatedData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || "Failed to update staff");
  }
  return await res.json();
};
