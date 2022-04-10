const mongoose = require("mongoose");

const { Schema } = mongoose;

const Config = new Schema(
  {
    value: Object,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Config", Config);
