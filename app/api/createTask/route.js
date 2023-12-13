import db from "@/db";
import Task from "@/models/taskSchema";

import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await db.connectDb();

    const body = await req.json();
    const { taskName, taskDuration, taskUrgency, taskNote, userId } = body;

    const newTask = new Task({
      taskName,
      taskDuration,
      taskUrgency,
      taskNote,
      userId,
    });

    await newTask.save();

    return NextResponse.json({ status: 200, message: "Added new Task" });
  } catch (error) {
    return NextResponse.json({ status: 500, message: error.message });
  } finally {
    db.disconnectDb();
  }
};
