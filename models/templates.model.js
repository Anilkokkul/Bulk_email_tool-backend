const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, "Please add a Subject"],
    },
    body: {
      type: String,
      required: [true, "Please add template message"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Templates", templateSchema);
