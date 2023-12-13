"use client";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TaskForm from "../../components/TaskForm";
import Task from "@/components/Task";
import useTaskStore from "@/store";
import { redirect } from "next/navigation";

const MyCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { deleteAllTasks, tasks, fetchData, user } = useTaskStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!user._id) {
      redirect("/");
    }
    setMounted(true);
  }, []);

  if (!mounted) {
    return "";
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <div className="flex p-6 mt-0">
      <div className="w-1/3 p-4 flex items-top justify-center">
        <Calendar
          onChange={onChange}
          value={date}
          className="shadow-2xl h-[350px]"
        />
      </div>

      <div className="flex-1 border-2 border-gray-300 p-2 flex h-full">
        <div className="w-1/2 flex-col justify-evenly h-full border-r-1 border-gray-300">
          {tasks && tasks.length < 1 ? (
            <div>
              <h1>No Items...</h1>
            </div>
          ) : (
            tasks.map((task) => <Task key={task._id} task={task} />)
          )}
        </div>

        {/* Right Content */}
        <div className="w-1/2 pl-4 flex-col justify-evenly h-full"></div>
      </div>

      {/* Plus sign button to open the modal */}
      <button
        onClick={openModal}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full cursor-pointer"
      >
        +
      </button>
      <button
        onClick={() => deleteAllTasks()}
        className="absolute top-4 right-20 text-red-500 cursor-pointer"
      >
        Delete All
      </button>

      {/* TaskForm modal */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <TaskForm onClose={closeModal} />
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
