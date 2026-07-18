import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// sample route to test authmiddleware
// router.get('/test-auth', authMiddleware, (req, res) => {
//     res.json({ message: 'Success! You are authenticated.', user: req.user });
// });

export default router;