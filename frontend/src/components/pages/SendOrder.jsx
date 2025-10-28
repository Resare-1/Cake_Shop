import { useState } from 'react';
import { Button } from '../ui/button';

const SendOrder = () => {
  const [menus] = useState([
    { id: 1, name: 'Chocolate Cake', price: 250, description: 'Rich dark chocolate cake', image: 'https://via.placeholder.com/80' },
    { id: 2, name: 'Vanilla Cake', price: 200, description: 'Classic vanilla cream cake', image: 'https://via.placeholder.com/80' },
    { id: 3, name: 'Strawberry Cake', price: 300, description: 'Fresh strawberry cake', image: 'https://via.placeholder.com/80' },
    { id: 4, name: 'Lemon Cake', price: 220, description: 'Tangy lemon cake', image: 'https://via.placeholder.com/80' },
    { id: 5, name: 'Red Velvet', price: 280, description: 'Velvety red cake', image: 'https://via.placeholder.com/80' },
  ]);

  const [orders, setOrders] = useState([]);
  const [notes, setNotes] = useState({}); // key: menu.id, value: note

  const handleAddToOrder = (menu) => {
    const note = notes[menu.id]?.trim();
    if (!note) return alert('กรุณากรอก Note (หากไม่มีให้พิมพ์ว่า "ไม่มี")');

    const newOrder = {
      order_id: Date.now(),
      menu_id: menu.id,
      name: menu.name,
      subtotal: menu.price,
      note,
    };

    setOrders([...orders, newOrder]);
    alert(`เพิ่ม ${menu.name} ลงคำสั่งซื้อเรียบร้อย!`);

    // Reset this menu's note
    setNotes({ ...notes, [menu.id]: '' });
  };

  return (
    <div className="ml-64 p-8 min-h-screen bg-background">
      <h1 className="text-2xl font-bold mb-4">ส่งคำสั่งซื้อ</h1>

      <div className="max-h-[500px] overflow-y-auto border border-border rounded-md p-2 space-y-4 mb-4">
        {menus.map((menu) => (
          <div
            key={menu.id}
            className="flex items-start gap-4 p-2 border rounded-md"
          >
            <img
              src={menu.image}
              alt={menu.name}
              className="w-24 h-24 object-cover rounded-md border"
            />
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{menu.name}</h2>
              <p className="text-sm text-muted-foreground">{menu.description}</p>
              <p className="font-medium mt-1">{menu.price}฿</p>

              {/* Independent note field */}
              <textarea
                placeholder="ระบุรายละเอียดเพิ่มเติม เช่น ขนาด, รสชาติ, ข้อความบนหน้าเค้ก"
                rows={3}
                className="mt-2 w-full border border-border rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={notes[menu.id] || ''}
                onChange={(e) =>
                  setNotes({ ...notes, [menu.id]: e.target.value })
                }
              />
              <Button onClick={() => handleAddToOrder(menu)} className="mt-2">
                Add to Order
              </Button>
            </div>
          </div>
        ))}
      </div>

      {orders.length > 0 && (
        <div className="bg-card p-4 border rounded-lg mt-4">
          <h2 className="font-semibold mb-2">คำสั่งซื้อปัจจุบัน</h2>
          <ul className="space-y-1">
            {orders.map((o) => (
              <li key={o.order_id}>
                {o.name} - {o.subtotal}฿ ({o.note})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SendOrder;
