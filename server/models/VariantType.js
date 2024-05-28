const mongoose = require("mongoose");
const variantTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      trim: true,
    },
  },
  { timestamps: true }
);
const VariantType = mongoose.model("VariantType", variantTypeSchema);
module.exports = VariantType;
