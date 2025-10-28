import { useState } from 'react';

const Orders = ({ userRole }) => {
  // Mock data
  const [orders] = useState([
    { id: 1, menu: 'Chocolate Cake', status: 'Pending', quantity: 1, subtotal: 250 },
    { id: 2, menu: 'Vanilla Cake', status: 'Confirmed', quantity: 2, subtotal: 400 },
    { id: 3, menu: 'Strawberry Cake', status: 'Preparing', quantity: 1, subtotal: 300 },
  ]);

  const isManager = userRole?.toLowerCase() === 'manager';

  return (
    <div className="ml-64 p-8 min-h-screen bg-background">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Orders
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-border rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b border-border">Order ID</th>
                <th className="p-3 border-b border-border">Menu</th>
                <th className="p-3 border-b border-border">Quantity</th>
                {isManager && <th className="p-3 border-b border-border">Subtotal</th>}
                <th className="p-3 border-b border-border">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b border-border">{order.id}</td>
                  <td className="p-3 border-b border-border">{order.menu}</td>
                  <td className="p-3 border-b border-border">{order.quantity}</td>
                  {isManager && <td className="p-3 border-b border-border">{order.subtotal}฿</td>}
                  <td className="p-3 border-b border-border">{order.status}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td className="p-3" colSpan={isManager ? 5 : 4}>
                    No orders available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
