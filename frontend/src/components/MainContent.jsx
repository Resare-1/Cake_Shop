import React, { useEffect, useState } from 'react';
import { menusAPI } from '../api';

export default function MainContent({ active }) {
  if (active === 'menu') return <MenuPage />;
  if (active === 'orders') return <div>Orders page (coming soon)</div>;
  if (active === 'ingredients') return <div>Ingredients page (coming soon)</div>;
  return <div>Select menu</div>;
}

function MenuPage() {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    menusAPI.list().then(setMenus).catch(console.error);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Menu List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menus.map(m => (
          <div key={m.MenuID} className="border p-4 rounded bg-white shadow">
            <h3 className="font-semibold">{m.MenuName}</h3>
            <p>{m.MenuDescription}</p>
            <p className="mt-2 font-bold">฿{m.MenuPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
