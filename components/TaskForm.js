"use client";
import useTaskStore from "@/store";
import React, { useState } from "react";

const TaskForm = ({ onClose }) => {
  const { addTask, fetchData, user } = useTaskStore();
  const [taskData, setTaskData] = useState({
    taskName: "",
    taskDuration: "",
    taskUrgency: "medium",
    taskNote: "",
    userId: user._id,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddTask = async () => {
    // Add the new task to the global state
    addTask(taskData);

    // Reset form fields after capturing the data
    setTaskData({
      taskName: "",
      taskDuration: "",
      taskUrgency: "medium",
      taskNote: "",
    });

    // Close the modal

    const url = process.env.WEBSITE_URL;

    try {
      const res = await fetch(`${url}/api/createTask`, {
        method: "POST",
        body: JSON.stringify(taskData),
      });

      const data = await res.json();
      if (data.message === "Added new Task") {
        fetchData();
        onClose();
      } else {
        console.error("Failed to add task:", data.message);
        // Handle the case where adding the task failed
      }
    } catch (error) {
      console.error("Error adding task:", error);
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
          htmlFor="taskDuration"
          className="block text-sm font-semibold text-gray-600"
        >
          Task Duration
        </label>
        <input
          type="text"
          id="taskDuration"
          name="taskDuration"
          value={taskData.taskDuration}
          onChange={handleInputChange}
          className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:border-blue-500"
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
