import express from "express";
import {
  login,
  logout,
  register,
  sendOtp,
  verifyOtp,
} from "../controllers/authController.js";
import userAuth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/sendOtp", userAuth, sendOtp);
router.post("/veridyOtp", userAuth, verifyOtp);

export default router;
