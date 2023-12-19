"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { initFirebase } from "@/firebase";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import useTaskStore from "@/store";

// Initialize Firebase
const app = initFirebase();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { deleteUser, fetchData, deleteAllTasks, setUser, user } =
    useTaskStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      try {
        if (authUser) {
          const { photoURL, email, displayName } = authUser;
          setUser({
            img: photoURL || "/default-profile-image.jpg",
            email,
            displayName,
          });
          fetchData();
        } else {
          setUser({
            img: "",
            email: "",
            displayName: "",
          });
        }
      } catch (error) {
        console.error("Error in onAuthStateChanged:", error);
      }
    });

    return () => unsubscribe();
  }, [auth, setUser, fetchData, mounted]);
  if (!mounted) {
    return "";
  }
  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { photoURL, email, displayName } = result.user;

      setUser({
        img: photoURL || "/default-profile-image.jpg",
        email,
        displayName,
      });
      fetchData();
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        console.error("Popup closed by user. Please try again.");
      } else {
        console.error("An error occurred during sign-in:", error);
      }
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      deleteAllTasks();
      deleteUser();
      router.push("/");
      setShowDropdown(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleProfileSettings = () => {
    console.log("clicked");
  };

  return (
    <header className="flex items-center justify-between min-w-screen bg-[#459c98] text-white">
      <Image
        src="/logo.png"
        alt="logo"
        width={64}
        height={64}
        className="ml-8"
      />
      <div className="flex items-center justify-between w-[240px]">
        <nav>
          <Link href="/">Home</Link>
        </nav>
        <nav>
          <Link href="/TaskPage">Tasks</Link>
        </nav>
        <nav>
          <Link href="/Contact">Contact</Link>
        </nav>
      </div>
      <div className="mr-8 relative">
        {user && user.email ? (
          <div className="relative">
            <div className="flex items-center justify-content">
              <p className="mr-2">{user.displayName}</p>
              <div
                className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                onClick={toggleDropdown}
              >
                <Image src={user.img} alt="user" width={100} height={100} />
              </div>
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-md">
                <button
                  className="block w-full text-left px-4 text-sm py-2 text-gray-800 hover:bg-gray-200"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
                <button
                  className="block w-full text-left text-sm px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={handleProfileSettings}
                >
                  Profile Settings
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="flex items-center justify-center rounded-xl bg-black text-white p-2"
            onClick={signIn}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
