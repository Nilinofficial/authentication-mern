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

export const sendOtp = async (req, res) => {
  try {
    const user = req.user;
 


    

    if (user.isAccountVerified) {
      return res.status(400).json({
        message: "Account already verified",
      });
    }

    console.log(user.email);
    

    const otp = String(Math.floor(Math.random() + 100000) * 900000);

    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = Date.now() + 5 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: `"Founder Flarelabs" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "Accountverification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message:"OTP send successfully"
    })
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    res.status(404).json({ message: "Invalid request" });
  }

  try {
    const user = await User.find(_id);

    if (!user) {
      return res.status(404).json({ message: "Account doesn't exist!" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (user.verifyOtpExpiresAt < Date.now()) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpiresAt = 0;

    await user.save();

    return res.status(200).json({
      message: `Account successfully verified`,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
