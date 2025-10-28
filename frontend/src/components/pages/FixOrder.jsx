// src/components/pages/FixOrder.jsx
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const FixOrder = () => {
  // Mock cancelled orders with items
  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: 'John Doe',
      status: 'Cancel',
      cancelReason: 'ข้อความบนเค้กผิด',
      items: [
        {
          menuId: 1,
          menuName: 'Chocolate Cake',
          quantity: 1,
          note: 'ช็อกโกแลตเข้มข้น',
          ingredients: [
            { name: 'Flour', qty_required: 200, unit: 'g' },
            { name: 'Chocolate', qty_required: 100, unit: 'g' },
            { name: 'Sugar', qty_required: 50, unit: 'g' },
          ],
        },
      ],
    },
    {
      id: 2,
      customer: 'Jane Smith',
      status: 'Cancel',
      cancelReason: 'รสชาติไม่ถูกต้อง',
      items: [
        {
          menuId: 2,
          menuName: 'Vanilla Cake',
          quantity: 2,
          note: 'ไม่มี',
          ingredients: [
            { name: 'Flour', qty_required: 200, unit: 'g' },
            { name: 'Vanilla', qty_required: 50, unit: 'g' },
            { name: 'Sugar', qty_required: 50, unit: 'g' },
          ],
        },
      ],
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleStartFix = () => {
    if (!selectedOrder) return alert('กรุณาเลือก Order ก่อน');

    // Validate that cancelReason and notes exist
    if (!selectedOrder.cancelReason.trim()) {
      return alert('กรุณากรอกเหตุผลการแก้ไข');
    }
    const hasEmptyNote = selectedOrder.items.some(
      (item) => !item.note || item.note.trim() === ''
    );
    if (hasEmptyNote)
      return alert('กรุณากรอก Note สำหรับทุกเมนู (ถ้าไม่มีให้ใส่ "ไม่มี")');

    // Mock updating status
    const updatedOrders = orders.map((order) =>
      order.id === selectedOrder.id ? { ...order, status: 'Processing' } : order
    );
    setOrders(updatedOrders);

    alert(`Order #${selectedOrder.id} เริ่มแก้ไขเค้กเรียบร้อยแล้ว`);
    setSelectedOrder(null);
  };

  return (
    <div className="ml-64 p-8 min-h-screen bg-background">
      <h1 className="text-3xl font-bold mb-4">Fix Cancelled Orders</h1>

      {/* Cancelled Orders List */}
      <div className="bg-card p-4 rounded-lg shadow-sm border border-border mb-4 max-h-60 overflow-y-auto">
        <h2 className="font-semibold mb-2">Cancelled Orders</h2>
        {orders
          .filter((o) => o.status === 'Cancel')
          .map((order) => (
            <button
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className={`w-full text-left p-3 rounded-md mb-1 border ${
                selectedOrder?.id === order.id
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              Order #{order.id} - {order.customer}
            </button>
          ))}
        {orders.filter((o) => o.status === 'Cancel').length === 0 && (
          <p>ไม่มี Order ที่ถูกยกเลิก</p>
        )}
      </div>

      {/* Selected Order Details */}
      {selectedOrder && (
        <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
          <h2 className="font-semibold mb-2">Order #{selectedOrder.id} Details</h2>
          <p className="mb-2">
            <strong>Cancel Reason:</strong>{' '}
            <Input
              value={selectedOrder.cancelReason}
              onChange={(e) =>
                setSelectedOrder({ ...selectedOrder, cancelReason: e.target.value })
              }
              placeholder="กรุณากรอกเหตุผลการแก้ไข"
              className="mt-1 mb-2"
            />
          </p>

          {selectedOrder.items.map((item, idx) => (
            <div key={idx} className="mb-4 p-2 border-b border-border">
              <p>
                <strong>Menu:</strong> {item.menuName} | <strong>Quantity:</strong>{' '}
                {item.quantity}
              </p>
              <p className="mb-2">
                <strong>Ingredients:</strong>{' '}
                {item.ingredients
                  .map((ing) => `${ing.name} (${ing.qty_required}${ing.unit})`)
                  .join(', ')}
              </p>
              <Input
                placeholder="Note (ถ้าไม่มีให้ใส่ 'ไม่มี')"
                value={item.note}
                onChange={(e) => {
                  const newItems = [...selectedOrder.items];
                  newItems[idx].note = e.target.value;
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
