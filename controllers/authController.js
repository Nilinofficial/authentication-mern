import transporter from "../config/nodemailer.js";
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

    await user.save();
    const token = await user.generateJWT();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const mailOptions = {
      from: `"Founder Flarelabs" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Message from Flarelabs!",
      html: `
        <h1>Welcome to Flarelabs!</h1>
        <p>Hey <b>${firstName}</b>,</p>
        <p>Your account has been created with the email ID: <b>${email}</b>.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "user created successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    res.status(400).json({ message: "All fields are required" });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "user does not exists!" });
    }

    const isUserValid = await user.validatePassword(password);
    if (!isUserValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = await user.generateJWT();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "user logged in successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.status(200).json({ message: "successfully logged out" });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
