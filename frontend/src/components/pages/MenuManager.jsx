// frontend/src/components/pages/MenuManager.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { getMenus, addMenu, toggleMenuStatus } from "../../api/menuApi";
import { getIngredients } from "../../api/ingredientApi";

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

  // -----------------------------
  // Load menus from backend
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

  // -----------------------------
  // Load all ingredients
  // -----------------------------
  const fetchIngredients = async () => {
    try {
      const data = await getIngredients();
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
  // Handle form input change
  // -----------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // -----------------------------
  // Auto-complete for ingredient
  // -----------------------------
const handleIngredientInput = (e) => {
  const value = e.target.value;
  setIngredientInput(value);

  if (!value) {
    setFilteredIngredients([]);
    return;
  }

  // Filter และ unique ด้วย IngredientID
  const filtered = allIngredientsOriginal
    .filter(i => i.IngredientName.toLowerCase().includes(value.toLowerCase()))
    .filter((v, i, a) => a.findIndex(t => t.IngredientID === v.IngredientID) === i);

  setFilteredIngredients(filtered);
};

  const handleSelectIngredient = (ingredient) => {
    // Avoid duplicates
    if (!selectedIngredients.find((i) => i.IngredientID === ingredient.IngredientID)) {
      setSelectedIngredients([...selectedIngredients, { ...ingredient, qty_required: "", Unit: ingredient.Unit }]);
    }
    setIngredientInput("");
    setFilteredIngredients([]);
  };

  const handleIngredientQtyChange = (id, field, value) => {
    setSelectedIngredients(selectedIngredients.map((i) =>
      i.IngredientID === id ? { ...i, [field]: value } : i
    ));
  };

  const handleRemoveIngredient = (id) => {
    setSelectedIngredients(selectedIngredients.filter((i) => i.IngredientID !== id));
  };

  // -----------------------------
  // Add new menu
  // -----------------------------
  const handleAddMenu = async (e) => {
    e.preventDefault();

    if (!form.MenuName || !form.MenuPrice || !form.MenuDescription || !form.Bake_Time || selectedIngredients.length === 0) {
      alert("All fields are required!");
      return;
    }

    // Validate qty_required
    for (let ing of selectedIngredients) {
      if (!ing.qty_required || isNaN(ing.qty_required)) {
        alert(`Quantity for ${ing.IngredientName} is invalid`);
        return;
      }
    }

    try {
      const newMenu = {
        ...form,
        Ingredients: selectedIngredients.map((i) => ({
          IngredientID: i.IngredientID,
          IngredientName: i.IngredientName,
          qty_required: parseFloat(i.qty_required),
          Unit: i.Unit
        })),
      };

      const res = await addMenu(newMenu);

      setMenus([
        ...menus,
        { ...newMenu, MenuID: res.MenuID, Is_Available: true },
      ]);

      alert("New menu added!");

      // Reset form
      setForm({ MenuName: "", MenuPrice: "", MenuDescription: "", Bake_Time: "", Is_Custom: false });
      setSelectedIngredients([]);
      setIngredientInput("");
    } catch (err) {
      console.error(err);
      alert("Failed to add menu");
    }
  };

  // -----------------------------
  // Toggle menu availability
  // -----------------------------
  const handleToggle = async (menuID, currentStatus) => {
    try {
      await toggleMenuStatus(menuID, !currentStatus);
      setMenus(menus.map(m => m.MenuID === menuID ? { ...m, Is_Available: !currentStatus } : m));
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
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="Is_Custom" checked={form.Is_Custom} onChange={handleChange} />
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
                  <div key={i.IngredientID} className="flex items-center space-x-2">
                    <span className="text-sm w-32">{i.IngredientName} ({i.Unit})</span>
                    <input
                      type="number"
                      placeholder="Qty"
                      value={i.qty_required}
                      onChange={(e) => handleIngredientQtyChange(i.IngredientID, "qty_required", e.target.value)}
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
              <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded mt-2">Add Menu</button>
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
              {menus.map(m => (
                <tr key={m.MenuID} className="border-t align-top">
                  <td className="px-4 py-2">{m.MenuName}</td>
                  <td className="px-4 py-2">{m.MenuPrice}</td>
                  <td className="px-4 py-2">{m.MenuDescription}</td>
                  <td className="px-4 py-2">{m.Bake_Time} min</td>
                  <td className="px-4 py-2 text-sm whitespace-pre-line">
                    {(m.Ingredients || []).map(i => `${i.IngredientName} (${i.qty_required} ${i.Unit})`).join("\n")}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className={`px-2 py-1 rounded ${m.Is_Available ? "bg-green-500" : "bg-gray-400"} text-white`}
                      onClick={() => handleToggle(m.MenuID, m.Is_Available)}
                    >
                      {m.Is_Available ? "Available" : "Unavailable"}
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
