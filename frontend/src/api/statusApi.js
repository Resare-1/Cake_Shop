// lib/statusApi.js

/**
 * Update the status of any entity in the backend
 * @param {string} entity - e.g., 'orders', 'ingredients', 'tasks'
 * @param {number|string} id - the ID of the item to update
 * @param {string} status - new status value
 * @returns {Promise<Object>} - updated entity
 */
export const updateStatus = async (entity, id, status) => {
  try {
    const res = await fetch(`/api/${entity}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error(`Failed to update ${entity} status`);
    return await res.json();
  } catch (err) {
    console.error(`Error updating ${entity} status:`, err);
    throw err;
  }
};
