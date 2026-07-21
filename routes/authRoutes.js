import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { signup, login } from '../controllers/authController.js';

const router = Router();
router.route("/signup").post(signupUser);
router.route("/login").post(login);

export default router;
