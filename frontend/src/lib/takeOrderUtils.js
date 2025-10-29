// lib/takeOrderUtils.js
export const validateOrderNotes = (order) => {
  return order.items.every(item => item.note && item.note.trim() !== '');
};
