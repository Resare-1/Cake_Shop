// src/api/orderApi.js

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
//export const getOrders = async () => {
//  try {
//    const res = await fetch('/api/orders');
//    if (!res.ok) throw new Error('Failed to fetch orders');
//    return await res.json();
//  } catch (err) {
//    console.error('Error fetching orders:', err);
//    throw err;
//  }
//};

// ✅ Update status for an order (e.g., Processing / Complete / Cancel)
export const updateOrderStatus = async (orderId, newStatus, note) => {
  try {
    const body = { Order_Status: newStatus };

    // Only include Note if it actually changed
    if (note !== undefined && note !== null) {
      body.Note = note;
    }

    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error('Failed to update order status');
    return await res.json();
  } catch (err) {
    console.error('Error updating order status:', err);
    throw err;
  }
};


// ✅ Mock orders for testing
export const getOrders = async () => {
  // simulate network delay
  await new Promise((res) => setTimeout(res, 300));

  // mock menu items
  const menus = [
    { id: 1, name: 'Chocolate Cake', description: 'Rich dark chocolate cake' },
    { id: 2, name: 'Vanilla Cake', description: 'Classic vanilla cream cake' },
    { id: 3, name: 'Strawberry Cake', description: 'Fresh strawberry cake' },
    { id: 4, name: 'Lemon Cake', description: 'Tangy lemon cake' },
    { id: 5, name: 'Red Velvet', description: 'Velvety red cake' },
  ];

  // mock orders
 return [
  // Original orders (unchanged)
  {
    id: 1,
    customer: 'John Doe',
    status: 'Pending',
    items: [
      {
        menuId: menus[0].id,
        menuName: menus[0].name,
        quantity: 1,
        note: 'ช็อกโกแลตเข้มข้น',
        ingredients: [
          { name: 'Flour', qty_required: 200, unit: 'g' },
          { name: 'Chocolate', qty_required: 100, unit: 'g' },
          { name: 'Sugar', qty_required: 50, unit: 'g' },
        ],
      },
      {
        menuId: menus[1].id,
        menuName: menus[1].name,
        quantity: 2,
        note: '',
        ingredients: [
          { name: 'Flour', qty_required: 200, unit: 'g' },
          { name: 'Vanilla', qty_required: 50, unit: 'g' },
          { name: 'Sugar', qty_required: 50, unit: 'g' },
        ],
      },
    ],
  },
  {
    id: 2,
    customer: 'Jane Smith',
    status: 'Pending',
    items: [
      {
        menuId: menus[2].id,
        menuName: menus[2].name,
        quantity: 1,
        note: 'ไม่มี',
        ingredients: [
          { name: 'Flour', qty_required: 200, unit: 'g' },
          { name: 'Strawberry', qty_required: 100, unit: 'g' },
          { name: 'Sugar', qty_required: 50, unit: 'g' },
        ],
      },
    ],
  },

  // New orders for testing CheckOrder
  {
    id: 3,
    customer: 'Alice Johnson',
    status: 'CheckOrder',
    items: [
      {
        menuId: menus[3].id,
        menuName: menus[3].name,
        quantity: 1,
        note: 'เปรี้ยวหน่อย',
        ingredients: [
          { name: 'Flour', qty_required: 200, unit: 'g' },
          { name: 'Lemon', qty_required: 50, unit: 'g' },
          { name: 'Sugar', qty_required: 50, unit: 'g' },
        ],
      },
    ],
  },
  {
    id: 4,
    customer: 'Bob Brown',
    status: 'CheckOrder',
    items: [
      {
        menuId: menus[4].id,
        menuName: menus[4].name,
        quantity: 2,
        note: 'นุ่ม ๆ',
        ingredients: [
          { name: 'Flour', qty_required: 200, unit: 'g' },
          { name: 'Red Velvet', qty_required: 100, unit: 'g' },
          { name: 'Sugar', qty_required: 50, unit: 'g' },
        ],
      },
    ],
  },
];

}