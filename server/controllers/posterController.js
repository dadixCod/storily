const multer = require("multer");
const Poster = require("../models/Poster");
const { uploadPosters } = require("../uploadFile");

//Get all posters
exports.getPosters = async (req, res) => {
  try {
    const posters = await Poster.find({});
    res.json({
      success: true,
      message: "Posters retrieved successfully.",
      data: posters,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Get a Poster by ID
exports.getOnePoster = async (req, res) => {
  try {
    const posterId = req.params.id;
    const poster = await Poster.findById(posterId);
    if (!poster) {
      return res
        .status(404)
        .json({ success: false, message: "Poster not found." });
    }
    res.json({
      success: true,
      message: "Poster retrieved successfully.",
      data: poster,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Create a newPoster
exports.addPoster = async (req, res) => {
  try {
    uploadPosters.single("img")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          err.message = "File size is too large. Maximum filesize is 5MB.";
        }
        return res.json({ success: false, message: err });
      } else if (err) {
        return res.json({ success: false, message: err });
      }
      const { posterName } = req.body;
      let imageUrl = "";
      if (req.file) {
        imageUrl = `http://localhost:4500/images/posters/${req.file.filename}`;
      }
      if (!posterName) {
        return res
          .status(400)
          .json({ success: false, message: "Name is required." });
      }
      try {
        const newPoster = new Poster({
          posterName,
          imageUrl,
        });
        await newPoster.save();
        res.json({
          success: true,
          message: "Poster created successfully.",
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

//Update a poster
exports.updatePoster = async (req, res) => {
  try {
    const posterId = req.params.id;
    uploadPosters.single("img")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          err.message = "File size is too large. Maximum filesize is 5MB.";
        }
        return res.json({ success: false, message: err });
      } else if (err) {
        return res.json({ success: false, message: err });
      }
      const { posterName } = req.body;
      let image = req.body.image;
      if (req.file) {
        image = `http://localhost:4500/images/posters/${req.file.filename}`;
      }
      if (!posterName || !image) {
        return res
          .status(400)
          .json({ success: false, message: "Name and image are required." });
      }
      try {
        const updatedPoster = await Poster.findByIdAndUpdate(
          posterId,
          {
            posterName,
            imageUrl: image,
          },
          { new: true }
        );
        if (!updatedPoster) {
          return res
            .status(404)
            .json({ success: false, message: "Poster not found." });
        }
        res.json({
          success: true,
          message: "Poster updated successfully.",
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

//Delete a poster
exports.deletePoster = async (req, res) => {
  const posterID = req.params.id;
  try {
    const deletedPoster = await Poster.findByIdAndDelete(posterID);
    if (!deletedPoster) {
      return res
        .status(404)
        .json({ success: false, message: "Poster not found." });
    }
    res.json({ success: true, message: "Poster deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
