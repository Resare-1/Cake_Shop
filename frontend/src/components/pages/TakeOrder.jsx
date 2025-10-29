import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { getOrders } from '../../api/orderApi';

const TakeOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const token = localStorage.getItem('token');

  // ดึง orders จาก backend
  const fetchOrders = async () => {
    try {
      const data = await getOrders(token);
      setOrders(data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStartProduction = async () => {
    if (!selectedOrder) return alert('กรุณาเลือก Order ก่อน');

    const hasEmptyNote = selectedOrder.items.some(
      (item) => !item.note || item.note.trim() === ''
    );
    if (hasEmptyNote)
      return alert('กรุณาเพิ่ม Note สำหรับทุกเมนู (ถ้าไม่มีให้ใส่ "ไม่มี")');

    try {
      await fetch(`http://localhost:3006/api/orders/${selectedOrder.Order_id}/start`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      alert(`Order #${selectedOrder.Order_id} เริ่มทำเค้กเรียบร้อยแล้ว`);
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="ml-64 p-8 min-h-screen bg-background">
      <h1 className="text-3xl font-bold text-foreground mb-4">Take Order</h1>

      {/* Orders List */}
      <div className="bg-card p-4 rounded-lg shadow-sm border border-border mb-4 max-h-60 overflow-y-auto">
        <h2 className="font-semibold mb-2">Pending Orders</h2>
        {orders
          .filter((o) => o.Order_Status === 'Pending')
          .map((order) => (
            <button
              key={order.Order_id}
              onClick={() => setSelectedOrder(order)}
              className={`w-full text-left p-3 rounded-md mb-1 border ${
                selectedOrder?.Order_id === order.Order_id
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              Order #{order.Order_id} - Staff: {order.StaffID}
            </button>
          ))}
        {orders.filter((o) => o.Order_Status === 'Pending').length === 0 && (
          <p>ไม่มี Order รอการทำ</p>
        )}
      </div>

      {/* Selected Order Details */}
      {selectedOrder && (
        <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
          <h2 className="font-semibold mb-2">Order #{selectedOrder.Order_id} Details</h2>
          {selectedOrder.items.map((item, idx) => (
            <div key={idx} className="mb-4 p-2 border-b border-border">
              <p>
                <strong>Menu:</strong> {item.MenuName} | <strong>Quantity:</strong>{' '}
                {item.Quantity} | <strong>Subtotal:</strong> {item.Subtotal}
              </p>
              <Input
                placeholder="Note (ถ้าไม่มีให้ใส่ 'ไม่มี')"
                value={item.note || ''}
                onChange={(e) => {
                  const newItems = [...selectedOrder.items];
                  newItems[idx].note = e.target.value;
                  setSelectedOrder({ ...selectedOrder, items: newItems });
                }}
                className="mt-1"
              />
            </div>
          ))}
          <Button onClick={handleStartProduction} className="mt-4">
            เริ่มทำเค้ก
          </Button>
        </div>
      )}
    </div>
  );
};

export default TakeOrder;
