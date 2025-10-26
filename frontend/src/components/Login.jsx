import React, { useState } from 'react';
import { auth } from '../api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin() {
    try {
      const res = await auth.login({ username, password });
      onLogin(res.user, res.token);
    } catch (err) {
      setError(err.error || 'Login failed');
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">CakeShop Login</h2>
        <input className="border p-2 w-full mb-3" placeholder="Username" onChange={e=>setUsername(e.target.value)} />
        <input type="password" className="border p-2 w-full mb-3" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button className="bg-blue-600 text-white w-full p-2 rounded" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}
