import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { getMenus } from '../../api/menuApi';
import { submitOrders } from '../../api/orderApi';
import dayjs from 'dayjs';

const SendOrder = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [notes, setNotes] = useState({});
  const [quantities, setQuantities] = useState({});
  const [deadline, setDeadline] = useState(''); // Deadline เดียวต่อ order

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

  const handleAddToOrder = (menu) => {
    const note = notes[menu.MenuID] || 'ไม่มี';
    const quantity = parseInt(quantities[menu.MenuID]) || 1;

    if (quantity <= 0) return alert('กรุณาใส่จำนวนมากกว่า 0');

    const existingIndex = orders.findIndex((o) => o.MenuID === menu.MenuID);
    let newOrders = [...orders];

    if (existingIndex >= 0) {
      newOrders[existingIndex].Quantity += quantity;
      newOrders[existingIndex].Note = note;
    } else {
      newOrders.push({
        MenuID: menu.MenuID,
        name: menu.MenuName,
        Quantity: quantity,
        Note: note,
      });
    }

    setOrders(newOrders);
    setNotes({ ...notes, [menu.MenuID]: '' });
    setQuantities({ ...quantities, [menu.MenuID]: 1 });
  };

  const handleSubmitOrders = async () => {
    if (orders.length === 0) return alert('ไม่มีคำสั่งซื้อที่จะส่ง');
    if (!deadline) return alert('กรุณาเลือก Deadline');

    const minDeadline = dayjs().add(1, 'day').startOf('day');
    if (dayjs(deadline).isBefore(minDeadline))
      return alert('Deadline ต้องเป็นวันถัดไปหรือมากกว่า');

      try {
        // เรียก submitOrders แบบถูกต้อง
        await submitOrders({
          orders: orders.map((o) => ({
            MenuID: o.MenuID,
            Quantity: o.Quantity,
            Note: o.Note,
          })),
          Deadline: deadline, // ส่ง deadline ด้วย
        });

        alert('ส่งคำสั่งซื้อทั้งหมดเรียบร้อย!');
        setOrders([]);
        setDeadline('');
      } catch (err) {
        console.error(err);
        alert('เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ');
      }

  };

  if (loading) return <p>Loading menus...</p>;

  const minDate = dayjs().add(1, 'day').format('YYYY-MM-DD');

  return (
    <div className="flex ml-64 p-4 min-h-screen bg-background gap-4">
      {/* Sidebar เมนู */}
      <div className="w-80 max-h-screen overflow-y-auto border border-border rounded-md p-2 space-y-2 sticky top-4">
        <h2 className="font-bold text-lg mb-2">เมนู</h2>
        {menus.map((menu) => (
          <div key={menu.MenuID} className="border rounded-md p-2 flex flex-col gap-1">
            <h3 className="font-semibold">{menu.MenuName}</h3>
            <p className="text-sm text-muted-foreground">{menu.MenuDescription}</p>

            <textarea
              placeholder="ระบุรายละเอียดเพิ่มเติม เช่น ขนาด, รสชาติ"
              rows={2}
              className="w-full border border-border rounded-md p-1 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={notes[menu.MenuID] || ''}
              onChange={(e) => setNotes({ ...notes, [menu.MenuID]: e.target.value })}
            />

            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                min={1}
                value={quantities[menu.MenuID] || 1}
                onChange={(e) =>
                  setQuantities({ ...quantities, [menu.MenuID]: parseInt(e.target.value) })
                }
                className="w-20 border border-border rounded-md p-1 text-center"
              />
              <Button onClick={() => handleAddToOrder(menu)}>Add</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Main content: Cart + Deadline */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">คำสั่งซื้อปัจจุบัน</h1>

        {orders.length === 0 ? (
          <p>ยังไม่มีคำสั่งซื้อ</p>
        ) : (
          <div className="bg-card p-4 border rounded-lg space-y-2">
            {orders.map((o) => (
              <div key={o.MenuID} className="flex justify-between items-center border-b pb-1">
                <span>
                  {o.name} x {o.Quantity} - ({o.Note})
                </span>
                <button
                  onClick={() => setOrders(orders.filter(order => order.MenuID !== o.MenuID))}
                  className="text-red-500 font-bold px-2 rounded hover:bg-red-100"
                >
                  ×
                </button>
              </div>
            ))}

            {/* Deadline + Submit */}
            <div className="flex items-center gap-4 mt-4">
              <label className="font-semibold">Deadline:</label>
              <input
                type="date"
                min={minDate}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="border border-border rounded-md p-1"
              />
              <Button onClick={handleSubmitOrders}>
                Submit All Orders
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendOrder;
