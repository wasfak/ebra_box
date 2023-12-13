import mongoose from "mongoose";

const connection = {};
// Multer configuration for handling file uploads

async function connectDb() {
  if (connection.isConnected) {
    console.log("Already connected to the DB");
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log("Use previous connection to the DB");
      return;
    }
    await mongoose.disconnect();
  }
  const db = await mongoose.connect(process.env.MONGODB_URL);
  console.log("New Connection to DB...!!!!");
  connection.isConnected = db.connections[0].readyState;
}

async function disconnectDb() {
  if (connection.isConnected) {
    if (process.env.NODE_END === "production") {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log("not disconnecting from the DB");
    }
  }
}

const db = { connectDb, disconnectDb };

export default db;
