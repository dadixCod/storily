const SubCategory = require("../models/SubCategory");
const Brand = require("../models/Brand");
const Product = require("../models/Product");

//Get all sub categories
exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .populate("categoryId")
      .sort({ categoryId: 1 });
    res.json({
      success: true,
      message: "Sub Categories retrieved successfully.",
      data: subCategories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Get one Sub category by ID
exports.getOneSubCategory = async (req, res) => {
  try {
    const subCategoryId = req.params.id;
    const subCategory = await SubCategory.findById(subCategoryId).populate(
      "categoryId"
    );
    if (!subCategory) {
      res
        .status(404)
        .json({ success: false, message: "Sub category was not found" });
    }
    res.json({
      success: true,
      message: "Sub Category retrieved successfully.",
      data: subCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Create a sub category
exports.addSubCategory = async (req, res) => {
  const { name, categoryId } = req.body;

  if (!name || !categoryId) {
    return res
      .status(400)
      .json({ success: false, message: "Name and category ID are required." });
  }
  try {
    const subCategory = new SubCategory({ name, categoryId });
    const newSubCategory = await subCategory.save();
    res.json({
      success: true,
      message: "Sub Category created successfully.",
      data: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Update a sub category
exports.updateSubCategory = async (req, res) => {
  const subCategoryId = req.params.id;
  const { name, categoryId } = req.body;

  if (!name || !categoryId) {
    return res
      .status(400)
      .json({ success: false, message: "Name and category ID are required." });
  }

  try {
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      subCategoryId,
      { name, categoryId },
      { new: true }
    );
    if (!updatedSubCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Sub-category not found." });
    }
    res.json({
      success: true,
      message: "Sub-category updated successfully.",
      data: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSubCategory = async (req, res) => {
  const subCategoryId = req.params.id;
  try {
    //Checking if any brand is using this subcategory
    const brandCount = await Brand.countDocuments({
      subCategoryId: subCategoryId,
    });
    if (brandCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete sub-category. It is associated with one or more brands.",
      });
    }

    //Check if any product reference to this sub category
    const products = await Product.find({
      proSubCategoryId: subCategoryId,
    });
    if (products.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete sub-category. Products are referencing it.",
      });
    }

    const deletedSubCategory = await SubCategory.findByIdAndDelete(
      subCategoryId
    );
    if (!deletedSubCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Sub Category not found." });
    }
    res.json({ success: true, message: "Sub Category deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
