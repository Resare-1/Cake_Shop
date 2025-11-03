import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { getMenus } from '../../api/menuApi';
import { submitOrders } from '../../api/orderApi';
import dayjs from 'dayjs';

const SendOrder = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [deadline, setDeadline] = useState('');
  const [itemNotes, setItemNotes] = useState({}); // notes per menu item

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await getMenus();
        setMenus(data.filter(menu => menu.Is_Available));
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
    const quantity = parseInt(quantities[menu.MenuID]) || 1;
    if (quantity <= 0) return alert('กรุณาใส่จำนวนมากกว่า 0');
    if (quantity > 10) return alert('ต่อเมนูสามารถสั่งได้ไม่เกิน 10 ชิ้น');

    const existingIndex = orders.findIndex((o) => o.MenuID === menu.MenuID);
    let newOrders = [...orders];

    if (existingIndex >= 0) {
      const newQty = newOrders[existingIndex].Quantity + quantity;
      if (newQty > 10) {
        return alert(`รวมแล้วต่อเมนู "${menu.MenuName}" สั่งได้ไม่เกิน 10 ชิ้น`);
      }
      newOrders[existingIndex].Quantity = newQty;
    } else {
      newOrders.push({
        MenuID: menu.MenuID,
        name: menu.MenuName,
        Quantity: quantity,
        Ingredients: menu.Ingredients || [],
      });
    }

    setOrders(newOrders);
    setQuantities({ ...quantities, [menu.MenuID]: 1 });
    setItemNotes({ ...itemNotes, [menu.MenuID]: itemNotes[menu.MenuID] || '' });
  };

  const handleSubmitOrders = async () => {
    if (orders.length === 0) return alert('ไม่มีคำสั่งซื้อที่จะส่ง');
    if (!deadline) return alert('กรุณาเลือก Deadline');

    const minDeadline = dayjs().add(1, 'day').startOf('day');
    const maxDeadline = dayjs().add(2, 'month').endOf('day');

    // ✅ ตรวจสอบว่าอยู่ในช่วงที่อนุญาต
    if (dayjs(deadline).isBefore(minDeadline))
      return alert('Deadline ต้องเป็นวันถัดไปหรือมากกว่า');
    if (dayjs(deadline).isAfter(maxDeadline))
      return alert('Deadline ต้องไม่เกิน 2 เดือนจากวันนี้');

    // Only send the note text, not the menu name
    const combinedNotes = orders
      .map(o => itemNotes[o.MenuID] || 'ไม่มี')
      .join(',');

    try {
      const result = await submitOrders({
        orders: orders.map((o) => ({
          MenuID: o.MenuID,
          Quantity: o.Quantity,
        })),
        Deadline: deadline,
        Note: combinedNotes, // ✅ note text only
      });

      if (result.warnings && result.warnings.length > 0) {
        alert("คำเตือนเกี่ยวกับวัตถุดิบ:\n" + result.warnings.join("\n"));
      }

      alert('ส่งคำสั่งซื้อทั้งหมดเรียบร้อย!');
      setOrders([]);
      setDeadline('');
      setItemNotes({});
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ');
    }
  };

  if (loading) return <p>Loading menus...</p>;

  // ✅ จำกัดวันให้เลือกได้ระหว่างพรุ่งนี้ถึงภายใน 2 เดือน
  const minDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
  const maxDate = dayjs().add(2, 'month').format('YYYY-MM-DD');

  return (
    <div className="flex ml-64 p-4 min-h-screen bg-background gap-4">
      {/* Sidebar เมนู */}
      <div className="w-80 max-h-screen overflow-y-auto border border-border rounded-md p-2 space-y-2 sticky top-4">
        <h2 className="font-bold text-lg mb-2">เมนู</h2>
        {menus.map((menu) => (
          <div key={menu.MenuID} className="border rounded-md p-2 flex flex-col gap-1">
            <h3 className="font-semibold">{menu.MenuName}</h3>
            <p className="text-sm text-muted-foreground">{menu.MenuDescription}</p>

            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                min={1}
                max={10} // ✅ จำกัดให้ไม่เกิน 10 ในช่องกรอก
                value={quantities[menu.MenuID] || 1}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value > 10) {
                    alert('ต่อเมนูสามารถสั่งได้ไม่เกิน 10 ชิ้น');
                    return;
                  }
                  setQuantities({ ...quantities, [menu.MenuID]: value });
                }}
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
              <div key={o.MenuID} className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <span>
                    {o.name} x {o.Quantity}
                  </span>
                  <button
                    onClick={() => {
                      setOrders(orders.filter(order => order.MenuID !== o.MenuID));
                      const newNotes = { ...itemNotes };
                      delete newNotes[o.MenuID];
                      setItemNotes(newNotes);
                    }}
                    className="text-red-500 font-bold px-2 rounded hover:bg-red-100"
                  >
                    ×
                  </button>
                </div>

                {/* Individual Note Field */}
                <textarea
                  value={itemNotes[o.MenuID] || ''}
                  onChange={(e) => {
                    const sanitized = e.target.value.replace(/,/g, '');
                    setItemNotes({ ...itemNotes, [o.MenuID]: sanitized });
                  }}
                  placeholder={`หมายเหตุสำหรับ ${o.name} (ถ้ามี)`}
                  rows={1}
                  className="w-full border border-border rounded-md p-1 mt-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {o.Ingredients && o.Ingredients.length > 0 && (
                  <ul className="text-sm text-muted-foreground ml-4 mt-1">
                    {o.Ingredients.map(ing => (
                      <li key={ing.IngredientID}>
                        {ing.IngredientName} ({ing.qty_required} {ing.Unit})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Deadline + Submit */}
            <div className="flex items-center gap-4 mt-4">
              <label className="font-semibold">Deadline:</label>
              <input
                type="date"
                min={minDate}
                max={maxDate}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="border border-border rounded-md p-1"
              />
              <Button onClick={handleSubmitOrders}>
                Submit All Orders
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              * สามารถเลือกวันได้ภายใน 2 เดือนนับจากวันนี้
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendOrder;
