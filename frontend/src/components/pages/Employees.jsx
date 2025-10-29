import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { getStaff, addStaff, toggleStaff } from "../../api/staffApi";

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

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!form.Name || !form.Sur_Name || !form.Role || !form.Phone_Number || !form.Username || !form.Password) {
      alert("All fields are required!");
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

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center">Employee Manager</h2>

      {/* Add New Employee Form */}
      <Card>
        <CardContent className="space-y-3">
          <h3 className="text-xl font-semibold">Add New Employee</h3>
          <form onSubmit={handleAddStaff} className="space-y-2">
            <input name="Name" placeholder="First Name" value={form.Name} onChange={handleChange} className="border p-1 rounded w-full" />
            <input name="Sur_Name" placeholder="Last Name" value={form.Sur_Name} onChange={handleChange} className="border p-1 rounded w-full" />
            <select name="Role" value={form.Role} onChange={handleChange} className="border p-1 rounded w-full">
              <option value="Staff">Staff</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
            <input name="Phone_Number" placeholder="Phone" value={form.Phone_Number} onChange={handleChange} className="border p-1 rounded w-full" />
            <input name="Username" placeholder="Username" value={form.Username} onChange={handleChange} className="border p-1 rounded w-full" />
            <input name="Password" type="password" placeholder="Password" value={form.Password} onChange={handleChange} className="border p-1 rounded w-full" />
            <div className="flex justify-center">
              <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded mt-2">Add Staff</button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Employees List */}
      <Card>
        <CardContent className="space-y-3">
          <h3 className="text-xl font-semibold">Employees</h3>
          <ul className="space-y-1">
            {staffList.map(s => (
              <li key={s.StaffID} className="flex justify-between items-center border-b py-1">
                <span>{s.Name} {s.Sur_Name} ({s.Role}) - {s.Phone_Number}</span>
                <button
                  className={`px-2 py-0.5 rounded font-semibold text-white ${
                    s.Staff_is_available ? "bg-green-500" : "bg-red-500"
                  }`}
                  onClick={() => toggleStaffStatus(s)}
                >
                  {s.Staff_is_available ? "Active" : "Disabled"}
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
