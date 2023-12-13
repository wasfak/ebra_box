import UserModel from "@/models/userSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/db";
export async function POST(req, res) {
  const { email, password } = await req.json();

  try {
    // Ensure a secure connection to the database
    await db.connectDb();

    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (user) {
      const passwordMatch = await user.comparePassword(password);

      if (passwordMatch) {
        // Passwords match
        return NextResponse.json({
          status: 200,
          success: true,
          message: "Login successful!",
          user,
        });
      } else {
        // Passwords do not match
        return NextResponse.json({
          status: 401,
          success: false,
          message: "Wrong password!",
        });
      }
    } else {
      // If the user doesn't exist
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Something went wrong during login",
    });
  } finally {
    // Close the database connection
    await db.disconnectDb();
  }
}
