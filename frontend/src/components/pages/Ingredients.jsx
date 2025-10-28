import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";

export default function IngredientsManager() {
  const [ingredients, setIngredients] = useState([
    { id: 1, name: "Flour", quantity: 50, unit: "kg" },
    { id: 2, name: "Sugar", quantity: 30, unit: "kg" },
    { id: 3, name: "Butter", quantity: 10, unit: "kg" },
  ]);

  const [newIngredient, setNewIngredient] = useState({
    name: "",
    unit: "",
    quantity: 0,
  });

  // Object to store typed delta for each ingredient
  const [editQty, setEditQty] = useState({});

  // -----------------------------
  // Update stock based on delta input
  // -----------------------------
  const updateStock = (id) => {
    const delta = parseInt(editQty[id]) || 0;
    setIngredients((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          if (newQty < 0) {
            alert("Quantity cannot be negative");
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
    setEditQty((prev) => ({ ...prev, [id]: "" })); // Clear input
    alert("Stock updated successfully!");
  };

  // -----------------------------
  // Add new ingredient
  // -----------------------------
  const addIngredient = () => {
    if (!newIngredient.name || !newIngredient.unit) {
      alert("Name and unit cannot be empty");
      return;
    }

    const newItem = {
      id: ingredients.length + 1,
      name: newIngredient.name,
      quantity: newIngredient.quantity || 0,
      unit: newIngredient.unit,
    };

    setIngredients([...ingredients, newItem]);
    setNewIngredient({ name: "", unit: "", quantity: 0 });
    alert("New ingredient added!");
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
                  <tr key={item.id}>
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2">{item.quantity}</td>
                    <td className="border p-2">{item.unit}</td>
                    <td className="border p-2 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <input
                          type="number"
                          placeholder="Change"
                          className="w-20 p-1 border rounded text-center"
                          value={editQty[item.id] ?? ""}
                          onChange={(e) =>
                            setEditQty((prev) => ({
                              ...prev,
                              [item.id]: e.target.value,
                            }))
                          }
                        />
                        <Button onClick={() => updateStock(item.id)}>Update</Button>
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
            onChange={(e) =>
              setNewIngredient({ ...newIngredient, name: e.target.value })
            }
          />
          <Input
            placeholder="Unit (e.g. kg, ml)"
            value={newIngredient.unit}
            onChange={(e) =>
              setNewIngredient({ ...newIngredient, unit: e.target.value })
            }
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
            <Button onClick={addIngredient}>Add Ingredient</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
