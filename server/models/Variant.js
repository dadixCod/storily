const mongoose = require("mongoose");
const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  variantTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VariantType",
    required: true,
  },
});
const Variant = mongoose.model("Variant", variantSchema);
module.exports = Variant;
