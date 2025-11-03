import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { getStaff, addStaff, toggleStaff,updateStaff } from "../../api/staffApi";

export default function Employees() {
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState({
    Name: "",
    Sur_Name: "",
    Role: "Staff",
    Phone_Number: "",
    Username: "",
    Password: "",
  });

  // ดึงพนักงานจาก backend
  const fetchStaff = async () => {
    try {
      const data = await getStaff();
      setStaffList(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load staff");
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
const validateStaffForm = (data) => {
  const nameRegex = /^[ก-ฮa-zA-Z\s]+$/;
  const phoneRegex = /^\d{10}$/;

  if (!nameRegex.test(data.Name)) {
    alert("First name must contain only letters (Thai/English)");
    return false;
  }
  if (!nameRegex.test(data.Sur_Name)) {
    alert("Last name must contain only letters (Thai/English)");
    return false;
  }
  if (!phoneRegex.test(data.Phone_Number)) {
    alert("Phone number must be 10 digits");
    return false;
  }
  return true;
};
// สำหรับ Add Staff
const handleAddStaff = async (e) => {
  e.preventDefault();

  // Validation
  if (!form.Name || !form.Sur_Name || !form.Role || !form.Phone_Number || !form.Username || !form.Password) {
    alert("All fields are required!");
    return;
  }

  if (!/^[A-Za-zก-๙\s]+$/.test(form.Name)) {
    alert("Name must contain only letters!");
    return;
  }

  if (!/^[A-Za-zก-๙\s]+$/.test(form.Sur_Name)) {
    alert("Surname must contain only letters!");
    return;
  }

  if (!/^\d{10}$/.test(form.Phone_Number)) {
    alert("Phone number must be 10 digits!");
    return;
  }

  if (!/^\d+$/.test(form.Password)) {
    alert("Password must contain only numbers!");
    return;
  }

  try {
    await addStaff(form);
    alert("New staff added!");
    setForm({ Name: "", Sur_Name: "", Role: "Staff", Phone_Number: "", Username: "", Password: "" });
    fetchStaff();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};



  // สลับสถานะ Active/Disable
  const toggleStaffStatus = async (staff) => {
    try {
      await toggleStaff(staff.StaffID, !staff.Staff_is_available);
      // อัปเดต state local เลย ไม่ต้อง fetch ใหม่
      setStaffList(staffList.map(s =>
        s.StaffID === staff.StaffID ? { ...s, Staff_is_available: !s.Staff_is_available } : s
      ));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
const [editingStaff, setEditingStaff] = useState(null);
const [editForm, setEditForm] = useState({});

// เปิด modal/form แก้ไข
const startEditStaff = (staff) => {
  setEditingStaff(staff);
  setEditForm({
    Name: staff.Name,
    Sur_Name: staff.Sur_Name,
    Role: staff.Role,
    Phone_Number: staff.Phone_Number,
    Username: staff.Username,
    Password: "", // ใส่ password ใหม่ถ้าต้องการเปลี่ยน
  });
};

// เปลี่ยนค่า edit form
const handleEditChange = (e) => {
  const { name, value } = e.target;

  // ถ้าแก้ชื่อหรือสกุล
  if (name === "Name" || name === "Sur_Name") {
    // ลบตัวที่ไม่ใช่ตัวอักษรไทย/อังกฤษ/space
    const filtered = value.replace(/[^ก-ฮa-zA-Z\s]/g, "");
    setEditForm({ ...editForm, [name]: filtered });
    return;
  }

  // ถ้าแก้เบอร์
  if (name === "Phone_Number") {
    // ลบตัวที่ไม่ใช่ตัวเลขและจำกัด 10 หลัก
    const filtered = value.replace(/\D/g, "").slice(0, 10);
    setEditForm({ ...editForm, [name]: filtered });
    return;
  }

  setEditForm({ ...editForm, [name]: value });
};


// submit edit
const submitEditStaff = async (e) => {
  e.preventDefault();

  // Validation
  if (!editForm.Name || !editForm.Sur_Name || !editForm.Role || !editForm.Phone_Number || !editForm.Username) {
    alert("All fields are required!");
    return;
  }

  if (!/^[A-Za-zก-๙\s]+$/.test(editForm.Name)) {
    alert("Name must contain only letters!");
    return;
  }

  if (!/^[A-Za-zก-๙\s]+$/.test(editForm.Sur_Name)) {
    alert("Surname must contain only letters!");
    return;
  }

  if (!/^\d{10}$/.test(editForm.Phone_Number)) {
    alert("Phone number must be 10 digits!");
    return;
  }

  if (editForm.Password && !/^\d+$/.test(editForm.Password)) {
    alert("Password must contain only numbers!");
    return;
  }

  try {
    await updateStaff(editingStaff.StaffID, editForm);
    alert("Staff updated!");
    setEditingStaff(null);
    fetchStaff();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center">Employee Manager</h2>

      {/* Add New Employee Form */}
      <Card>
        <CardContent className="space-y-3">
          <h3 className="text-xl font-semibold">Add New Employee</h3>
          <form onSubmit={handleAddStaff} className="space-y-2">
            <input
              name="Name"
              placeholder="First Name"
              value={form.Name}
              onChange={handleChange}
              className="border p-1 rounded w-full"
            />
            <input
              name="Sur_Name"
              placeholder="Last Name"
              value={form.Sur_Name}
              onChange={handleChange}
              className="border p-1 rounded w-full"
            />
            <select
              name="Role"
              value={form.Role}
              onChange={handleChange}
              className="border p-1 rounded w-full"
            >
              <option value="Staff">Staff</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
            <input
              name="Phone_Number"
              placeholder="Phone"
              value={form.Phone_Number}
              onChange={handleChange}
              className="border p-1 rounded w-full"
            />
            <input
              name="Username"
              placeholder="Username"
              value={form.Username}
              onChange={handleChange}
              className="border p-1 rounded w-full"
            />
            <input
              name="Password"
              type="password"
              placeholder="Password"
              value={form.Password}
              onChange={handleChange}
              className="border p-1 rounded w-full"
            />
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-1 rounded mt-2"
              >
                Add Staff
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Employees List */}
      <Card>
        <CardContent className="space-y-3">
          <h3 className="text-xl font-semibold">Employees</h3>
          <ul className="space-y-1">
            {staffList.map((s) => (
              <li
                key={s.StaffID}
                className="flex justify-between items-center border-b py-1"
              >
                <span>
                  {s.Name} {s.Sur_Name} ({s.Role}) - {s.Phone_Number}
                </span>
                <div className="flex gap-2">
                  <button
                    className={`px-2 py-0.5 rounded font-semibold text-white ${
                      s.Staff_is_available ? "bg-green-500" : "bg-red-500"
                    }`}
                    onClick={() => toggleStaffStatus(s)}
                  >
                    {s.Staff_is_available ? "Active" : "Disabled"}
                  </button>
                  <button
                    className="px-2 py-0.5 rounded bg-yellow-500 text-white"
                    onClick={() => startEditStaff(s)}
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>  
      </Card>

      {/* Edit Employee Form */}
      {editingStaff && (
        <Card>
          <CardContent className="space-y-3">
            <h3 className="text-xl font-semibold">Edit Employee</h3>
            <form onSubmit={submitEditStaff} className="space-y-2">
              <input
                name="Name"
                placeholder="First Name"
                value={editForm.Name}
                onChange={handleEditChange}
                className="border p-1 rounded w-full"
              />
              <input
                name="Sur_Name"
                placeholder="Last Name"
                value={editForm.Sur_Name}
                onChange={handleEditChange}
                className="border p-1 rounded w-full"
              />
              <select
                name="Role"
                value={editForm.Role}
                onChange={handleEditChange}
                className="border p-1 rounded w-full"
              >
                <option value="Staff">Staff</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
              <input
                name="Phone_Number"
                placeholder="Phone"
                value={editForm.Phone_Number}
                onChange={handleEditChange}
                className="border p-1 rounded w-full"
              />
              <input
                name="Username"
                placeholder="Username"
                value={editForm.Username}
                onChange={handleEditChange}
                className="border p-1 rounded w-full"
              />
              <input
                name="Password"
                type="password"
                placeholder="New Password (leave empty to keep current)"
                value={editForm.Password}
                onChange={handleEditChange}
                className="border p-1 rounded w-full"
              />
              <div className="flex justify-center gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="bg-gray-500 text-white px-4 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
