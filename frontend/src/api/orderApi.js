const API_URL = "http://localhost:3006/api/orders";

/**
 * Submit a new order
 * @param {Object} orderData - { StaffID, Note, items: [{ MenuID, Quantity, Subtotal }] }
 * @param {string} token - JWT token
 */
export const submitOrder = async (orderData, token) => {
  if (!token) throw new Error("Missing authentication token");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        StaffID: orderData.StaffID || null, // backend เติมให้ถ้า null
        Order_Status: "Pending",
        Order_date: new Date().toISOString(),
        Note: orderData.Note || "",
        items: orderData.items || [], // [{ MenuID, Quantity, Subtotal }]
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to submit order");
    }

    return await res.json();
  } catch (err) {
    console.error("Error submitting order:", err);
    throw err;
  }
};

/**
 * Get all orders
 * @param {string} token - JWT token
 */
export const getOrders = async (token) => {
  if (!token) throw new Error("Missing authentication token");

  try {
    const res = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to fetch orders");
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching orders:", err);
    throw err;
  }
};

/**
 * Update order status
 * @param {number} orderId
 * @param {string} newStatus - Pending / Processing / Complete
 * @param {string} token - JWT token
 */
export const updateOrderStatus = async (orderId, newStatus, token) => {
  if (!token) throw new Error("Missing authentication token");

  try {
    const res = await fetch(`${API_URL}/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ Order_Status: newStatus }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to update order status");
    }

    return await res.json();
  } catch (err) {
    console.error("Error updating order status:", err);
    throw err;
  }
};
export const fixOrder = async (orderId, note, token) => {
  const res = await fetch(`http://localhost:3006/api/orders/${orderId}/fix`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ note }),
  });
  if (!res.ok) throw new Error("Failed to fix order");
  return res.json();
};

export const confirmOrder = async (orderId, token) => {
  const res = await fetch(`http://localhost:3006/api/orders/${orderId}/confirm`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to confirm order");
  return res.json();
};
