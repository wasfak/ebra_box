"use client";
import { initFirebase } from "@/firebase";

import { useRouter } from "next/navigation";
import React from "react";
import { getCheckoutUrl } from "./stripePayments";
import { getPremiumStatus } from "./getStatus";

export default function Home() {
  const router = useRouter();
  const app = initFirebase();
  const handelPayment = async () => {
    const priceId = "price_1OOLakKtuWph5eI6xWTwMuFw";
    const checkOutUrl = await getCheckoutUrl(app, priceId);
    router.push(checkOutUrl);
  };

  const tryHandle = async () => {
    const status = await getPremiumStatus();
  };

  const handelTest = async () => {
    const res = await fetch("/api/getCustmores", {
      method: "GET",
    });
    const data = await res.json();
    const timestamp = "1702917270";
    const date2 = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds

    // Get the components of the date (year, month, day)
    const year = date2.getFullYear();
    const month = (date2.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const day = date2.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
  };

  return (
    <div>
      <h1>home page</h1>
      <button onClick={handelPayment}>upgrade to premium</button>
      <button onClick={handelTest}>Test</button>
    </div>
  );
}
