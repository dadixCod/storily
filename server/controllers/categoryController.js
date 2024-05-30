const multer = require("multer");
const Category = require("../models/Category");
const Product = require("../models/Product");
const SubCategory = require("../models/SubCategory");
const path = require("path");
const fs = require("fs");

const { uploadCategory } = require("../uploadFile");

//Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({
      success: true,
      message: "Categories retrieved successfully.",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Get Category by Id
exports.getOneCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }

    res.json({
      success: true,
      message: "Category retrieved successfully.",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Create a category
exports.addCategory = async (req, res) => {
  try {
    uploadCategory.single("img")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          err.message = "File size is too large. Maximum filesize is 5MB.";
        }
        console.log(`Add category: ${err}`);
        return res.json({ success: false, message: err });
      } else if (err) {
        console.log(`Add category: ${err}`);
        return res.json({ success: false, message: err });
      }
      const { name } = req.body;
      let imageUrl = "empty_url";
      if (req.file) {
        imageUrl = `http://localhost:4500/image/category/${req.file.filename}`;
      }
      console.log("url ", req.file);
      if (!name) {
        return res
          .status(400)
          .json({ success: false, message: "Name is required." });
      }
      try {
        const newCategory = new Category({
          name,
          image: imageUrl,
        });
        await newCategory.save();
        res.json({
          success: true,
          message: "Category created successfully.",
          data: null,
        });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Update a category
exports.updateCategory = async (req, res) => {
  try {
    const categoryID = req.params.id;
    uploadCategory.single("img")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          err.message = "File size is too large. Maximum filesize is 5MB.";
        }
        console.log(`Add category: ${err}`);
        return res.json({ success: false, message: err });
      } else if (err) {
        console.log(`Add category: ${err}`);
        return res.json({ success: false, message: err });
      }
      const { name } = req.body;
      let image = req.body.image;
      if (req.file) {
        image = `http://localhost:4500/image/category/${req.file.filename}`;
      }
      console.log("url ", req.file);
      if (!name || !image) {
        return res
          .status(400)
          .json({ success: false, message: "Name and image are required." });
      }
      try {
        const updatedCategory = await Category.findByIdAndUpdate(
          categoryID,
          {
            name,
            image,
          },
          { new: true }
        );
        if (!updatedCategory) {
          return res
            .status(404)
            .json({ success: false, message: "Category not found." });
        }

        res.json({
          success: true,
          message: "Category updated successfully.",
          data: null,
        });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const categoryID = req.params.id;

    // Check if any subcategories reference this category
    const subcategories = await SubCategory.find({ categoryId: categoryID });
    if (subcategories.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category. Subcategories are referencing it.",
      });
    }

    // Check if any products reference this category
    const products = await Product.find({ proCategoryId: categoryID });
    if (products.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category. Products are referencing it.",
      });
    }

    // If no subcategories or products are referencing the category, proceed with deletion
    const category = await Category.findByIdAndDelete(categoryID);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }
    const filePath = path.join(__dirname,'../public/category',path.basename(category.image));
    fs.unlink(filePath,(err)=>{
      if(err){
        return res.status(500).json({ success: false, message: err.message });
      }
    })
    res.json({ success: true, message: "Category deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
