// src/components/pages/OrdersManager.jsx
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const mockOrders = [
  { id: 1, menu: 'Chocolate Cake', quantity: 1, status: 'CheckOrder', note: 'Extra cream requested' },
  { id: 2, menu: 'Vanilla Cake', quantity: 2, status: 'CheckOrder', note: 'No nuts' },
  { id: 3, menu: 'Strawberry Cake', quantity: 1, status: 'CheckOrder', note: 'Add strawberries on top' },
];

const OrdersManager = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [fixNote, setFixNote] = useState('');

  const handleRequestFix = () => {
    if (!fixNote.trim()) return alert('กรุณากรอก Note ว่าสิ่งที่ต้องการแก้ไข');
    // Update status to Cancel / Send for fix (mock)
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id
          ? { ...o, status: 'Cancel', note: fixNote }
          : o
      )
    );
    alert('ส่งคำสั่งแก้ไขเรียบร้อยแล้ว ระบบแจ้งเตือนไปยัง Staff');
    setSelectedOrder(null);
    setFixNote('');
  };

  const handleConfirmOrder = () => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id
          ? { ...o, status: 'Completed' }
          : o
      )
    );
    alert('Order ยืนยันเรียบร้อยแล้ว ระบบแจ้งเตือนไปยัง Staff');
    setSelectedOrder(null);
  };

  return (
    <div className="ml-64 p-8 min-h-screen bg-background">
      <h1 className="text-3xl font-bold text-foreground mb-4">Orders Manager</h1>

      {/* List of Orders */}
      <div className="overflow-y-auto max-h-96 border rounded-lg p-2 mb-4">
        {orders
          .filter((o) => o.status === 'CheckOrder')
          .map((order) => (
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

      {/* Selected Order Actions */}
      {selectedOrder && (
        <div className="bg-card p-4 border rounded-lg">
          <h2 className="font-semibold mb-2">จัดการ Order #{selectedOrder.id}</h2>

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
