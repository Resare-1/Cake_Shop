import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { getOrders, updateOrderStatus } from '../../api/orderApi';

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [fixNote, setFixNote] = useState('');
  const token = localStorage.getItem('token');

  // ดึง order จาก backend
  const fetchOrders = async () => {
    try {
      const data = await getOrders(token);
      setOrders(data);
    } catch (err) {
      console.error(err);
      alert('ไม่สามารถโหลด Orders ได้');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Request fix (เปลี่ยน status เป็น Cancel + note)
  const handleRequestFix = async () => {
    if (!fixNote.trim()) return alert('กรุณากรอก Note ว่าสิ่งที่ต้องการแก้ไข');
    try {
      await updateOrderStatus(selectedOrder.Order_id, 'Cancel', token, fixNote);
      alert('ส่งคำสั่งแก้ไขเรียบร้อยแล้ว ระบบแจ้งเตือนไปยัง Staff');
      setSelectedOrder(null);
      setFixNote('');
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการส่งคำสั่งแก้ไข');
    }
  };

  // Confirm order (เปลี่ยน status เป็น Complete)
  const handleConfirmOrder = async () => {
    try {
      await updateOrderStatus(selectedOrder.Order_id, 'Complete', token);
      alert('Order ยืนยันเรียบร้อยแล้ว ระบบแจ้งเตือนไปยัง Staff');
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการยืนยัน Order');
    }
  };

  return (
    <div className="ml-64 p-8 min-h-screen bg-background">
      <h1 className="text-3xl font-bold text-foreground mb-4">Orders Manager</h1>

      {/* List of Orders */}
      <div className="overflow-y-auto max-h-96 border rounded-lg p-2 mb-4">
        {orders
          .filter((o) => o.Order_Status === 'CheckOrder') // แสดงเฉพาะ Pending/Processing
          .map((order) => (
            <div
              key={order.Order_id}
              onClick={() => setSelectedOrder(order)}
              className={`p-3 mb-2 border rounded cursor-pointer ${
                selectedOrder?.Order_id === order.Order_id
                  ? 'bg-blue-100 border-blue-400'
                  : 'hover:bg-gray-100'
              }`}
            >
              <p><strong>Order ID:</strong> {order.Order_id}</p>
              <p><strong>Staff ID:</strong> {order.StaffID}</p>
              <p><strong>Status:</strong> {order.Order_Status}</p>
              <p><strong>Date:</strong> {new Date(order.Order_date).toLocaleString()}</p>
              <p><strong>Items:</strong></p>
              <ul className="ml-4">
                {order.items.map((item) => (
                  <li key={item.MenuID}>
                    {item.MenuName} x {item.Quantity} = {item.Subtotal} ฿
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>

      {/* Selected Order Actions */}
      {selectedOrder && (
        <div className="bg-card p-4 border rounded-lg">
          <h2 className="font-semibold mb-2">จัดการ Order #{selectedOrder.Order_id}</h2>

          {/* Request Fix */}
          <div className="mb-4">
            <Input
              value={fixNote}
              onChange={(e) => setFixNote(e.target.value)}
              placeholder="ระบุสิ่งที่ต้องการให้ Staff แก้ไข"
              className="mb-2 w-full"
            />
            <Button onClick={handleRequestFix} className="mr-2">
              Request Fix
            </Button>
          </div>

          {/* Confirm Order */}
          <div>
            <Button onClick={handleConfirmOrder} className="bg-green-500 hover:bg-green-600 text-white">
              Confirm Order
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManager;
