import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log(`connected to db successfully`);
  } catch (err) {
    console.log("error connecting to database", err);
  }
};
