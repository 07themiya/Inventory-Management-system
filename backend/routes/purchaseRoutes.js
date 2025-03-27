const express = require("express");
const PurchaseLog = require("../models/PurchaseLog");
const Inventory = require("../models/Inventory");

const router = express.Router();

// Add Purchase Log
router.post("/", async (req, res) => {
  try {
    const { itemName, category, quantity, date } = req.body;
    console.log(req.body); // Log incoming data
    
    // Create Purchase Log
    const newPurchaseLog = new PurchaseLog({
      date: date || new Date(),
      itemName,
      category,
      quantity
    });
    
    // Update Inventory Item
    const inventoryItem = await Inventory.findOne({ name: itemName });
    if (inventoryItem) {
      inventoryItem.purchased += quantity;
      inventoryItem.currentStock += quantity;
      await inventoryItem.save();
    }

    const savedPurchaseLog = await newPurchaseLog.save();
    res.status(201).json(savedPurchaseLog);  // Return the saved purchase log
  } catch (error) {
    console.log(error.message); // Log the error message
    res.status(400).json({ message: error.message });
  }
});

// Get Purchase Logs
router.get("/", async (req, res) => {
  try {
    const purchaseLogs = await PurchaseLog.find();
    console.log(purchaseLogs);  // Log the fetched purchase logs
    res.json(purchaseLogs);    // Return purchase logs as JSON
  } catch (error) {
    console.log(error.message); // Log the error message
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
