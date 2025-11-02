import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { getOrders, updateOrderStatus } from '../../api/orderApi';

const CompleteOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  const fetchOrders = async () => {
    try {
      const data = await getOrders(token);
      // filter เฉพาะ Processing
      setOrders(data.filter((o) => o.Order_Status === 'Processing'));
    } catch (err) {
      console.error(err);
      alert('ไม่สามารถโหลด Orders ได้');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleComplete = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'CheckOrder', token);
      alert(`Order #${orderId} ถูกยืนยันเรียบร้อยแล้ว`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการยืนยัน Order');
    }
  };

  return (
    <div className="ml-64 p-8 min-h-screen bg-background">
      <h1 className="text-3xl font-bold mb-4">Complete Orders</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.length === 0 && <p>ไม่มี Order ที่อยู่ในสถานะ Processing</p>}
        {orders.map((order) => (
          <div key={order.Order_id} className="bg-card p-4 border rounded-lg shadow-sm">
            <p><strong>Order ID:</strong> {order.Order_id}</p>
            <p><strong>Staff ID:</strong> {order.StaffID}</p>
            <p><strong>Date:</strong> {new Date(order.Order_date).toLocaleString()}</p>
            <p><strong>Items:</strong></p>
            <ul className="ml-4">
              {order.items.map((item) => (
                <li key={item.MenuID}>
                  {item.MenuName} x {item.Quantity} = {item.Subtotal} ฿
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleComplete(order.Order_id)}
              className="mt-2 bg-green-500 hover:bg-green-600 text-white"
            >
              Complete Order
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompleteOrders;
