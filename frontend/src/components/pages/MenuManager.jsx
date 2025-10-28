import React, { useState } from "react";
import { Card, CardContent } from "../ui/card"; // Make sure path is correct

export default function MenuManager() {
  // -----------------------------
  // Mock menu list
  // -----------------------------
  const [menus, setMenus] = useState([
    { MenuID: 1, MenuName: "Strawberry Cake", MenuPrice: 400, MenuDescription: "Fresh strawberry cream cake", Bake_Time: 50, Is_Custom: false, Is_Available: true, Ingredients: ["Whipping Cream", "Strawberry"] },
    { MenuID: 2, MenuName: "Chocolate Cake", MenuPrice: 350, MenuDescription: "Rich chocolate cake", Bake_Time: 45, Is_Custom: false, Is_Available: true, Ingredients: ["Cocoa", "Butter"] },
  ]);

  // -----------------------------
  // Form state for adding new menu
  // -----------------------------
  const [form, setForm] = useState({
    MenuName: "",
    MenuPrice: "",
    MenuDescription: "",
    Bake_Time: "",
    Is_Custom: false,
    Ingredients: "",
  });

  // -----------------------------
  // Handle input change
  // -----------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // -----------------------------
  // Add new menu
  // -----------------------------
  const handleAddMenu = (e) => {
    e.preventDefault();

    if (!form.MenuName || !form.MenuPrice || !form.MenuDescription || !form.Bake_Time) {
      alert("All fields are required!");
      return;
    }

    if (menus.some(m => m.MenuName === form.MenuName)) {
      alert("Menu name already exists!");
      return;
    }

    const nextID = Math.max(...menus.map(m => m.MenuID), 0) + 1;

    setMenus([
      ...menus,
      { ...form, MenuID: nextID, Is_Available: true, Ingredients: form.Ingredients.split(",").map(i => i.trim()) },
    ]);

    alert("New menu added!");
    setForm({ MenuName: "", MenuPrice: "", MenuDescription: "", Bake_Time: "", Is_Custom: false, Ingredients: "" });
  };

  // -----------------------------
  // Disable a menu
  // -----------------------------
  const disableMenu = (id) => {
    setMenus(menus.map(m => m.MenuID === id ? { ...m, Is_Available: false } : m));
    alert("Menu disabled!");
  };

  // -----------------------------
  // Render component
  // -----------------------------
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-center">Menu Manager</h2>

      {/* Add New Menu Form */}
      <Card>
        <CardContent className="space-y-3">
          <h3 className="text-xl font-semibold">Add New Menu</h3>
          <form onSubmit={handleAddMenu} className="space-y-2">
            <input
              name="MenuName"
              placeholder="Menu Name"
              value={form.MenuName}
              onChange={handleChange}
              className="border p-1 rounded w-full"
            />
            <input
              name="MenuPrice"
              type="number"
              placeholder="Price"
              value={form.MenuPrice}
              onChange={handleChange}
              className="border p-1 rounded w-full"
            />
            <textarea
              name="MenuDescription"
              placeholder="Description"
              value={form.MenuDescription}
              onChange={handleChange}
              className="border p-1 rounded w-full"
            />
            <input
              name="Bake_Time"
              type="number"
              placeholder="Bake Time (min)"
              value={form.Bake_Time}
              onChange={handleChange}
              className="border p-1 rounded w-full"
            />
            <input
              name="Ingredients"
              placeholder="Ingredients (comma separated)"
              value={form.Ingredients}
              onChange={handleChange}
              className="border p-1 rounded w-full"
            />
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="Is_Custom" checked={form.Is_Custom} onChange={handleChange} />
              <span>Custom Menu?</span>
            </label>
            <div className="flex justify-center">
              <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded mt-2">Add Menu</button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Menu List */}
      <Card>
        <CardContent className="space-y-3 overflow-x-auto">
          <h3 className="text-xl font-semibold">Available Menus</h3>
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Bake Time</th>
                <th className="px-4 py-2 text-left">Ingredients</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menus.filter(m => m.Is_Available).map(m => (
                <tr key={m.MenuID} className="border-t">
                  <td className="px-4 py-2">{m.MenuName}</td>
                  <td className="px-4 py-2">{m.MenuPrice}</td>
                  <td className="px-4 py-2">{m.MenuDescription}</td>
                  <td className="px-4 py-2">{m.Bake_Time} min</td>
                  <td className="px-4 py-2">{m.Ingredients.join(", ")}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => disableMenu(m.MenuID)}
                    >
                      Disable
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
