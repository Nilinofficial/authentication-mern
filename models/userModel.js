import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      const isValidEmail = validator.isEmail(value);
      if (!isValidEmail) throw new error("Enter a valid email ");
    },
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      const isValidPassword = validator.isStrongPassword(value);
      if (!isValidPassword) throw new error("Enter a strong password");
    },
  },
  verifyOtp: {
    type: String,
    default: "",
  },
  verifyOtpExpiresAt: {
    type: Number,
    default: 0,
  },
  isAccountVerified: {
    type: Boolean,
    default: false,
  },
  resetOtp: {
    type: String,
    default: "",
  },
  reserOtpExpiresAt: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
// check this in detail
export default userModel;
