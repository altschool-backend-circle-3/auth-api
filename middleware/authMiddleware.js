import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
    try {
        // 1. Extract token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. No token provided.",
            });
        }

        const token = authHeader.split(" ")[1];
        // 2. Verify token (Synchronous is standard/safe for JWT verification)
        // If it fails, it throws an error which the catch block handles
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Find the user
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. User no longer exists.",
            });
        }

        // 4. Attach to request
        req.user = user;
        next();

    } catch (error) {
        // Handle TokenExpiredError or JsonWebTokenError specifically if needed
        return res.status(401).json({
            success: false,
            message: "Not authorized. Token is invalid or expired.",
        });
    }
};

export default authMiddleware;