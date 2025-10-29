// src/components/pages/OrdersManager.jsx
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { getOrders, updateOrderStatus } from '../../api/orderApi'; 

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [fixNote, setFixNote] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Load all orders
  //useEffect(() => {
  //  const fetchOrders = async () => {
  //    try {
  //      const data = await getOrders();
  //      setOrders(data);
  //    } catch (err) {
  //      console.error('Failed to fetch orders:', err);
  //      alert('ไม่สามารถโหลดรายการสั่งซื้อได้');
  //    }
  //  };
  //  fetchOrders();
  //}, []);

    useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch mock orders:', err);
        alert('ไม่สามารถโหลดรายการสั่งซื้อได้');
      }
    };
    fetchOrders();
  }, []);

  // ✅ Request fix (update note + status)
  const handleRequestFix = async () => {
    if (!fixNote.trim()) return alert('กรุณากรอก Note ว่าสิ่งที่ต้องการแก้ไข');
    if (!selectedOrder) return;

    setLoading(true);
    try {
      await updateOrderStatus(selectedOrder.id, 'Cancel', fixNote); // ✅ use backend API
      setOrders(prev =>
        prev.map(o =>
          o.id === selectedOrder.id ? { ...o, status: 'Cancel', note: fixNote } : o
        )
      );
      alert('ส่งคำสั่งแก้ไขเรียบร้อยแล้ว ระบบแจ้งเตือนไปยัง Staff');
      setSelectedOrder(null);
      setFixNote('');
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('ไม่สามารถอัปเดตสถานะได้');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Confirm order (only status)
  const handleConfirmOrder = async () => {
    if (!selectedOrder) return;

    setLoading(true);
    try {
      await updateOrderStatus(selectedOrder.id, 'Completed'); // ✅ status only
      setOrders(prev =>
        prev.map(o =>
          o.id === selectedOrder.id ? { ...o, status: 'Completed' } : o
        )
      );
      alert('Order ยืนยันเรียบร้อยแล้ว ระบบแจ้งเตือนไปยัง Staff');
      setSelectedOrder(null);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('ไม่สามารถอัปเดตสถานะได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-64 p-8 min-h-screen bg-background">
      <h1 className="text-3xl font-bold text-foreground mb-4">Orders Manager</h1>

      {/* ✅ Order list */}
      <div className="overflow-y-auto max-h-96 border rounded-lg p-2 mb-4">
        {orders.filter(o => o.status === 'CheckOrder').map(order => (
          <div
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            className={`p-3 mb-2 border rounded cursor-pointer ${
              selectedOrder?.id === order.id ? 'bg-blue-100 border-blue-400' : 'hover:bg-gray-100'
            }`}
          >
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Menu:</strong> {order.menu}</p>
            <p><strong>Quantity:</strong> {order.quantity}</p>
            <p><strong>Note:</strong> {order.note}</p>
          </div>
        ))}
      </div>

      {/* ✅ Action section */}
      {selectedOrder && (
        <div className="bg-card p-4 border rounded-lg">
          <h2 className="font-semibold mb-2">จัดการ Order #{selectedOrder.id}</h2>

          <div className="mb-4">
            <Input
              value={fixNote}
              onChange={(e) => setFixNote(e.target.value)}
              placeholder="ระบุสิ่งที่ต้องการให้ Staff แก้ไข"
              className="mb-2 w-full"
            />
            <Button onClick={handleRequestFix} disabled={loading} className="mr-2">
              {loading ? 'กำลังอัปเดต...' : 'Request Fix'}
            </Button>
          </div>

          <div>
            <Button
              onClick={handleConfirmOrder}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {loading ? 'กำลังอัปเดต...' : 'Confirm Order'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManager;
