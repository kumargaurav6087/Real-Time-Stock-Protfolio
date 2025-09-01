"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../Auth/Auth";
import { toast } from "react-toastify";

const Logout = () => {
  const router = useRouter();
  const { LogoutUser } = useAuth();

  useEffect(() => {
    LogoutUser();
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
    router.push("/login");
  }, [router]);

  return <p>Logging out......</p>;
};

export default Logout;
