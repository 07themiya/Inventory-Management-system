import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const inventoryApi = {
  fetchInventory: async () => {
    const response = await axios.get(`${API_URL}/inventory`);
    return response.data;
  },
  
  addInventoryItem: async (item) => {
    const response = await axios.post(`${API_URL}/inventory`, item);
    return response.data;
  },
  
  updateInventoryItem: async (id, updates) => {
    const response = await axios.put(`${API_URL}/inventory/${id}`, updates);
    return response.data;
  },
  
  deleteInventoryItem: async (id) => {
    const response = await axios.delete(`${API_URL}/inventory/${id}`);
    return response.data;
  },
  
  addPurchaseLog: async (purchase) => {
    const response = await axios.post(`${API_URL}/purchases`, purchase);
    return response.data;
  },
  
  addUsageLog: async (usage) => {
    const response = await axios.post(`${API_URL}/usage`, usage);
    return response.data;
  },
  
  fetchPurchaseLogs: async () => {
    const response = await axios.get(`${API_URL}/purchases`);
    return response.data;
  },
  
  fetchUsageLogs: async () => {
    const response = await axios.get(`${API_URL}/usage`);
    return response.data;
  }
};