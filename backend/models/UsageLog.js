const mongoose = require("mongoose");

const usageLogSchema = new mongoose.Schema({
  date: Date,
  itemName: String,
  category: String,
  quantityUsed: Number
}, { timestamps: true });

module.exports = mongoose.model("UsageLog", usageLogSchema);
