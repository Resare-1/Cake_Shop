import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple demo login - replace with real auth later
    if (username && password) {
      let role = 'staff';
      const usernameLower = username.toLowerCase();
      
      if (usernameLower.includes('manager')) {
        role = 'manager';
      } else if (usernameLower.includes('admin')) {
        role = 'admin';
      }
      
      onLogin({
        username: username,
        role: role
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-lg border border-border">
        <h1 className="text-3xl font-bold text-foreground mb-6 text-center">
          Welcome Back
        </h1>
        
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

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Tip: Use "manager", "admin", or "staff" in username for roles
        </p>
      </div>
    </div>
  );
};

export default Login;
