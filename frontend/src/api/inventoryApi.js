import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const fetchInventory = async () => {
  const response = await axios.get(`${API_URL}/inventory`);
  return response.data;
};

export const addInventoryItem = async (item) => {
  await axios.post(`${API_URL}/inventory`, item);
};
