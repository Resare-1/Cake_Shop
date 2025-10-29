// utils/createOrderUtils.js
export const createOrder = (menu, notes) => {
  const note = notes[menu.id]?.trim();
  if (!note) return null;

  return {
    order_id: Date.now(),
    menu_id: menu.id,
    name: menu.name,
    note
  };
};
