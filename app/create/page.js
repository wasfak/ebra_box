"use client";

import useTaskStore from "@/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setIsLoading] = useState();
  const { setUser, user } = useTaskStore;

  const router = useRouter();
  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!email || (!password && !loading)) {
        toast.error("Please enter email and password", {
          duration: 3000,
          style: {
            color: "black",
            background: "red",
          },
        });
      } else {
        const res = await fetch("/api/newUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.status === 200) {
            useTaskStore.setState({ user: data.user });
            toast.success("Email created successfully");
            router.push("/");
          } else {
            toast.error(data.message, {
              duration: 3000,
              style: {
                color: "black",
                background: "red",
              },
            });
          }
        } else {
          toast.error("Something went wrong with the request", {
            duration: 3000,
            style: {
              color: "black",
              background: "red",
            },
          });
        }
      }
    } catch (error) {
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
          <h1>sign up page</h1>
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
              {loading ? "Processing" : "Sign up"}
            </button>
          </form>
          <button onClick={() => router.push("/")}>sign in</button>
        </div>
      </div>
    </>
  );
};

export default Login;
