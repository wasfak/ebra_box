// taskStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTaskStore = create(
  persist(
    (set) => ({
      tasks: [],
      user: null,
      addTask: (newTask) => {
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },
      updateTask: (taskId, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.taskId === taskId ? { ...task, ...updatedTask } : task
          ),
        })),
      deleteAllTasks: () => {
        set({ tasks: [] }); // Clear the tasks in the state
        localStorage.clear(); // Clear the entire localStorage
      },
      fetchData: async () => {
        try {
          const user = useTaskStore.getState().user;

          if (!user) {
            console.error("No user available");
            return;
          }

          const response = await fetch("/api/getAllData", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: user._id }),
          });

          if (!response.ok) {
            console.error("Failed to fetch data:", response.statusText);
            return;
          }

          const data = await response.json();
          set({ tasks: data.data });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      },
      setUser: (user) => set({ user }),
      deleteUser: () => set({ user: [] }),
    }),
    {
      name: "task-store",
      getStorage: () => (typeof window !== "undefined" ? localStorage : null),
    }
  )
);

export default useTaskStore;
