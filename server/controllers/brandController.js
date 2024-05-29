const Brand = require("../models/Brand");
const Product = require("../models/Product");

//Get all Brands
exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.find()
      .populate("subCategoryId")
      .sort({ subCategoryId: 1 });
    res.status(200).json({
      success: true,
      message: "Brands retrieved successfully.",
      data: brands,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Get one brand by ID
exports.getOneBrand = async (req, res) => {
  const brandId = req.params.id;
  try {
    const brand = await Brand.findById(brandId).populate("subCategoryId");
    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    }
    res.status(200).json({
      success: false,
      message: "Brand retrieved successfully.",
      data: brand,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//add a brand
exports.addBrand = async (req, res) => {
  const { name, subCategoryId } = req.body;
  if (!name || !subCategoryId) {
    return res.status(400).json({
      success: false,
      message: "Name and Sub Category ID are required.",
    });
  }
  try {
    const brand = new Brand({ name, subCategoryId });
    const newBrand = await brand.save();
    res.json({
      success: true,
      message: "Brand created successfully.",
      data: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Update a brand
exports.updateBrand = async (req, res) => {
  const brandId = req.params.id;
  const { name, subCategoryId } = req.body;
  if (!name || !subCategoryId) {
    return res.status(400).json({
      success: false,
      message: "Name and Sub Category ID are required.",
    });
  }

  try {
    const updatedBrand = await Brand.findByIdAndUpdate(
      brandId,
      { name, subCategoryId },
      { new: true }
    );
    if (!updatedBrand) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    }
    res.json({
      success: true,
      message: "Brand updated successfully.",
      data: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Delete a brand
exports.deleteBrand = async (req, res) => {
  const brandId = req.params.id;
  try {
    const products = await Product.find({ proBrandId: brandId });
    if (products.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete brand. Products are referencing it.",
      });
    }
    const deletedbrand = await Brand.findByIdAndDelete(brandId);
    if (!deletedbrand) {
      return res
        .status(400)
        .json({ success: false, message: "Brand not found." });
    }
    res.json({ success: true, message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
