import User from "../models/User.js";

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: { users },
        });

    } catch (error) {
        console.error("Get All Users Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export { getAllUsers };