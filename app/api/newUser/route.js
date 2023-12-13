import db from "@/db";
import UserModel from "@/models/userSchema";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const { email, password } = await req.json();

  try {
    // Ensure a secure connection to the database
    await db.connectDb();

    // Check if a user with the same email already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return NextResponse.json({
        status: 409, // Conflict status code
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash the password before storing it in the database
    /*   const hashedPassword = await bcrypt.hash(password, 10); */

    // Create a new user with the hashed password
    const newUser = await UserModel.create({
      email,
      password,
      // Other user properties...
    });

    await newUser.save();

    return NextResponse.json({
      status: 200, // Created status code
      success: true,
      message: "User created successfully!",
      user: newUser,
    });
  } catch (error) {
    console.error("Error during user creation:", error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Something went wrong during user creation",
    });
  } finally {
    // Close the database connection
    await db.disconnectDb();
  }
}
