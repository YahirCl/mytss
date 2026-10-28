"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Page() {
  const { user, userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // El administrador se revisa primero; antes nunca se llegaba a esta condición
    if (user && userData?.usuarioEspecial) {
      router.replace("/admin_panel")
    } else if (user && userData?.encuesta) {
      router.replace("/dashboard");
    } else if (user && !userData?.encuesta) {
      router.replace("/auth/form")
    } else  {
      router.replace("/auth/login");
    }
  }, [user, userData, router]);

  //console.log(user?.uid);

  return (
    <div className="bg-white">
      <h1 className="text-black">Hola...</h1>
    </div>
  );
}
