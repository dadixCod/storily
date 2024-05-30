const User = require("../models/User");
const bcrypt = require("bcrypt");

//Get All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      message: "All users retrieved successfully.",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Get one user
exports.getOneUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "User retrieved successfully.",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Login a user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email & password are required",
      });
    }
    //Try finding the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    //Try matching the passwords
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    res.status(200).json({
      success: true,
      message: "User logged in sucessfully.",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Register a new user
exports.signUpUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Missing credentials ! ",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use .",
      });
    }
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "User created successfully.",
      data: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Update a user
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: "Name & password are required",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found. ",
      });
    }
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    await user.updateOne({ name });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Update password
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Missing credentials",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found. ",
      });
    }

    //Checking old password if matched
    const oldMatched = await bcrypt.compare(oldPassword, user.password);
    if (!oldMatched) {
      return res.status(400).json({
        success: false,
        message: "Old password does not match. ",
      });
    }
    const saltRound = 10;
    const newHashedPassword = await bcrypt.hash(newPassword, saltRound);
    await user.updateOne({ password: newHashedPassword });
    res.status(200).json({
      success: true,
      message: "User's password updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const userID = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userID);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    res.json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
