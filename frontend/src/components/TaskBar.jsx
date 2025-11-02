import React, { useState, useEffect } from 'react';
import { LogOut, Menu as MenuIcon, ShoppingBag, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { getOrders } from '../api/orderApi';
import { getAllIngredients } from '../api/ingredientApi';
import { getStaff } from '../api/staffApi'; // ✅ เพิ่ม import

const exportCSV = async () => {
  const token = localStorage.getItem("token");
  if (!token) return alert("You must login first");

  try {
    const res = await fetch("http://localhost:3006/api/report/sales", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Failed to export CSV");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales_report.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const TaskBar = ({ active, setActive, user, onLogout }) => {
  const [notifications, setNotifications] = useState({
    pendingOrders: 0,
    lowStock: 0,
    checkOrder: 0,
  });

  const [staffInfo, setStaffInfo] = useState(null); // ✅ เก็บข้อมูลพนักงาน

// 🔹 ดึงข้อมูลแจ้งเตือนเฉพาะ staff
const fetchNotifications = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const orders = await getOrders(token);

    if (user.role.toLowerCase() === "staff") {
      const takeOrder = orders.filter(o => o.Order_Status === "Pending").length;
      const fixOrder = orders.filter(o => o.Order_Status === "Cancel").length;
      const completeOrder = orders.filter(o => o.Order_Status === "Processing").length;

      setNotifications(prev => ({
        ...prev,
        pendingOrders: 0,   // Orders menu ไม่มี badge
        takeOrder,
        fixOrder,
        completeOrder
      }));
    }

    // สำหรับ manager / admin สามารถคง logic เดิม
    if (user.role.toLowerCase() === "manager") {
      const ingredients = await getAllIngredients(token);
      const lowStock = ingredients.filter(i => i.Quantity <= 0).length;
      const checkOrders = orders.filter(o => o.Order_Status === "CheckOrder").length;

      setNotifications(prev => ({
        ...prev,
        lowStock,
        checkOrder: checkOrders
      }));
    }

  } catch (err) {
    console.error(err);
  }
};


  // 🔹 ดึงข้อมูล staff ของ user ที่ login
const fetchStaffData = async () => {
  try {
    if (!user.StaffID) return;

    const allStaff = await getStaff();
    const found = allStaff.find(s => s.StaffID === user.StaffID);
    setStaffInfo(found || null);
  } catch (err) {
    console.error("Failed to load staff info:", err);
  }
};


  useEffect(() => {
    fetchStaffData();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 500); // refresh ทุก 0.5 วินาที
    return () => clearInterval(interval);
  }, [user]);

  // 🔹 กำหนดเมนูตาม role
  const getMenuItems = () => {
    const role = user.role.toLowerCase();

    if (role === 'staff') {
      return [
        { key: 'orders', label: 'Orders', icon: ShoppingBag }, // ไม่มี badge
        { key: 'take-order', label: 'Take Order', icon: MenuIcon, badge: notifications.takeOrder },
        { key: 'fix-order', label: 'Fix Order', icon: MenuIcon, badge: notifications.fixOrder },
        { key: 'complete-orders', label: 'Complete Orders', icon: MenuIcon, badge: notifications.completeOrder },
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
        { key: 'menu-manage', label: 'Menu Manager', icon: ShoppingBag },
        { key: 'orders-manage', label: 'Orders Manager', icon: ShoppingBag, badge: notifications.checkOrder },
        { key: 'ingredients', label: 'Stock Manager', icon: Package, badge: notifications.lowStock },
        { key: 'employees', label: 'Employees Manager', icon: ShoppingBag },
      ];
    }

    return [];
  };

  const items = getMenuItems();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar-bg text-sidebar-text flex flex-col shadow-lg">
      {/* 🔹 User Info Section */}
      <div className="p-6 border-b border-sidebar-text/20">
        <div className="mb-4">
          <p className="font-bold text-lg">
            {staffInfo
              ? `${staffInfo.Name} ${staffInfo.Sur_Name}`
              : user.username}
          </p>
          <p className="text-sm text-sidebar-text/80 capitalize">
            {staffInfo ? staffInfo.Role || user.role : user.role}
          </p>
          {staffInfo && (
            <p className="text-xs text-sidebar-text/60">
              {staffInfo.Phone_Number || "No phone provided"}
            </p>
          )}
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

      {/* 🔹 Navigation Menu */}
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
              {item.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* 🔹 Manager Export Button */}
      {user.role.toLowerCase() === 'manager' && (
        <div className="p-4 border-t border-sidebar-text/20">
          <Button
            onClick={exportCSV}
            className="w-full bg-sidebar-text text-sidebar-bg hover:bg-sidebar-text/90"
          >
            Export Sales CSV
          </Button>
        </div>
      )}
    </aside>
  );
};

export default TaskBar;
