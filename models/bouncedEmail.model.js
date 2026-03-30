const mongoose = require("mongoose");
const bouncedEmailSchema = new mongoose.Schema({
  email: { type: String, required: true },
  reason: { type: String },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "History" }
}, { timestamps: true });

module.exports = mongoose.model("Bounced_Email", bouncedEmailSchema);
