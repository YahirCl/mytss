"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();

  console.log("Hola soy startPage, estoy afuera del useEffect");

  useEffect(() => {
    console.log("Hola soy startPage, en teoría cambio el estado de Auth");
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  }, [user, router]);

  //console.log(user?.uid);

  return (
    <div className="bg-white">
      <h1 className="text-black">Hola...</h1>
    </div>
  );
}
