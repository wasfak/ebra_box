import React, { useState, useEffect } from "react";
import { GiPencil } from "react-icons/gi";
import TaskUpdateForm from "../components/TaskUpdateForm";

export default function Task({ task, onEdit }) {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative my-3 flex flex-col items-center justify-center border-2 text-black p-2 rounded-md">
      <div className="flex items-center justify-between w-full">
        <h2 className="">Task: {task.taskName}</h2>
        <div
          className="flex items-center cursor-pointer"
          onClick={handleEditClick}
        >
          <GiPencil className="" />
          <h2 className="ml-2 ">Edit</h2>
        </div>
      </div>
      <div className="flex items-center justify-between w-full mt-2">
        <span className="">Urgency: {task.taskUrgency}</span>
        {/* <span className="mr-24">Duration: {task.taskDuration}</span> */}
        {Number(task.taskDurationHours) >= 1 ? (
          <span className="mr-12">
            Duration:{" "}
            {Number(task.taskDurationHours) > 1
              ? `${task.taskDurationHours} Hours ${task.taskDurationMinutes} minute`
              : `1 Hour ${task.taskDurationMinutes} minute`}
          </span>
        ) : (
          <span className="mr-12">
            Duration: {task.taskDurationMinutes} minute
          </span>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-4">
            <TaskUpdateForm
              task={task}
              onUpdate={onEdit}
              onCancel={handleCloseEditModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
