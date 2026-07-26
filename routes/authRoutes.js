import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { signup, login, changePassword } from '../controllers/authController.js';

const router = Router();
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/change-password").patch(authMiddleware, changePassword);

export default router;
