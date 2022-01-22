const mongoose = require("mongoose");

let UsersSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  image: String,
  items: [
    {
      name: String,
      value: Number,
      amount: Number,
    },
  ],
  deals: [
    {
      itemsBided: [
        {
          name: String,
          value: Number,
          amount: Number,
        },
      ],
      itemsTraded: [
        {
          name: String,
          value: Number,
          amount: Number,
        },
      ],
      traderName: String,
    },
  ],
});

module.exports = mongoose.model("users", UsersSchema);
