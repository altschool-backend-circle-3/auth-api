"use strict";

const express = require("express");

const router = express.Router();

const { login } = require("../controllers/authController");

router.post("/login", login);

module.exports = router;
import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { signupUser } from '../controllers/authController.js';

const router = Router();
router.route("/signup").post(signupUser)

export default router;
