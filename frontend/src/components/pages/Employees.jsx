import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";

export default function Employees() {
  // -----------------------------
  // Mock staff list
  // -----------------------------
  const [staffList, setStaffList] = useState([
    { StaffID: 1, Name: "Somsri", Sur_Name: "Wongchai", Role: "Staff", Phone_Number: "0899999999", Staff_is_available: true },
    { StaffID: 2, Name: "Somchai", Sur_Name: "Prasert", Role: "Staff", Phone_Number: "0888888888", Staff_is_available: true },
  ]);

  // -----------------------------
  // Form state for new employee
  // -----------------------------
  const [form, setForm] = useState({
    Name: "",
    Sur_Name: "",
    Role: "Staff",
    Phone_Number: "",
    Username: "",
    Password: "",
  });

  // -----------------------------
  // Handle input change
  // -----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // -----------------------------
  // Add new staff
  // -----------------------------
  const handleAddStaff = (e) => {
    e.preventDefault();

    if (!form.Name || !form.Sur_Name || !form.Role || !form.Phone_Number || !form.Username || !form.Password) {
      alert("All fields are required!");
      return;
    }

    if (staffList.some(s => s.Username === form.Username)) {
      alert("Username already exists!");
      return;
    }

    const nextID = Math.max(...staffList.map(s => s.StaffID), 0) + 1;

    setStaffList([...staffList, { ...form, StaffID: nextID, Staff_is_available: true }]);
    alert("New staff added!");
    setForm({ Name: "", Sur_Name: "", Role: "Staff", Phone_Number: "", Username: "", Password: "" });
  };

  // -----------------------------
  // Disable staff
  // -----------------------------
  const disableStaff = (id) => {
    setStaffList(staffList.map(s => s.StaffID === id ? { ...s, Staff_is_available: false } : s));
    alert("Staff disabled!");
  };

  // -----------------------------
  // Render component
  // -----------------------------
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
            <select name="Role" value={form.Role} onChange={handleChange} className="border p-1 rounded w-full">
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
              <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded mt-2">Add Staff</button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Active Employees List */}
      <Card>
        <CardContent className="space-y-3">
          <h3 className="text-xl font-semibold">Active Employees</h3>
          <ul className="space-y-1">
            {staffList.filter(s => s.Staff_is_available).map(s => (
              <li key={s.StaffID} className="flex justify-between items-center border-b py-1">
                <span>{s.Name} {s.Sur_Name} ({s.Role}) - {s.Phone_Number}</span>
                <button
                  className="bg-red-500 text-white px-2 py-0.5 rounded"
                  onClick={() => disableStaff(s.StaffID)}
                >
                  Disable
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
