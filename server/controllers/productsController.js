const multer = require("multer");
const Product = require("../models/Product");
const { uploadProduct } = require("../uploadFile");
const path = require("path");
const fs = require("fs");

//Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("proCategoryId", "id name")
      .populate("proSubCategoryId", "id name")
      .populate("proBrandId", "id name")
      .populate("proVariantTypeId", "id type")
      .populate("proVariantId", "id name");
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Get one product by id
exports.getOneProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId)
      .populate("proCategoryId", "id name")
      .populate("proSubCategoryId", "id name")
      .populate("proBrandId", "id name")
      .populate("proVariantTypeId", "id type")
      .populate("proVariantId", "id name");
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully.",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Add a product
exports.addProduct = async (req, res) => {
  try {
    //Getting product images
    uploadProduct.fields([
      { name: "image1", maxCount: 1 },
      { name: "image2", maxCount: 1 },
      { name: "image3", maxCount: 1 },
      { name: "image4", maxCount: 1 },
      { name: "image5", maxCount: 1 },
    ])(req, res, async function (err) {
      //Handling multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          err.message =
            "File size is too large. Maximum filesize is 5MB per image.";
        }
        console.log(`Add product: ${err}`);
        return res.json({ success: false, message: err.message });
      } else if (err) {
        // Handle other errors, if any
        console.log(`Add product: ${err}`);
        return res.json({ success: false, message: err });
      }
      //Extracting rest of informations
      const {
        name,
        description,
        quantity,
        price,
        offerPrice,
        proCategoryId,
        proSubCategoryId,
        proBrandId,
        proVariantTypeId,
        proVariantId,
      } = req.body;

      // Check if any required fields are missing
      if (!name || !quantity || !price || !proCategoryId || !proSubCategoryId) {
        return res
          .status(400)
          .json({ success: false, message: "Required fields are missing." });
      }
      // Initialize an array to store image URLs
      const imageUrls = [];
      // Iterate over the file fields
      const fields = ["image1", "image2", "image3", "image4", "image5"];
      fields.forEach((field, index) => {
        if (req.files[field] && req.files[field].length > 0) {
          const file = req.files[field][0];
          const imageUrl = `http://localhost:4500/images/products/${file.filename}`;
          imageUrls.push({ image: index + 1, url: imageUrl });
        }
      });

      const newProduct = new Product({
        name,
        description,
        quantity,
        price,
        offerPrice,
        proCategoryId,
        proSubCategoryId,
        proBrandId,
        proVariantTypeId,
        proVariantId,
        images: imageUrls,
      });

      // Save the new product to the database
      await newProduct.save();

      // Send a success response back to the client
      res.json({
        success: true,
        message: "Product created successfully.",
        data: null,
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Update a product
exports.updateProuct = async (req, res) => {
  try {
    const productId = req.params.id;
    uploadProduct.fields([
      { name: "image1", maxCount: 1 },
      { name: "image2", maxCount: 1 },
      { name: "image3", maxCount: 1 },
      { name: "image4", maxCount: 1 },
      { name: "image5", maxCount: 1 },
    ])(req, res, async function (err) {
      //Handling multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          err.message =
            "File size is too large. Maximum filesize is 5MB per image.";
        }
        console.log(`Add product: ${err}`);
        return res.json({ success: false, message: err.message });
      } else if (err) {
        // Handle other errors, if any
        console.log(`Add product: ${err}`);
        return res.json({ success: false, message: err });
      }
      const {
        name,
        description,
        quantity,
        price,
        offerPrice,
        proCategoryId,
        proSubCategoryId,
        proBrandId,
        proVariantTypeId,
        proVariantId,
      } = req.body;

      //Finding the product
      const productToUpdate = await Product.findById(productId);
      if (!productToUpdate) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found." });
      }

      // Update product properties if provided
      productToUpdate.name = name || productToUpdate.name;
      productToUpdate.description = description || productToUpdate.description;
      productToUpdate.quantity = quantity || productToUpdate.quantity;
      productToUpdate.price = price || productToUpdate.price;
      productToUpdate.offerPrice = offerPrice || productToUpdate.offerPrice;
      productToUpdate.proCategoryId =
        proCategoryId || productToUpdate.proCategoryId;
      productToUpdate.proSubCategoryId =
        proSubCategoryId || productToUpdate.proSubCategoryId;
      productToUpdate.proBrandId = proBrandId || productToUpdate.proBrandId;
      productToUpdate.proVariantTypeId =
        proVariantTypeId || productToUpdate.proVariantTypeId;
      productToUpdate.proVariantId =
        proVariantId || productToUpdate.proVariantId;

      const fields = ["image1", "image2", "image3", "image4", "image5"];
      fields.forEach((field, index) => {
        if (req.files[field] && req.files[field].length > 0) {
          const file = req.files[field][0];
          const imageUrl = `http://localhost:4500/images/products/${file.filename}`;
          let imageEntry = productToUpdate.images.find(
            (img) => img.image === index + 1
          );
          if (imageEntry) {
            imageEntry.url = imageUrl;
          } else {
            // If the image entry does not exist, add it
            productToUpdate.images.push({ image: index + 1, url: imageUrl });
          }
        }
      });

      // Save the updated product
      await productToUpdate.save();
      res.json({ success: true, message: "Product updated successfully." });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Delete a product
exports.deleteProduct = async (req, res) => {
  const productID = req.params.id;
  try {
    const product = await Product.findByIdAndDelete(productID);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }
    product.images.forEach((image) => {
      const filePath = path.join(
        __dirname,
        "../public/products",
        path.basename(image.url)
      );
      fs.unlink(filePath, (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: err.message });
        }
      });
    });

    res.json({ success: true, message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
