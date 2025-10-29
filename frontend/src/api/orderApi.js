// src/api/submitOrderApi.js

// ✅ Create a new order (with items)
export const submitOrder = async (orderData) => {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        StaffID: orderData.StaffID || null, // optional, backend may fill from session
        Order_Status: 'Pending',
        Order_date: new Date().toISOString(),
        Note: orderData.Note || '',
        items: orderData.items || [] // [{ MenuID, Quantity, Subtotal }]
      }),
    });

    if (!res.ok) throw new Error('Failed to submit order');
    return await res.json();
  } catch (err) {
    console.error('Error submitting order:', err);
    throw err;
  }
};

// ✅ Fetch all existing orders
export const getOrders = async () => {
  try {
    const res = await fetch('/api/orders');
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
  } catch (err) {
    console.error('Error fetching orders:', err);
    throw err;
  }
};

// ✅ Update status for an order (e.g., Processing / Complete / Cancel)
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Order_Status: newStatus }),
    });

    if (!res.ok) throw new Error('Failed to update order status');
    return await res.json();
  } catch (err) {
    console.error('Error updating order status:', err);
    throw err;
  }
};
