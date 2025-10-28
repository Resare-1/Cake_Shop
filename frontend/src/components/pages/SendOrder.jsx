import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const SendOrder = () => {
  const [menus] = useState([
    { id: 1, name: 'Chocolate Cake', price: 250, description: 'Rich dark chocolate cake' },
    { id: 2, name: 'Vanilla Cake', price: 200, description: 'Classic vanilla cream cake' },
  ]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [note, setNote] = useState('');

  const handleConfirm = () => {
    if (!selectedMenu) return alert('กรุณาเลือกเมนูก่อน');
    if (!note.trim()) return alert('กรุณากรอก Note (หากไม่มีให้พิมพ์ว่า "ไม่มี")');

    console.log('Order created:', {
      order_id: Date.now(),
      menu_id: selectedMenu.id,
      subtotal: selectedMenu.price,
      note: note,
    });

    alert('ส่งคำสั่งซื้อเรียบร้อย! ระบบจะส่งแจ้งเตือนถึง Staff');
  };

  return (
    <div className="ml-64 p-8 min-h-screen bg-background">
      <h1 className="text-2xl font-bold mb-4">ส่งคำสั่งซื้อ</h1>

      <div className="grid gap-3 mb-4">
        {menus.map(menu => (
          <button
            key={menu.id}
            onClick={() => setSelectedMenu(menu)}
            className={`p-3 border rounded-md ${
              selectedMenu?.id === menu.id ? 'bg-blue-100 border-blue-400' : 'hover:bg-gray-100'
            }`}
          >
            {menu.name} - {menu.price}฿
          </button>
        ))}
      </div>

      {selectedMenu && (
        <div className="bg-card p-4 border rounded-lg mb-4">
          <h2 className="font-semibold">{selectedMenu.name}</h2>
          <p>{selectedMenu.description}</p>
        </div>
      )}

      <Input
        placeholder="ระบุรายละเอียดเพิ่มเติม เช่น ขนาด, รสชาติ, ข้อความบนหน้าเค้ก"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <Button onClick={handleConfirm} className="mt-4">
        ยืนยันคำสั่งซื้อ
      </Button>
    </div>
  );
};

export default SendOrder;
