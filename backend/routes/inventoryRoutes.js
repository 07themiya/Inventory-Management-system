const express = require("express");
const Inventory = require("../models/Inventory");

const router = express.Router();

// Get all inventory items
router.get("/", async (req, res) => {
  const items = await Inventory.find();
  res.json(items);
});

// Add new inventory item
router.post("/", async (req, res) => {
  const { name, category, initialStock } = req.body;
  const newItem = new Inventory({ name, category, initialStock, purchased: 0, used: 0, currentStock: initialStock });
  await newItem.save();
  res.json(newItem);
});

// Update inventory item
router.put("/:id", async (req, res) => {
  const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedItem);
});

// Delete inventory item
router.delete("/:id", async (req, res) => {
  await Inventory.findByIdAndDelete(req.params.id);
  res.json({ message: "Item deleted" });
});

module.exports = router;
