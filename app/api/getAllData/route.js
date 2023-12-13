import db from "@/db";
import Task from "@/models/taskSchema";
import UserModel from "@/models/userSchema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
  const body = await req.json();

  try {
    await db.connectDb();
    const tasks = await Task.find({ userId: body.userId });

    return NextResponse.json({ status: 200, data: tasks });
  } catch (error) {
    return NextResponse.json({ status: 505, data: error });
  } finally {
    db.disconnectDb();
  }
};
