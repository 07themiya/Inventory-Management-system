import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventory } from "../redux/inventorySlice";

export default function InventoryList() {
  const dispatch = useDispatch();
  const inventory = useSelector((state) => state.inventory.items);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Inventory</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Stock</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item._id} className="border">
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.category}</td>
              <td className="border p-2">{item.currentStock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
