import { Schema, model, models } from "mongoose";

import { genSalt, compare, hash } from "bcrypt";

// Define the schema for users
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subscribed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  try {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) return next();

    // Generate a salt
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);

    // Hash the password with the salt

    return next();
  } catch (error) {
    throw error;
  }
});

userSchema.methods.comparePassword = async function (password) {
  try {
    return await compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

// Create the User model
const UserModel = models.User || model("User", userSchema);

export default UserModel;
