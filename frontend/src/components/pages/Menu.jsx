import { useState } from "react";

const Menu = () => {
  const [menus] = useState([
    { MenuID: 1, MenuName: "Strawberry Cake", MenuPrice: 400, MenuDescription: "Fresh strawberry cream cake", Bake_Time: 50, Ingredients: ["Whipping Cream", "Strawberry"] },
    { MenuID: 2, MenuName: "Chocolate Cake", MenuPrice: 350, MenuDescription: "Rich chocolate cake", Bake_Time: 45, Ingredients: ["Cocoa", "Butter"] },
    { MenuID: 3, MenuName: "Vanilla Cupcake", MenuPrice: 120, MenuDescription: "Light vanilla cupcake", Bake_Time: 30, Ingredients: ["Flour", "Vanilla", "Eggs"] },
  ]);

  return (
    <div className="ml-64 p-8 min-h-screen bg-background">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold text-foreground mb-4">Available Menus</h1>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-border rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b border-border">Name</th>
                <th className="p-3 border-b border-border">Price</th>
                <th className="p-3 border-b border-border">Description</th>
                <th className="p-3 border-b border-border">Bake Time</th>
                <th className="p-3 border-b border-border">Ingredients</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((m) => (
                <tr key={m.MenuID} className="hover:bg-gray-50">
                  <td className="p-3 border-b border-border">{m.MenuName}</td>
                  <td className="p-3 border-b border-border">{m.MenuPrice}฿</td>
                  <td className="p-3 border-b border-border">{m.MenuDescription}</td>
                  <td className="p-3 border-b border-border">{m.Bake_Time} min</td>
                  <td className="p-3 border-b border-border">{m.Ingredients.join(", ")}</td>
                </tr>
              ))}
              {menus.length === 0 && (
                <tr>
                  <td className="p-3" colSpan={5}>No menus available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Menu;
