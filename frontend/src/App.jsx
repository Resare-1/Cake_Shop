import React, { useState } from 'react';
import TaskBar from './components/TaskBar';
import MainContent from './components/MainContent';
import Login from './components/Login';
import { loginUser } from './api/authApi';
import CompleteOrders from './components/pages/CompleteOrders';
export default function App() {
  const [active, setActive] = useState('menu');

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setActive('menu');
  };

  if (!user)
    return (
      <Login
        onLogin={async ({ username, password }) => {
          try {
            const result = await loginUser(username, password);
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            setUser(result.user);
            setActive('menu');
          } catch (err) {
            alert(err.message);
          }
        }}
      />
    );

  return (
    <div className="flex h-screen">
      <TaskBar active={active} setActive={setActive} user={user} onLogout={handleLogout} />
      <main className="flex-1 bg-background p-6 overflow-y-auto">
        <MainContent key={user?.Name} active={active} />
      </main>
    </div>
  );
}
