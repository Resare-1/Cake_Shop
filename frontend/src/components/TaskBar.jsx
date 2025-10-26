import React from 'react';

export default function TaskBar({ active, setActive, user, onLogout }) {
  const items = [
    { key: 'menu', label: 'Menu' },
    { key: 'orders', label: 'Orders' },
    { key: 'ingredients', label: 'Ingredients' },
  ];

  return (
    <div>
      <div className="mb-4">
        <p className="font-bold">{user.username}</p>
        <p className="text-sm text-gray-500">{user.role}</p>
        <button onClick={onLogout} className="text-red-600 text-sm">Logout</button>
      </div>

      <ul>
        {items.map(i => (
          <li key={i.key}>
            <button onClick={() => setActive(i.key)}
              className={`w-full text-left p-2 rounded ${active===i.key ? 'bg-blue-600 text-white':'hover:bg-gray-200'}`}>
              {i.label}
            </button>
          </li>
        ))}
      </ul>

      {user.role === 'Manager' && (
        <div className="mt-4">
          <button
            onClick={() => window.open('http://localhost:3001/api/report/finance', '_blank')}
            className="bg-green-600 text-white w-full p-2 rounded">
            Export Finance CSV
          </button>
        </div>
      )}
    </div>
  );
}
