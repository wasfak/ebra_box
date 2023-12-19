import mongoose from "mongoose";
import { Schema, model, models } from "mongoose";

const taskSchema = new mongoose.Schema({
  date: {
    type: String,
    default: function () {
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, "0");
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const year = currentDate.getFullYear();
      return `${day}-${month}-${year}`;
    },
  },

  taskName: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
  },
  taskDurationHours: {
    type: String,
    required: true,
  },
  taskDurationMinutes: {
    type: String,
    required: true,
  },
  taskNote: {
    type: String,
  },
  taskUrgency: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;
