import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }

        const user = await User.create({ email, password });
        const token = generateToken(user._id);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: { id: user._id, email: user.email },
                token,
            },
        });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }
        console.error("Signup Error:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// @desc    Log a user in
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide both email and password",
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
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
                    isAdmin: user.isAdmin, // for frontend UI decisions only — actual authorization is enforced server-side in adminMiddleware
                },
            },
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export { signup, login };