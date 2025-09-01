"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Auth/Auth"; // ✅ apne Auth hook ka import
import HomePage from "@/components/Home/Home";

const Page = () => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/dashboard"); // ✅ agar login hai to direct dashboard
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn) {
    // ✅ jabtak redirect ho raha hai tab kuch nahi dikhana
    return null;
  }

  return (
    <>
      <HomePage />
    </>
  );
};

export default Page;
