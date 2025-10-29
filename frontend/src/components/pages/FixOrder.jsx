import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { getOrders, updateOrderStatus } from '../../api/orderApi';

const FixOrder = () => {
  const token = localStorage.getItem('token');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ดึง orders status = 'Cancel'
  const fetchOrders = async () => {
    try {
      const data = await getOrders(token);
      setOrders(data.filter((o) => o.Order_Status === 'Cancel'));
    } catch (err) {
      console.error(err);
      alert('Failed to fetch orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // เริ่มแก้ไข order
  const handleStartFix = async () => {
    if (!selectedOrder) return alert('กรุณาเลือก Order ก่อน');
    if (!selectedOrder.Note || selectedOrder.Note.trim() === '') {
      return alert('กรุณากรอก Note สำหรับ Order');
    }

    try {
      // เรียก backend ใช้ updateOrderStatus ส่ง status เป็น 'Processing' พร้อม note
      await updateOrderStatus(selectedOrder.Order_id, 'Processing', token, selectedOrder.Note);
      alert(`Order #${selectedOrder.Order_id} เริ่มแก้ไขเค้กเรียบร้อยแล้ว`);
      setSelectedOrder(null);
      fetchOrders(); // รีเฟรช list
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="ml-64 p-8 min-h-screen bg-background">
      <h1 className="text-3xl font-bold mb-4">Fix Cancelled Orders</h1>

      <div className="bg-card p-4 rounded-lg shadow-sm border border-border mb-4 max-h-60 overflow-y-auto">
        <h2 className="font-semibold mb-2">Cancelled Orders</h2>
        {orders.map((order) => (
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
        {orders.length === 0 && <p>ไม่มี Order ที่ถูกยกเลิก</p>}
      </div>

      {selectedOrder && (
        <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
          <h2 className="font-semibold mb-2">Order #{selectedOrder.Order_id} Details</h2>
          <Input
            value={selectedOrder.Note}
            onChange={(e) =>
              setSelectedOrder({ ...selectedOrder, Note: e.target.value })
            }
            placeholder="กรุณากรอก Note สำหรับแก้ไข"
            className="mb-2"
          />
          {selectedOrder.items.map((item, idx) => (
            <div key={idx} className="mb-4 p-2 border-b border-border">
              <p>
                <strong>Menu:</strong> {item.MenuName} | <strong>Quantity:</strong> {item.Quantity} | <strong>Subtotal:</strong> {item.Subtotal}
              </p>
              <Input
                placeholder="Note (ถ้าไม่มีใส่ 'ไม่มี')"
                value={item.Note || 'ไม่มี'}
                onChange={(e) => {
                  const newItems = [...selectedOrder.items];
                  newItems[idx].Note = e.target.value;
                  setSelectedOrder({ ...selectedOrder, items: newItems });
                }}
                className="mt-1"
              />
            </div>
          ))}
          <Button onClick={handleStartFix} className="mt-4">
            เริ่มแก้ไขเค้ก
          </Button>
        </div>
      )}
    </div>
  );
};

export default FixOrder;
