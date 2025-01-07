import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const userExists = await User.findOne({ email });
    console.log(userExists);

    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    console.log("test_user", user);

    await user.save();

    const token = await user.generateJWT();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 10000,
    });

    res.status(200).json({
      message: "user created successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};