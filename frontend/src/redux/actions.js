import axios from 'axios';

// Action Types
export const ADD_ITEM = 'ADD_ITEM';
export const UPDATE_ITEM = 'UPDATE_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';
export const FETCH_ITEMS = 'FETCH_ITEMS';
export const FETCH_PURCHASE_LOGS = 'FETCH_PURCHASE_LOGS';
export const HANDLE_API_ERROR = 'HANDLE_API_ERROR';
export const ADD_PURCHASE_LOG = 'ADD_PURCHASE_LOG';
export const API_ERROR = 'API_ERROR';
export const ADD_USAGE = 'ADD_USAGE';

// Configure Axios instance with defaults
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: function (status) {
    return status < 500; // Don't throw for 4xx errors
  },
});

// Helper function to handle API errors
const handleApiError = (error, dispatch, actionType) => {
  const errorData = {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    actionType,
  };

  console.error(`API Error in ${actionType}:`, errorData);

  dispatch({
    type: API_ERROR,
    payload: errorData,
  });

  return errorData;
};

// Action Creators

// Add Item Action
export const addItem = (item) => async (dispatch) => {
  try {
    if (!item.name || !item.category) {
      throw new Error('Name and category are required');
    }

    const payload = {
      name: item.name.trim(),
      category: item.category.trim(),
      initialStock: Math.max(0, Number(item.initialStock)) || 0,
      purchased: Math.max(0, Number(item.purchased)) || 0,
      used: Math.max(0, Number(item.used)) || 0,
    };

    console.log('Adding item:', payload);
    const response = await api.post('/inventory', payload);

    dispatch({
      type: ADD_ITEM,
      payload: response.data,
    });

    return response.data;
  } catch (error) {
    return handleApiError(error, dispatch, ADD_ITEM);
  }
};

// Add Usage Action
export const addUsage = (usageData) => async (dispatch) => {
  try {
    const payload = {
      itemName: usageData.itemName?.trim(),
      category: usageData.category?.trim(),
      quantityUsed: Math.max(1, Number(usageData.quantityUsed)),
      date: usageData.date || new Date().toISOString(),
    };

    console.log('Adding usage:', payload);
    const response = await api.post('/usage', payload);

    dispatch({
      type: ADD_USAGE,
      payload: response.data,
    });

    return response.data;
  } catch (error) {
    return handleApiError(error, dispatch, ADD_USAGE);
  }
};

// Update Item Action
export const updateItem = (id, updates) => async (dispatch) => {
  try {
    const payload = {
      ...(updates.name && { name: updates.name.trim() }),
      ...(updates.category && { category: updates.category.trim() }),
      ...(updates.initialStock && { initialStock: Math.max(0, Number(updates.initialStock)) }),
      ...(updates.purchased && { purchased: Math.max(0, Number(updates.purchased)) }),
      ...(updates.used && { used: Math.max(0, Number(updates.used)) }),
    };

    console.log(`Updating item ${id}:`, payload);
    const response = await api.put(`/inventory/${id}`, payload);

    dispatch({
      type: UPDATE_ITEM,
      payload: { id, updates: response.data },
    });

    return response.data;
  } catch (error) {
    return handleApiError(error, dispatch, UPDATE_ITEM);
  }
};

// Delete Item Action
export const deleteItem = (id) => async (dispatch) => {
  try {
    console.log(`Deleting item ${id}`);
    await api.delete(`/inventory/${id}`);

    dispatch({
      type: DELETE_ITEM,
      payload: id,
    });

    return { success: true };
  } catch (error) {
    return handleApiError(error, dispatch, DELETE_ITEM);
  }
};

// Fetch Items Action
export const fetchItems = () => async (dispatch) => {
  try {
    console.log('Fetching items');
    const response = await api.get('/inventory');

    dispatch({
      type: FETCH_ITEMS,
      payload: response.data,
    });

    return response.data;
  } catch (error) {
    return handleApiError(error, dispatch, FETCH_ITEMS);
  }
};

// Fetch Purchase Logs Action
export const fetchPurchaseLogs = () => async (dispatch) => {
  try {
    console.log('Fetching purchase logs');
    const response = await axios.get('http://localhost:5000/api/purchases');  // Ensure correct backend URL

    console.log(response.data); // Log the fetched data
    dispatch({
      type: FETCH_PURCHASE_LOGS,
      payload: response.data,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching purchase logs:', error.message);  // Log any error during fetching
    dispatch({
      type: HANDLE_API_ERROR,
      payload: error.message,  // Pass error message to the reducer for display
    });
  }
};

// Add Purchase Log Action
export const addPurchaseLog = (purchaseData) => async (dispatch) => {
  try {
    const payload = {
      itemName: purchaseData.itemName?.trim(),
      category: purchaseData.category?.trim(),
      quantity: Math.max(1, Number(purchaseData.quantity)),
      unitPrice: Math.max(0, Number(purchaseData.unitPrice)) || 0,
      totalCost: Math.max(0, Number(purchaseData.quantity) * Number(purchaseData.unitPrice || 1)),
      date: purchaseData.date || new Date().toISOString(),
      supplier: purchaseData.supplier?.trim() || null,
    };

    console.log('Adding purchase:', payload);
    const response = await api.post('/purchases', payload);

    // Dispatch two actions:
    // 1. Add the new purchase to the log
    dispatch({
      type: ADD_PURCHASE_LOG,
      payload: response.data,
    });

    // 2. Update the inventory item's purchased quantity
    if (purchaseData.itemId) {
      dispatch({
        type: UPDATE_ITEM,
        payload: {
          id: purchaseData.itemId,
          updates: {
            purchased: response.data.newPurchaseTotal, // Your API should return this
          },
        },
      });
    }

    return response.data;
  } catch (error) {
    return handleApiError(error, dispatch, ADD_PURCHASE_LOG);
  }
};

export const fetchUsage = () => {
  return async (dispatch) => {
    try {
      const response = await fetch('API_URL');
      const data = await response.json();
      dispatch({
        type: 'FETCH_USAGE_SUCCESS',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_USAGE_FAILURE',
        error,
      });
    }
  };
};