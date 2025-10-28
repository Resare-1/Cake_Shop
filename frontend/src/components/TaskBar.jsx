import { LogOut, Menu as MenuIcon, ShoppingBag, Package } from 'lucide-react';
import { Button } from '../components/ui/button';

const TaskBar = ({ active, setActive, user, onLogout }) => {
  // Define menu items based on role
  const getMenuItems = () => {
    const role = user.role.toLowerCase();

    if (role === 'staff') {
      return [
        { key: 'orders', label: 'Orders', icon: ShoppingBag },
        { key: 'take-order', label: 'Take Order', icon: MenuIcon },
        { key: 'fix-order', label: 'Fix Order', icon: MenuIcon}
      ];
    }

    if (role === 'admin') {
      return [
        { key: 'orders', label: 'Orders', icon: ShoppingBag },
        { key: 'send-order', label: 'Send Order to Kitchen', icon: ShoppingBag }
      ];
    }

    if (role === 'manager') {
      return [
        { key: 'menu', label: 'Menu', icon: MenuIcon },
        { key: 'orders', label: 'Orders', icon: ShoppingBag },
        { key: 'ingredients', label: 'Ingredients Management', icon: Package },
        { key: 'confirm-order', label: 'Confirm Order', icon: ShoppingBag },
        { key: 'add-menu', label: 'Add New Menu', icon: ShoppingBag },
        { key: 'disable-menu', label: 'Disable Menu', icon: ShoppingBag },
        { key: 'add-ingredients', label: 'Add New Ingredient', icon: ShoppingBag },
      ];
    }

    return [];
  };

  const items = getMenuItems();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar-bg text-sidebar-text flex flex-col shadow-lg">
      {/* User Section */}
      <div className="p-6 border-b border-sidebar-text/20">
        <div className="mb-4">
          <p className="font-bold text-lg">{user.username}</p>
          <p className="text-sm text-sidebar-text/80">{user.role}</p>
        </div>
        <Button
          onClick={onLogout}
          variant="outline"
          size="sm"
          className="w-full bg-transparent border-sidebar-text/30 text-sidebar-text hover:bg-sidebar-hover hover:border-sidebar-text/50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all ${
                active === item.key
                  ? 'bg-sidebar-active shadow-md'
                  : 'hover:bg-sidebar-hover'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Manager Export Button */}
      {user.role.toLowerCase() === 'manager' && (
        <div className="p-4 border-t border-sidebar-text/20">
          <Button
            onClick={() => window.open('http://localhost:3001/api/report/finance', '_blank')}
            className="w-full bg-sidebar-text text-sidebar-bg hover:bg-sidebar-text/90"
          >
            Export Finance CSV
          </Button>
        </div>
      )}
    </aside>
  );
};

export default TaskBar;
