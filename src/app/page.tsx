"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/login");
    } else {
      router.push("/auth/login");
    }
  }, [user, router]);

  return (
    <div className="bg-white">
      <h1 className="text-black">Hola...</h1>
    </div>
  );
}
