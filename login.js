import db from "@/db";
import UserModel from "@/models/userSchema";

export default async function handler(req, res) {
  const { email, password } = req.body;

  try {
    // Ensure a secure connection to the database
    await db.connectDb();

    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (user) {
      // Compare the provided password with the stored password
      if (user.password === password) {
        // Passwords match
        return res.status(200).json({
          success: true,
          message: "Login successful!",
          user,
        });
      } else {
        // Passwords do not match
        return res.status(401).json({
          success: false,
          message: "Wrong password!",
        });
      }
    } else {
      // If the user doesn't exist
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during login",
    });
  } finally {
    // Close the database connection
    await db.disconnectDb();
  }
}
