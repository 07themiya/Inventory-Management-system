const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  name: String,
  category: String,
  initialStock: Number,
  purchased: Number,
  used: Number,
  currentStock: Number,
}, { 
  timestamps: true,
  collection: 'inventories' // Explicitly set collection name
});

module.exports = mongoose.model("Inventory", inventorySchema);