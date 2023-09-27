const mongoose = require("mongoose");

const mailingListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a Name"],
    },
    emails: [{ type: String, required: [true, "Please add emails"] }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Mailing_Lists", mailingListSchema);
