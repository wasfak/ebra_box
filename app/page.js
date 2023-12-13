"use client";

import useTaskStore from "@/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setIsLoading] = useState();
  const { deleteUser, fetchData, deleteAllTasks } = useTaskStore();
  const user = useTaskStore((store) => store.user);

  const router = useRouter();

  useEffect(() => {
    deleteAllTasks();
    deleteUser();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!email || !password) {
        toast.error("Please enter email and password", {
          duration: 3000,
          style: {
            color: "black",
            background: "red",
          },
        });
        setIsLoading(false);
      } else {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        switch (data.status) {
          case 200:
            // Login successful
            // Redirect or handle as needed
            useTaskStore.setState({ user: data.user });
            fetchData();
            router.push("/TaskPage");
            break;

          case 401:
            // Incorrect password
            toast.error("Wrong password!", {
              duration: 3000,
              style: {
                color: "black",
                background: "red",
              },
            });
            setPassword(""); // Clear the password field
            break;

          case 500:
            // Server-side error
            console.error("Error during login:", data.message);
            toast.error("An unexpected error occurred", {
              duration: 3000,
              style: {
                color: "black",
                background: "red",
              },
            });
            break;

          default:
            // User not found or other cases
            toast.error(data.message || "Login failed", {
              duration: 3000,
              style: {
                color: "black",
                background: "red",
              },
            });
            break;
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An unexpected error occurred", {
        duration: 3000,
        style: {
          color: "black",
          background: "red",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center h-screen">
        <div className=" p-6 mt-12 rounded-2xl border shadow-2xl w-[400px] h-[400px] flex flex-col justify-center items-center">
          <h1>home page</h1>
          <form className="w-full max-w-md " onSubmit={handleLogin}>
            <div className="mb-4 ">
              <label htmlFor="id" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                type="text"
                id="id"
                value={email}
                onChange={(event) => setId(event.target.value)}
                className="w-full p-2 border rounded border-gray-300 focus:outline-none focus:border-black"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full p-2 border rounded border-gray-300 focus:outline-none focus:border-black"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="bg-[#b6373e] text-white p-2 rounded w-full mb-6"
            >
              {loading ? "Logging" : "Login"}
            </button>
          </form>
          <button onClick={() => router.push("/create")}>Sign Up</button>
        </div>
      </div>
    </>
  );
};

export default Login;
