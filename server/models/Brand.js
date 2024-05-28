const mongoose = require("mongoose");
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name of category is required"],
      trime: true,
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: [true, "SubCategory ID is required"],
    },
  },
  { timestamps: true }
);
const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
