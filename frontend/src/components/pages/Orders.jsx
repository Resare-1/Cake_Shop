import { useState, useEffect } from 'react';
import { getOrders } from '../../api/orderApi';
import { Dropdown } from '../../components/ui/dropdown'; // optional for sorting

const Orders = ({ userRole }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState(''); // '' | 'quantity' | 'subtotal'

  const isManager = userRole?.toLowerCase() === 'manager';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Optional: flatten and sort orders if manager wants to sort by quantity or subtotal
  const sortedOrders = [...orders].sort((a, b) => {
    if (!isManager || !sortBy) return 0;

    const sumA = a.items.reduce((sum, i) => sum + (sortBy === 'quantity' ? i.quantity : i.subtotal || 0), 0);
    const sumB = b.items.reduce((sum, i) => sum + (sortBy === 'quantity' ? i.quantity : i.subtotal || 0), 0);

    return sumB - sumA;
  });

  if (loading) return <div className="ml-64 p-8">Loading orders...</div>;

  return (
    <div className="ml-64 p-8 min-h-screen bg-background">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold text-foreground mb-4">Orders</h1>

        {isManager && (
          <div className="mb-4">
            <Dropdown
              label="Sort by:"
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: '', label: 'None' },
                { value: 'quantity', label: 'Highest Quantity' },
                { value: 'subtotal', label: 'Highest Money' },
              ]}
            />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-border rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b border-border">Order ID</th>
                <th className="p-3 border-b border-border">Customer</th>
                <th className="p-3 border-b border-border">Menu</th>
                <th className="p-3 border-b border-border">Quantity</th>
                <th className="p-3 border-b border-border">Note</th>
                {isManager && <th className="p-3 border-b border-border">Subtotal</th>}
                <th className="p-3 border-b border-border">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.length === 0 ? (
                <tr>
                  <td className="p-3" colSpan={isManager ? 7 : 6}>
                    No orders available.
                  </td>
                </tr>
              ) : (
                sortedOrders.map((order) =>
                  order.items.map((item, index) => (
                    <tr key={`${order.id}-${item.menuId}`} className="hover:bg-gray-50">
                      {index === 0 && (
                        <>
                          <td className="p-3 border-b border-border" rowSpan={order.items.length}>
                            {order.id}
                          </td>
                          <td className="p-3 border-b border-border" rowSpan={order.items.length}>
                            {order.customer}
                          </td>
                        </>
                      )}

                      <td className="p-3 border-b border-border">{item.menuName}</td>
                      <td className="p-3 border-b border-border">{item.quantity}</td>
                      <td className="p-3 border-b border-border">{item.note || '-'}</td>

                      {index === 0 && isManager && (
                        <td className="p-3 border-b border-border" rowSpan={order.items.length}>
                          {order.items.reduce((sum, i) => sum + (i.subtotal || 0), 0)}฿
                        </td>
                      )}

                      {index === 0 && (
                        <td className="p-3 border-b border-border" rowSpan={order.items.length}>
                          {order.status}
                        </td>
                      )}
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
