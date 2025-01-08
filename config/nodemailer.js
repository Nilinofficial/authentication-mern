import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: "gmail", // Use Gmail service
  port:587,
  secure:false,
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // App password
    debug: true, // Enable debug logs
    logger: true, // Log all activity
  },
});

export default transporter;
