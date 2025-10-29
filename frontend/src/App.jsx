// App.jsx
import React, { useState } from 'react';
import TaskBar from './components/TaskBar';
import MainContent from './components/MainContent';
import Login from './components/Login';

export default function App() {
  const [active, setActive] = useState('menu');

  // โหลด user จาก localStorage (null ถ้าไม่เคย login)
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  // ฟังก์ชัน login: call backend API
  const loginUser = async (username, password) => {
    const res = await fetch('http://localhost:3006/api/login', { // เปลี่ยน port ให้ตรง backend ของคุณ
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }), // username = Name ใน DB
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Login failed');
    }

    return await res.json(); // { user: {...}, token: '...' }
  };

  // ถ้า user ยังไม่ login ให้แสดง Login component
  if (!user)
    return (
      <Login
        onLogin={async ({ username, password }) => {
          try {
            const result = await loginUser(username, password);

            // เก็บ token และ user ลง localStorage
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));

            setUser(result.user); // update state
            setActive('menu'); // reset tab

            console.log('Login successful');
          } catch (err) {
            alert(err.message);
          }
        }}
      />
    );

  // Logout: ลบข้อมูล user และ token
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setActive('menu'); // reset tab
    console.log('Logged out successfully');
  };

  return (
    <div className="flex h-screen">
      {/* Left sidebar */}
      <TaskBar active={active} setActive={setActive} user={user} onLogout={handleLogout} />

      {/* Right content */}
      <main className="flex-1 bg-background p-6 overflow-y-auto">
        <MainContent key={user?.Name} active={active} />
      </main>
    </div>
  );
}
