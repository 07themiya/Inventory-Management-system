const mongoose = require("mongoose");

const purchaseLogSchema = new mongoose.Schema({
  date: Date,
  itemName: String,
  category: String,
  quantity: Number
}, { timestamps: true });

module.exports = mongoose.model("PurchaseLog", purchaseLogSchema);
