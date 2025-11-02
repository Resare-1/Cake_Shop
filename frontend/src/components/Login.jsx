import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // สำหรับแสดง error message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // เคลียร์ error ก่อนส่ง
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    try {
      await onLogin({ username, password });
    } catch (err) {
      // แยกข้อความตาม status code หรือข้อความที่ backend ส่งมา
      if (err.message.includes('deactivated')) {
        setError('บัญชีถูกปิดการใช้งาน กรุณาติดต่อผู้จัดการ');
      } else if (err.message.includes('User not found')) {
        setError('ไม่พบผู้ใช้งาน');
      } else if (err.message.includes('Invalid password')) {
        setError('รหัสผ่านไม่ถูกต้อง');
      } else {
        setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-lg border border-border">
        <h1 className="text-3xl font-bold text-foreground mb-6 text-center">
          Welcome Back
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Username
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
