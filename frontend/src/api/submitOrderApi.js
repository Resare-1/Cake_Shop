export const submitOrders = async (orders) => {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orders }),
    });

    if (!res.ok) throw new Error('Failed to submit orders');
    return await res.json();
  } catch (err) {
    console.error('Error submitting orders:', err);
    throw err;
  }
};

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

export const updateOrderStatus = async (orderId, status) => {
  try {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error('Failed to update order status');
    return await res.json();
  } catch (err) {
    console.error('Error updating order status:', err);
    throw err;
  }
};
