"use client";
import useTaskStore from "@/store";
import React, { useState } from "react";
import toast from "react-hot-toast";

const TaskForm = ({ onClose }) => {
  const { addTask, fetchData, user, totalDuration } = useTaskStore();

  const [taskData, setTaskData] = useState({
    taskName: "",
    taskDurationHours: "",
    taskDurationMinutes: "",
    taskUrgency: "medium",
    taskNote: "",
    userId: user.email,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "taskDurationHours" || name === "taskDurationMinutes") {
      // Validate that the input is a number
      if (!isNaN(value)) {
        // Convert the value to a number
        const numericValue = Number(value);

        // Validate the range based on the input name
        if (
          name === "taskDurationHours" &&
          numericValue >= 0 &&
          numericValue <= 24
        ) {
          setTaskData((prevData) => ({
            ...prevData,
            [name]: String(numericValue),
          }));
        } else if (
          name === "taskDurationMinutes" &&
          numericValue >= 0 &&
          numericValue <= 60
        ) {
          setTaskData((prevData) => ({
            ...prevData,
            [name]: String(numericValue),
          }));
        }
      }
    } else {
      // Update other inputs directly
      setTaskData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleAddTask = async () => {
    if (
      Number(taskData.taskDurationHours) * 60 +
        Number(taskData.taskDurationMinutes) +
        totalDuration >
      1440
    ) {
      return toast.error("Exceeding The day Limit Of Tasks!!!", {
        duration: 3000,
        style: {
          color: "black",
          background: "red",
        },
      });
    }
    // Add the new task to the global state
    addTask(taskData);

    // Reset form fields after capturing the data
    setTaskData({
      taskName: "",
      taskDurationHours: "", // <-- Use the correct property name
      taskDurationMinutes: "", // <-- Use the correct property name
      taskUrgency: "medium",
      taskNote: "",
    });
    // Close the modal

    try {
      const res = await fetch(`/api/createTask`, {
        method: "POST",
        body: JSON.stringify(taskData),
      });

      const data = await res.json();
      if (data.message === "Added new Task") {
        toast.success("Added new Task");
        fetchData();
        onClose();
      } else {
        toast.error("Failed to add task:", data.message);
        // Handle the case where adding the task failed
      }
    } catch (error) {
      toast.error("Error adding task:", error);
      // Handle the error from the fetch request
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded shadow-lg p-6 w-[80%] max-w-md">
      <h2 className="text-2xl font-bold mb-4">Add Task</h2>

      {/* Task Name */}
      <div className="mb-4">
        <label
          htmlFor="taskName"
          className="block text-sm font-semibold text-gray-600"
        >
          Task Name
        </label>
        <input
          type="text"
          id="taskName"
          name="taskName"
          value={taskData.taskName}
          onChange={handleInputChange}
          className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      {/* Task Duration */}
      <div className="mb-4">
        <label
          htmlFor="taskDurationHours"
          className="block text-sm font-semibold text-gray-600 mb-1"
        >
          Task Duration
        </label>
        <input
          type="number"
          id="taskDurationHours"
          name="taskDurationHours"
          value={taskData.taskDurationHours}
          onChange={handleInputChange}
          placeholder="Hours"
          className="w-1/2 px-4 py-2 border rounded-l-md focus:outline-none focus:border-blue-500"
          required
        />
        <input
          type="number"
          id="taskDurationMinutes"
          name="taskDurationMinutes"
          value={taskData.taskDurationMinutes}
          onChange={handleInputChange}
          placeholder="Minutes"
          className="w-1/2 px-4 py-2 border rounded-r-md focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      {/* Task Urgency */}
      <div className="mb-4">
        <label
          htmlFor="taskUrgency"
          className="block text-sm font-semibold text-gray-600"
        >
          Task Urgency
        </label>
        <select
          id="taskUrgency"
          name="taskUrgency"
          value={taskData.taskUrgency}
          onChange={handleInputChange}
          className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Task Note */}
      <div className="mb-4">
        <label
          htmlFor="taskNote"
          className="block text-sm font-semibold text-gray-600"
        >
          Task Note
        </label>
        <textarea
          id="taskNote"
          name="taskNote"
          value={taskData.taskNote}
          onChange={handleInputChange}
          className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
        ></textarea>
      </div>

      {/* Data Button */}
      <button
        type="button"
        onClick={handleAddTask}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
      >
        Add Task
      </button>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 cursor-pointer"
      >
        Close
      </button>
    </div>
  );
};

export default TaskForm;
