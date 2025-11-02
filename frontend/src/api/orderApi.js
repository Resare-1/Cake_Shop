const API_URL = "http://localhost:3006/api/orders";

/**
 * Get all orders
 * @param {string} token
 */
export const getOrders = async (token) => {
  if (!token) throw new Error("Missing authentication token");

  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

/**
 * Update order status (generic)
 * @param {number} orderId
 * @param {string} Order_Status - Pending / Processing / Complete / Cancel
 * @param {string} token
 * @param {string} [Note] - optional
 */
export const updateOrderStatus = async (orderId, Order_Status, token, Note) => {
  if (!token) throw new Error("Missing authentication token");

  const body = { Order_Status };
  if (Note !== undefined) body.Note = Note;

  const res = await fetch(`${API_URL}/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || "Failed to update order status");
  }

  return res.json();
};

/**
 * Submit orders
 * @param {Array} orders - [{MenuID, Quantity, Note}]
 * @param {string} Deadline - 'YYYY-MM-DD'
 * @returns {Promise<{success: boolean, orderId: number, warning?: string[]}>}
 */
export const submitOrders = async ({ orders, Deadline, Note }) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("No authentication token");

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ orders, Deadline, Note })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to submit orders');
  }

  return res.json(); // จะได้ { success, orderId, warning? }
};
