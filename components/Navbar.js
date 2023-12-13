import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between w-full h-16 p-6">
      <nav>
        <Link href="/">Home</Link>
      </nav>
      <nav>
        <Link href="/TaskPage">TaskPage</Link>
      </nav>
      <nav>About</nav>
    </header>
  );
}
