"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Page() {
  const { user, userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && userData?.encuesta) {
      router.replace("/dashboard");
    } else if (user && !userData?.encuesta) {
      router.replace("/auth/form")
    } else if (user && userData?.usuarioEspecial) {
      router.replace("/admin_panel")
    } else  {
      router.replace("/auth/login");
    }
  }, [user, router]);

  //console.log(user?.uid);

  return (
    <div className="bg-white">
      <h1 className="text-black">Hola...</h1>
    </div>
  );
}
