// App.jsx

// import React, { useState } from 'react';
// import TaskBar from './components/TaskBar';
// import MainContent from './components/MainContent';
// import Login from './components/Login';

// export default function App() {
//   // State for currently active tab/page
//   const [active, setActive] = useState('menu');

//   // State for current logged-in user
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

//   // Function to login user by calling backend API
//   const loginUser = async (username, password) => {
//     try {
//       // Call the backend login endpoint
//       const response = await fetch('http://localhost:3001/api/login', { // replace URL with real backend
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }), // send credentials in request body
//       });

//       // If backend returns error, throw it
//       if (!response.ok) {
//         const errData = await response.json();
//         throw new Error(errData.message || 'Login failed');
//       }

//       // Parse JSON response: expected { user: {...}, token: '...' }
//       const data = await response.json();
//       return data;

//     } catch (err) {
//       // Throw error to caller
//       throw err;
//     }
//   };

//   // If no user is logged in, show Login page
//   if (!user)
//     return (
//       <Login
//         onLogin={async (u) => {
//           // Handle login event from Login component
//           try {
//             // Call backend login function
//             const result = await loginUser(u.username, u.password);

//             // Save token and user info in localStorage for persistence
//             localStorage.setItem('token', result.token);
//             localStorage.setItem('user', JSON.stringify(result.user));

//             // Update state so that app knows user is logged in
//             setUser(result.user);

//             // Reset the active tab for new user
//             setActive('menu');

//             console.log('Login successful (backend)');
//           } catch (err) {
//             // Show error message if login fails
//             alert(err.message);
//           }
//         }}
//       />
//     );

//   // Handle logout
//   const handleLogout = () => {
//     // Remove stored token and user info
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');

//     // Reset app state
//     setUser(null);
//     setActive('menu'); // reset active tab to default

//     console.log('Logged out successfully');
//   };

//   // Main App layout
//   // Left: TaskBar (sidebar)
//   // Right: MainContent (page content based on active tab)
//   return (
//     <div className="flex h-screen">
//       {/* Left sidebar navigation */}
//       <TaskBar active={active} setActive={setActive} user={user} onLogout={handleLogout} />

//       {/* Main content area */}
//       <main className="flex-1 bg-background p-6 overflow-y-auto">
//         {/* key={user?.username} ensures MainContent reloads when a different user logs in */}
//         <MainContent key={user?.username} active={active} />
//       </main>
//     </div>
//   );
// }




import React, { useState } from 'react';
import TaskBar from './components/TaskBar';
import MainContent from './components/MainContent';
import Login from './components/Login';

export default function App() {
  const [active, setActive] = useState('menu');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  // -----------------------------
  // MOCK login function (replace with real API call later)
  // -----------------------------
  const loginUser = async (username, password) => {
    // Simulate backend check
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock users
        const users = [
          { username: 'manager', role: 'Manager', fullname: 'Manager Account' },
          { username: 'admin', role: 'Admin', fullname: 'Admin Account' },
          { username: 'staff', role: 'Staff', fullname: 'Staff Account' },
        ];

        const found = users.find(u => u.username === username);
        if (!found) return reject('Invalid username');
        if (!password) return reject('Invalid password'); // Simple check

        resolve({ user: found, token: 'mock-token-123' });
      }, 500); // simulate network delay
    });
  };

  if (!user)
    return (
      <Login
        onLogin={async (u, t) => {
          // -----------------------------
          // New login integration (mock)
          // -----------------------------
          try {
            const result = await loginUser(u.username, u.password);
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            setUser(result.user);

            // Reset active page for new user
            setActive('menu');
            console.log('Login successful (mock)');
          } catch (err) {
            alert(err);
          }

          // -----------------------------
          // Existing code preserved
          // -----------------------------
          // localStorage.setItem('token', t);
          // localStorage.setItem('user', JSON.stringify(u));
          // setUser(u);
          // setActive('menu');
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

