// taskStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTaskStore = create(
  persist(
    (set) => ({
      tasks: [],
      user: null,
      totalDuration: 0, // Add a property to store the total duration
      addTask: (newTask) => {
        set((state) => ({
          tasks: [...state.tasks, newTask],
          totalDuration: state.totalDuration + calculateTaskDuration(newTask),
        }));
      },
      updateTask: (taskId, updatedTask) =>
        set((state) => {
          const updatedTasks = state.tasks.map((task) =>
            task.taskId === taskId ? { ...task, ...updatedTask } : task
          );
          return {
            tasks: updatedTasks,
            totalDuration: calculateTotalDuration(updatedTasks),
          };
        }),
      deleteAllTasks: () => {
        set({ tasks: [], totalDuration: 0 });
        localStorage.clear();
      },
      fetchData: async () => {
        try {
          const user = useTaskStore.getState().user;

          if (!user || !user.email) {
            console.error("No user or email available");
            return;
          }

          const response = await fetch("/api/getAllData", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: user.email }),
          });

          if (!response.ok) {
            console.error("Failed to fetch data:", response.statusText);
            return;
          }

          const data = await response.json();
          const tasks = data.data;
          set({ tasks, totalDuration: calculateTotalDuration(tasks) });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      },
      setUser: (user) => set({ user }), // Ensure you use the argument here
      deleteUser: () => {
        set({ user: null, totalDuration: 0 });
        localStorage.clear();
      },
    }),
    {
      name: "task-store",
      getStorage: () => (typeof window !== "undefined" ? localStorage : null),
    }
  )
);

// Helper function to calculate the duration of a task
const calculateTaskDuration = (task) => {
  // Assuming taskDurationHours and taskDurationMinutes are strings
  const hours = parseInt(task.taskDurationHours, 10) || 0;
  const minutes = parseInt(task.taskDurationMinutes, 10) || 0;
  return hours * 60 + minutes;
};

// Helper function to calculate the total duration of all tasks
const calculateTotalDuration = (tasks) => {
  return tasks.reduce((total, task) => total + calculateTaskDuration(task), 0);
};

export default useTaskStore;
