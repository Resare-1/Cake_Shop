import SendOrder from './pages/SendOrder';
import Orders from './pages/Orders';
import Ingredients from './pages/Ingredients';
import TakeOrder from './pages/TakeOrder';
import FixOrder from './pages/FixOrder';
import OrdersManager from './pages/OrdersManager';
import Employees from './pages/Employees';
import MenuManager from './pages/MenuManager';
import Menu from './pages/Menu';
import CompleteOrders from './pages/CompleteOrders'; // <-- เพิ่มตรงนี้

const MainContent = ({ active }) => {
  switch (active) {
    case 'send-order':
      return <SendOrder />; // Staff / Admin use case
    case 'orders':
      return <Orders />; // Placeholder page
    case 'take-order':
      return <TakeOrder />; 
    case 'fix-order':
      return <FixOrder />; 
    case 'orders-manage':
      return <OrdersManager />
    case 'ingredients':
      return <Ingredients />
    case 'employees':
      return <Employees />
    case 'menu-manage':
      return <MenuManager />
    case 'menu':
      return <Menu />
    case 'complete-orders': // <-- เพิ่ม case นี้
      return <CompleteOrders />;

    default:
      // Fallback to original generic placeholder
      return (
        <div className="ml-64 p-8 min-h-screen bg-background">
          <div className="max-w-6xl">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {active.charAt(0).toUpperCase() + active.slice(1)}
            </h1>
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <p className="text-muted-foreground">
                Content for {active} will be displayed here.
              </p>
            </div>
          </div>
        </div>
      );
  }
};

export default MainContent;
