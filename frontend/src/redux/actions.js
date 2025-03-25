export const ADD_ITEM = 'ADD_ITEM';
export const UPDATE_ITEM = 'UPDATE_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';
export const ADD_PURCHASE = 'ADD_PURCHASE';
export const ADD_USAGE = 'ADD_USAGE';

export const addItem = (item) => ({
  type: ADD_ITEM,
  payload: item
});

export const updateItem = (id, updates) => ({
  type: UPDATE_ITEM,
  payload: { id, updates }
});

export const deleteItem = (id) => ({
  type: DELETE_ITEM,
  payload: id
});

export const addPurchase = (purchase) => ({
  type: ADD_PURCHASE,
  payload: purchase
});

export const addUsage = (usage) => ({
  type: ADD_USAGE,
  payload: usage
});