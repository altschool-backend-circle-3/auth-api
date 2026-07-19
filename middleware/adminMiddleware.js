// middleware/adminMiddleware.js

const adminMiddleware = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) { // Depends on req.user from authMiddleware
        return res.status(403).json({
            success: false,
            message: "Access denied. Admins only.",
        });
    }

    next();
};

export default adminMiddleware;