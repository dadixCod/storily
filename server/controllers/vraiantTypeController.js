const VariantType = require("../models/VariantType");
const Product = require("../models/Product");
const Variant = require("../models/Variant");

//Get all variant types
exports.getVariantTypes = async (req, res) => {
  try {
    const variantTypes = await VariantType.find();
    res.json({
      success: true,
      message: "VariantTypes retrieved successfully.",
      data: variantTypes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Get One Variant Type by ID
exports.getOneVariantType = async (req, res) => {
  try {
    const variantTypeID = req.params.id;
    const variantType = await VariantType.findById(variantTypeID);
    if (!variantType) {
      return res
        .status(404)
        .json({ success: false, message: "VariantType not found." });
    }
    res.json({
      success: true,
      message: "VariantType retrieved successfully.",
      data: variantType,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Add a variant Type
exports.addVariantType = async (req, res) => {
  const { name, type } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Name is required." });
  }

  try {
    const variantType = new VariantType({ name, type });
    const newVariantType = await variantType.save();
    res.json({
      success: true,
      message: "VariantType created successfully.",
      data: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Update a variant type
exports.updateVariantType = async (req, res) => {
  const variantTypeID = req.params.id;
  const { name, type } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Name is required." });
  }

  try {
    const updatedVariantType = await VariantType.findByIdAndUpdate(
      variantTypeID,
      { name, type },
      { new: true }
    );
    if (!updatedVariantType) {
      return res
        .status(404)
        .json({ success: false, message: "VariantType not found." });
    }
    res.json({
      success: true,
      message: "VariantType updated successfully.",
      data: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Delete a variant type
exports.deleteVariantType = async (req, res) => {
  const variantTypeID = req.params.id;
  try {
    // Check if any variant is associated with this variant type
    const variantCount = await Variant.countDocuments({
      variantTypeId: variantTypeID,
    });
    if (variantCount > 0) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Cannot delete variant type. It is associated with one or more variants.",
        });
    }

    // Check if any products reference this variant type
    const products = await Product.find({ proVariantTypeId: variantTypeID });
    if (products.length > 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Cannot delete variant type. Products are referencing it.",
        });
    }

    // If no variants or products are associated, proceed with deletion of the variant type
    const variantType = await VariantType.findByIdAndDelete(variantTypeID);
    if (!variantType) {
      return res
        .status(404)
        .json({ success: false, message: "Variant type not found." });
    }
    res.json({ success: true, message: "Variant type deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
