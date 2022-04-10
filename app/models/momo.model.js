const mongoose = require("mongoose");

const { Schema } = mongoose;

const Momo = new Schema(
  {
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    senderName: String,
    senderPhone: String,
    message: String,
    time: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Momo", Momo);
