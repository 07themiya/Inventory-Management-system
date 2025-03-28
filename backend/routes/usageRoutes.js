const express = require("express");
const UsageLog = require("../models/UsageLog");
const Inventory = require("../models/Inventory");

const router = express.Router();

// Add Usage Log
router.post("/", async (req, res) => {
  try {
    const { itemName, category, quantityUsed, date } = req.body;
    
    // Create Usage Log
    const newUsageLog = new UsageLog({ 
      date: date || new Date(), 
      itemName, 
      category, 
      quantityUsed 
    });
    
    // Update Inventory Item
    const inventoryItem = await Inventory.findOne({ name: itemName });
    if (inventoryItem) {
      if (inventoryItem.currentStock >= quantityUsed) {
        inventoryItem.used += quantityUsed;
        inventoryItem.currentStock -= quantityUsed;
        await inventoryItem.save();
      } else {
        return res.status(400).json({ message: "Insufficient stock" });
      }
    }

    const savedUsageLog = await newUsageLog.save();
    console.log("Saved Usage Log:", savedUsageLog); 
    res.status(201).json(savedUsageLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get Usage Logs
router.get("/", async (req, res) => {
  try {
    const usageLogs = await UsageLog.find();
    res.json(usageLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;