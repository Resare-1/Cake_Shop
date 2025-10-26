import React, { useState } from 'react';
import TaskBar from './components/TaskBar';
import MainContent from './components/MainContent';
import Login from './components/Login';

export default function App() {
  const [active, setActive] = useState('menu');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  if (!user) return <Login onLogin={(u, t) => {
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
  }} />;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <main className="flex-1 p-6">
        <MainContent active={active} />
      </main>
      <aside className="w-72 border-l bg-white p-4 hidden md:block">
        <TaskBar active={active} setActive={setActive} user={user} onLogout={() => {
          localStorage.clear();
          setUser(null);
        }} />
      </aside>
    </div>
  );
}
