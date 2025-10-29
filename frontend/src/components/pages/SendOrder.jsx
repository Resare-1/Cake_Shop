import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { createOrder } from '../../lib/createOrderUtils';
import { getMenus } from '../../api/menuApi';
import { submitOrders } from '../../api/submitOrderApi';

const SendOrder = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [notes, setNotes] = useState({}); // key: menu.id, value: note

  // Fetch menus from API
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await getMenus();
        setMenus(data);
      } catch (err) {
        console.error(err);
        alert('ไม่สามารถโหลดเมนูได้');
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  // Add item to local cart
  const handleAddToOrder = (menu) => {
    const newOrder = createOrder(menu, notes);
    if (!newOrder) return alert('กรุณากรอก Note (หากไม่มีให้พิมพ์ว่า "ไม่มี")');

    setOrders([...orders, newOrder]);
    setNotes({ ...notes, [menu.id]: '' });
    alert(`เพิ่ม ${menu.name} ลงคำสั่งซื้อเรียบร้อย!`);
  };

  // Submit all orders to backend
  const handleSubmitOrders = async () => {
    if (orders.length === 0) return alert('ไม่มีคำสั่งซื้อที่จะส่ง');

    try {
      await submitOrders(orders);
      alert('ส่งคำสั่งซื้อทั้งหมดเรียบร้อย!');
      setOrders([]); // clear after submit
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ');
    }
  };

  if (loading) return <p>Loading menus...</p>;

  return (
    <div className="ml-64 p-8 min-h-screen bg-background">
      <h1 className="text-2xl font-bold mb-4">ส่งคำสั่งซื้อ</h1>

      <div className="max-h-[500px] overflow-y-auto border border-border rounded-md p-2 space-y-4 mb-4">
        {menus.map((menu) => (
          <div key={menu.id} className="flex items-start gap-4 p-2 border rounded-md">
            <img
              src={menu.image}
              alt={menu.name}
              className="w-24 h-24 object-cover rounded-md border"
            />
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{menu.name}</h2>
              <p className="text-sm text-muted-foreground">{menu.description}</p>

              <textarea
                placeholder="ระบุรายละเอียดเพิ่มเติม เช่น ขนาด, รสชาติ, ข้อความบนหน้าเค้ก"
                rows={3}
                className="mt-2 w-full border border-border rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={notes[menu.id] || ''}
                onChange={(e) => setNotes({ ...notes, [menu.id]: e.target.value })}
              />
              <Button onClick={() => handleAddToOrder(menu)} className="mt-2">
                Add to Order
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ CURRENT ORDERS LIST */}
      {orders.length > 0 && (
        <div className="bg-card p-4 border rounded-lg mt-4">
          <h2 className="font-semibold mb-2">คำสั่งซื้อปัจจุบัน</h2>
          <ul className="space-y-1">
            {orders.map((o) => (
              <li key={o.order_id}>
                {o.name} - ({o.note})
              </li>
            ))}
          </ul>

          {/* ✅ Submit all orders button */}
          <Button onClick={handleSubmitOrders} className="mt-3">
            Submit All Orders
          </Button>
        </div>
      )}
    </div>
  );
};

export default SendOrder;
