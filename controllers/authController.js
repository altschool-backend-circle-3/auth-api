"use strict";

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Log a user in
// @route   POST /api/auth/login
// @access  Public
const login = async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    // password is select:false in the schema, so we must explicitly ask for it
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      // same message for wrong email and wrong password — don't reveal which
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export { login };
