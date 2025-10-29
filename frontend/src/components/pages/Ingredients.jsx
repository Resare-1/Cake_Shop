import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { getAllIngredients, addIngredient, updateIngredientStock } from "../../api/ingredientApi";


export default function IngredientsManager() {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({ name: "", unit: "", quantity: 0 });
  const [editQty, setEditQty] = useState({});

  // ดึง ingredient จาก backend
const fetchIngredients = async () => {
  try {
    const data = await getAllIngredients();
    setIngredients(data);
  } catch (err) {
    console.error(err);
    alert("ไม่สามารถโหลด ingredients ได้");
  }
};

  useEffect(() => {
    fetchIngredients();
  }, []);

  // -----------------------------
  // Update stock based on delta input
  // -----------------------------
  const handleUpdateStock = async (id) => {
    const delta = parseInt(editQty[id]) || 0;
    if (delta === 0) return;

    try {
      await updateIngredientStock(id, delta);
      alert("Stock updated successfully!");
      setEditQty((prev) => ({ ...prev, [id]: "" }));
      fetchIngredients();
    } catch (err) {
      console.error(err);
      alert("Failed to update stock");
    }
  };

  // -----------------------------
  // Add new ingredient
  // -----------------------------
  const handleAddIngredient = async () => {
    if (!newIngredient.name || !newIngredient.unit) {
      alert("Name and unit cannot be empty");
      return;
    }

    try {
      await addIngredient(newIngredient);
      alert("New ingredient added!");
      setNewIngredient({ name: "", unit: "", quantity: 0 });
      fetchIngredients();
    } catch (err) {
      console.error(err);
      alert("Failed to add ingredient");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-center">Ingredients Manager</h1>

      {/* Ingredients List */}
      <Card>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Quantity</th>
                  <th className="border p-2 text-left">Unit</th>
                  <th className="border p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((item) => (
                  <tr key={item.IngredientID}>
                    <td className="border p-2">{item.IngredientName}</td>
                    <td className="border p-2">{item.Quantity}</td>
                    <td className="border p-2">{item.Unit}</td>
                    <td className="border p-2 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <input
                          type="number"
                          placeholder="Change"
                          className="w-20 p-1 border rounded text-center"
                          value={editQty[item.IngredientID] ?? ""}
                          onChange={(e) =>
                            setEditQty((prev) => ({
                              ...prev,
                              [item.IngredientID]: e.target.value,
                            }))
                          }
                        />
                        <Button onClick={() => handleUpdateStock(item.IngredientID)}>Update</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Ingredient */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="text-lg font-semibold text-center">Add New Ingredient</h2>
          <Input
            placeholder="Ingredient Name"
            value={newIngredient.name}
            onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
          />
          <Input
            placeholder="Unit (e.g. kg, ml)"
            value={newIngredient.unit}
            onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Initial Quantity (optional)"
            value={newIngredient.quantity}
            onChange={(e) =>
              setNewIngredient({
                ...newIngredient,
                quantity: parseInt(e.target.value) || 0,
              })
            }
          />
          <div className="flex justify-center">
            <Button onClick={handleAddIngredient}>Add Ingredient</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
