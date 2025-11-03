// frontend/src/components/pages/MenuManager.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import {
  getMenus,
  addMenu,
  toggleMenuStatus,
  getMenuById,
  updateMenu,
  updateMenuIngredients,
} from "../../api/menuApi";
import { getAllIngredients } from "../../api/ingredientApi";

export default function MenuManager() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    MenuName: "",
    MenuPrice: "",
    MenuDescription: "",
    Bake_Time: "",
    Is_Custom: false,
  });

  const [allIngredientsOriginal, setAllIngredientsOriginal] = useState([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const [editingMenuId, setEditingMenuId] = useState(null);

  // -----------------------------
  // Load menus & ingredients
  // -----------------------------
  const fetchMenus = async () => {
    try {
      const data = await getMenus();
      setMenus(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load menus");
    } finally {
      setLoading(false);
    }
  };
const handleEditMenu = async (menuID) => {
  try {
    const menu = await getMenuById(menuID);
    setForm({
      MenuName: menu.MenuName,
      MenuPrice: menu.MenuPrice,
      MenuDescription: menu.MenuDescription,
      Bake_Time: menu.Bake_Time,
      Is_Custom: menu.Is_Custom,
    });

    setSelectedIngredients(
      (menu.Ingredients || []).map((i) => ({
        IngredientID: i.IngredientID,
        IngredientName: i.IngredientName,
        qty_required: i.qty_required,
        Unit: i.Unit,
      }))
    );

    setEditingMenuId(menuID);
  } catch (err) {
    console.error(err);
    alert("Failed to load menu for editing");
  }
};

  const fetchIngredients = async () => {
    try {
      const data = await getAllIngredients();
      setAllIngredientsOriginal(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setAllIngredientsOriginal([]);
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchIngredients();
  }, []);

  // -----------------------------
  // Form Handlers
  // -----------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // -----------------------------
  // Ingredient Handlers
  // -----------------------------
  const handleIngredientInput = (e) => {
    const value = e.target.value;
    setIngredientInput(value);
    if (!value) return setFilteredIngredients([]);

    const filtered = allIngredientsOriginal
      .filter(
        (i) =>
          i.IngredientName &&
          i.IngredientName.toLowerCase().includes(value.toLowerCase())
      )
      .filter(
        (v, i, a) =>
          a.findIndex((t) => t.IngredientID === v.IngredientID) === i
      )
      .filter(
        (i) =>
          !selectedIngredients.find((s) => s.IngredientID === i.IngredientID)
      );

    setFilteredIngredients(filtered);
  };

  const handleSelectIngredient = (ingredient) => {
    if (
      !selectedIngredients.find((i) => i.IngredientID === ingredient.IngredientID)
    ) {
      setSelectedIngredients([
        ...selectedIngredients,
        { ...ingredient, qty_required: "", Unit: ingredient.Unit },
      ]);
    }
    setIngredientInput("");
    setFilteredIngredients([]);
  };

  const handleIngredientQtyChange = (id, field, value) => {
    // ✅ จำกัดค่า 1–500
    let qty = parseFloat(value);
    if (isNaN(qty)) qty = "";
    else if (qty < 1) qty = 1;
    else if (qty > 500) qty = 500;

    setSelectedIngredients(
      selectedIngredients.map((i) =>
        i.IngredientID === id ? { ...i, [field]: qty } : i
      )
    );
  };

  const handleRemoveIngredient = (id) => {
    setSelectedIngredients(selectedIngredients.filter((i) => i.IngredientID !== id));
  };

  // -----------------------------
  // Add Menu
  // -----------------------------
  const handleAddMenu = async (e) => {
    e.preventDefault();
    if (
      !form.MenuName ||
      !form.MenuPrice ||
      !form.MenuDescription ||
      !form.Bake_Time ||
      selectedIngredients.length === 0
    ) {
      return alert("All fields are required!");
    }

    const price = parseFloat(form.MenuPrice);
    const bakeTime = parseFloat(form.Bake_Time);

    // ✅ ดักค่าเกินขอบเขต
    if (price <= 0 || price > 5000) {
      return alert("Price must be between 1 and 5000");
    }
    if (bakeTime <= 0 || bakeTime > 300) {
      return alert("Bake Time must be between 1 and 300 minutes");
    }

    for (let ing of selectedIngredients) {
      if (!ing.qty_required || isNaN(ing.qty_required)) {
        return alert(`Quantity for ${ing.IngredientName} is invalid`);
      }
      if (ing.qty_required < 1 || ing.qty_required > 500) {
        return alert(
          `Quantity for ${ing.IngredientName} must be between 1 and 500`
        );
      }
    }

    try {
      const newMenu = {
        ...form,
        Ingredients: selectedIngredients.map((i) => ({
          IngredientID: i.IngredientID,
          qty_required: parseFloat(i.qty_required),
          Unit: i.Unit,
        })),
      };

      const res = await addMenu(newMenu);
      setMenus([...menus, { ...newMenu, MenuID: res.MenuID, Is_Available: true }]);

      setForm({
        MenuName: "",
        MenuPrice: "",
        MenuDescription: "",
        Bake_Time: "",
        Is_Custom: false,
      });
      setSelectedIngredients([]);
      setIngredientInput("");
    } catch (err) {
      console.error(err);
      alert("Failed to add menu");
    }
  };

  // -----------------------------
  // Update Menu
  // -----------------------------
  const handleUpdateMenu = async (e) => {
    e.preventDefault();
    if (
      !form.MenuName ||
      !form.MenuPrice ||
      !form.MenuDescription ||
      !form.Bake_Time ||
      selectedIngredients.length === 0
    ) {
      return alert("All fields are required!");
    }

    const price = parseFloat(form.MenuPrice);
    const bakeTime = parseFloat(form.Bake_Time);

    if (price <= 0 || price > 5000) {
      return alert("Price must be between 1 and 5000");
    }
    if (bakeTime <= 0 || bakeTime > 300) {
      return alert("Bake Time must be between 1 and 300 minutes");
    }

    for (let ing of selectedIngredients) {
      if (!ing.qty_required || isNaN(ing.qty_required)) {
        return alert(`Quantity for ${ing.IngredientName} is invalid`);
      }
      if (ing.qty_required < 1 || ing.qty_required > 500) {
        return alert(
          `Quantity for ${ing.IngredientName} must be between 1 and 500`
        );
      }
    }

    try {
      const updatedMenu = {
        MenuName: form.MenuName,
        MenuPrice: form.MenuPrice,
        MenuDescription: form.MenuDescription,
        Bake_Time: form.Bake_Time,
        Is_Custom: form.Is_Custom,
      };

      const ingredientsToUpdate = selectedIngredients.map((i) => ({
        IngredientID: i.IngredientID,
        qty_required: parseFloat(i.qty_required),
        Unit: i.Unit,
      }));

      await updateMenu(editingMenuId, updatedMenu);
      await updateMenuIngredients(editingMenuId, ingredientsToUpdate);

      setMenus(
        menus.map((m) =>
          m.MenuID === editingMenuId
            ? { ...m, ...updatedMenu, Ingredients: selectedIngredients }
            : m
        )
      );

      alert("Menu and ingredients updated successfully!");

      setForm({
        MenuName: "",
        MenuPrice: "",
        MenuDescription: "",
        Bake_Time: "",
        Is_Custom: false,
      });
      setSelectedIngredients([]);
      setEditingMenuId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update menu and ingredients");
    }
  };

  // -----------------------------
  // Toggle Availability
  // -----------------------------
  const handleToggle = async (menuID, currentStatus) => {
    try {
      await toggleMenuStatus(menuID, !currentStatus);
      setMenus(
        menus.map((m) =>
          m.MenuID === menuID ? { ...m, Is_Available: !currentStatus } : m
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update menu status");
    }
  };

  if (loading) return <p>Loading menus...</p>;

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-center">Menu Manager</h2>

      {/* Add / Edit Menu Form */}
      <Card>
        <CardContent className="space-y-3">
          <h3 className="text-xl font-semibold">
            {editingMenuId ? "Edit Menu" : "Add New Menu"}
          </h3>
          <form
            onSubmit={editingMenuId ? handleUpdateMenu : handleAddMenu}
            className="space-y-2"
          >
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
              placeholder="Price (1–5000)"
              value={form.MenuPrice}
              onChange={handleChange}
              min="1"
              max="5000"
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
              placeholder="Bake Time (1–300 min)"
              value={form.Bake_Time}
              onChange={handleChange}
              min="1"
              max="300"
              className="border p-1 rounded w-full"
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="Is_Custom"
                checked={form.Is_Custom}
                onChange={handleChange}
              />
              <span>Custom Menu?</span>
            </label>

            {/* Ingredient Input */}
            <div>
              <input
                type="text"
                placeholder="Search ingredient..."
                value={ingredientInput}
                onChange={handleIngredientInput}
                className="border p-1 rounded w-full"
              />
              {filteredIngredients.length > 0 && (
                <ul className="border bg-white max-h-40 overflow-y-auto">
                  {filteredIngredients.map((i) => (
                    <li
                      key={i.IngredientID}
                      className="p-1 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleSelectIngredient(i)}
                    >
                      {i.IngredientName} ({i.Unit})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Selected Ingredients */}
            {selectedIngredients.length > 0 && (
              <div className="space-y-1">
                {selectedIngredients.map((i) => (
                  <div
                    key={i.IngredientID}
                    className="flex items-center space-x-2"
                  >
                    <span className="text-sm w-32">
                      {i.IngredientName} ({i.Unit})
                    </span>
                    <input
                      type="number"
                      placeholder="Qty (1–500)"
                      value={i.qty_required}
                      min="1"
                      max="500"
                      onChange={(e) =>
                        handleIngredientQtyChange(
                          i.IngredientID,
                          "qty_required",
                          e.target.value
                        )
                      }
                      className="border p-1 rounded w-20 text-sm"
                    />
                    <button
                      type="button"
                      className="text-red-500 px-2"
                      onClick={() => handleRemoveIngredient(i.IngredientID)}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-1 rounded mt-2"
              >
                {editingMenuId ? "Save Changes" : "Add Menu"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Menu List */}
      <Card>
        <CardContent className="space-y-3 overflow-x-auto">
          <h3 className="text-xl font-semibold">Menus</h3>
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
              {menus.map((m) => (
                <tr key={m.MenuID} className="border-t align-top">
                  <td className="px-4 py-2">{m.MenuName}</td>
                  <td className="px-4 py-2">{m.MenuPrice}</td>
                  <td className="px-4 py-2">{m.MenuDescription}</td>
                  <td className="px-4 py-2">{m.Bake_Time} min</td>
                  <td className="px-4 py-2 text-sm whitespace-pre-line">
                    {(m.Ingredients || [])
                      .map(
                        (i) => `${i.IngredientName} (${i.qty_required} ${i.Unit})`
                      )
                      .join("\n")}
                  </td>
                  <td className="px-4 py-2 flex flex-col space-y-1">
                    <button
                      className={`px-2 py-1 rounded ${
                        m.Is_Available ? "bg-green-500" : "bg-gray-400"
                      } text-white`}
                      onClick={() => handleToggle(m.MenuID, m.Is_Available)}
                    >
                      {m.Is_Available ? "Available" : "Unavailable"}
                    </button>
                    <button
                      className="px-2 py-1 bg-yellow-500 text-white rounded"
                      onClick={() => handleEditMenu(m.MenuID)}
                    >
                      Edit
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
