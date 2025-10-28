// App.jsx
import React, { useState } from 'react';
import TaskBar from './components/TaskBar';
import MainContent from './components/MainContent';
import Login from './components/Login';

export default function App() {
  const [active, setActive] = useState('menu');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  if (!user)
    return (
      <Login
        onLogin={(u, t) => {
          localStorage.setItem('token', t);
          localStorage.setItem('user', JSON.stringify(u));
          setUser(u);

          // Reset state for new user login
          setActive('menu'); // or default page for new user
        }}
      />
    );

  const handleLogout = () => {
    // Clear storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Reset all state to default
    setUser(null);
    setActive('menu'); // reset active tab to default

    console.log('Logged out successfully');
  };

  return (
    <div className="flex h-screen">
      {/* Left sidebar */}
      <TaskBar active={active} setActive={setActive} user={user} onLogout={handleLogout} />

      {/* Right content */}
      <main className="flex-1 bg-background p-6 overflow-y-auto">
        <MainContent key={user?.username} active={active} />
      </main>
    </div>
  );
}
