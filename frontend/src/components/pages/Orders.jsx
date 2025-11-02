import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../../api/orderApi";

const Orders = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");
  const isManager = user?.role?.toLowerCase() === "manager";

  // fetch orders จาก backend
  const fetchOrders = async () => {
    try {
      const data = await getOrders(token);
      setOrders(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // เปลี่ยน status ของ order (เฉพาะ manager)
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus, token);
      fetchOrders(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

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
                <th className="p-3 border-b border-border">Menus</th>
                <th className="p-3 border-b border-border">Quantity</th>
                {isManager && <th className="p-3 border-b border-border">Subtotal</th>}
                <th className="p-3 border-b border-border">Status</th>
                <th className="p-3 border-b border-border">Note</th> {/* added */}
                {isManager && <th className="p-3 border-b border-border">Action</th>}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td className="p-3" colSpan={isManager ? 7 : 6}>
                    No orders available.
                  </td>
                </tr>
              )}
              {orders.map((order) => (
                <tr key={order.Order_id} className="hover:bg-gray-50">
                  <td className="p-3 border-b border-border">{order.Order_id}</td>

                  <td className="p-3 border-b border-border">
                    {order.items.map(item => (
                      <div key={item.MenuID}>
                        {item.MenuName} x{item.Quantity}
                      </div>
                    ))}
                  </td>

                  <td className="p-3 border-b border-border">
                    {order.items.reduce((sum, i) => sum + i.Quantity, 0)}
                  </td>

                  {isManager && (
                    <td className="p-3 border-b border-border">
                      {order.items.reduce((sum, i) => sum + i.Subtotal, 0)}฿
                    </td>
                  )}

                  <td className="p-3 border-b border-border">{order.Order_Status}</td>

                  <td className="p-3 border-b border-border">{order.Note || 'ไม่มี'}</td> {/* added */}

                  {isManager && (
                    <td className="p-3 border-b border-border space-x-2">
                      {order.Order_Status === "Pending" && (
                        <button
                          className="px-2 py-1 bg-blue-500 text-white rounded"
                          onClick={() => handleStatusChange(order.Order_id, "Processing")}
                        >
                          Processing
                        </button>
                      )}
                      {order.Order_Status === "Processing" && (
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded"
                          onClick={() => handleStatusChange(order.Order_id, "Complete")}
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
