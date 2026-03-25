const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    recipientsCount: {
      type: Number,
      required: true,
      default: 0,
    },
    acceptedCount: {
      type: Number,
      required: true,
      default: 0,
    },
    rejectedCount: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Success", "Partial", "Failed"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("History", historySchema);
