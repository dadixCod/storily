const mongoose = require("mongoose");
const SubCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category ID is required"],
  },
});
const SubCategory = mongoose.model("SubCategory", SubCategorySchema);
module.exports = SubCategory;
