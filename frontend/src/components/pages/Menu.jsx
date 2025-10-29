//Menu.jsx
import { useState, useEffect } from "react";
import { getMenus } from '../../api/menuApi';

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await getMenus();
        setMenus(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  if (loading) return <p>Loading menus...</p>;
  if (menus.length === 0) return <p>No menus available.</p>;

  return (
    <div className="ml-64 p-8 min-h-screen bg-background">
      <h1 className="text-3xl font-bold mb-4">Available Menus</h1>
      <table className="w-full table-auto border rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border-b">Name</th>
            <th className="p-3 border-b">Price</th>
            <th className="p-3 border-b">Description</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((m) => (
            <tr key={m.MenuID} className="hover:bg-gray-50">
              <td className="p-3 border-b">{m.MenuName}</td>
              <td className="p-3 border-b">{m.MenuPrice}฿</td>
              <td className="p-3 border-b">{m.MenuDescription}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Menu;
