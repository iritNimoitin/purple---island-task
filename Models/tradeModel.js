const mongoose = require("mongoose");

let TradeCenterSchema = new mongoose.Schema({
  sellerName: String,
  itemsToTrade: [
    {
      name: String,
      value: Number,
      amount: Number,
    },
  ],
  minimumBid: Number,
});

module.exports = mongoose.model("tradeCenter", TradeCenterSchema);
