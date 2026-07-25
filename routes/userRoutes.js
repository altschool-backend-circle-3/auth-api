import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import { getAllUsers } from '../controllers/userController.js';

const router = Router();

router.route("/").get(authMiddleware, adminMiddleware, getAllUsers);

export default router;