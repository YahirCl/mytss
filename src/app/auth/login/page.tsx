"use client";

import React, { useState } from "react";
import Image from "next/image";
import Logo from "../../../../public/images/logo.png";
import Link from "next/link";
import MyInput from "../MyInput";
import { auth } from "../../../libs/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import LoadingTransparent from "@/app/LoadingTransparent";
import { useAuth } from "@/hooks/useAuth";

export default function Page() {
  const { setIsNewUser } = useAuth()

  const [formInfo, setFormInfo] = useState<RequiredFormFields>({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState<Record<keyof RequiredFormFields, ErrorFields>>({
    email: { error: false, msg: "" },
    password: { error: false, msg: "" },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  function validateForm(): Record<keyof RequiredFormFields, ErrorFields> {
    const errors: Record<keyof RequiredFormFields, ErrorFields> = {
      email: { error: false, msg: "" },
      password: { error: false, msg: "" },
    };

    if (!formInfo.email.trim()) {
      errors.email = { error: true, msg: "Ingrese su correo" };
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formInfo.email)) {
      errors.email = { error: true, msg: "El correo no es válido" };
    }

    if (!formInfo.password.trim()) {
      errors.password = { error: true, msg: "Ingrese su contraseña" };
    } else if (formInfo.password.length < 6) {
      errors.password = {
        error: true,
        msg: "La contraseña debe tener al menos 6 caracteres",
      };
    }

    return errors;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);

    const hasErrors = Object.values(errors).some((err) => err.error);
    if (hasErrors) return;

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(
        auth,
        formInfo.email,
        formInfo.password
      );
      setIsNewUser(true);
      console.log('Logueo del usuario completado');
      //router.replace("/dashboard");
    } catch (error) {
      setIsLoading(false);
      setLoginError("Credenciales incorrectas. Por favor, inténtelo de nuevo.");
      console.log(error);
    }
  }

  return (
    <>
      { isLoading && <LoadingTransparent />}
      <div className="bg-white min-h-screen flex justify-center items-center flex-col text-black">
        <Image src={Logo} alt="Logo" width={400} height={300} />

        <form className="flex flex-col" onSubmit={handleLogin}>
        <MyInput
            placeholder="Correo"
            value={formInfo.email}
            onChangeText={(e) => setFormInfo({ ...formInfo, email: e.target.value })}
            required={formErrors.email.error}
            errorMessage={formErrors.email.msg}
          />

          <MyInput
            placeholder="Contraseña"
            secureTextEntry={true}
            value={formInfo.password}
            onChangeText={(e) => setFormInfo({ ...formInfo, password: e.target.value })}
            required={formErrors.password.error}
            errorMessage={formErrors.password.msg}
          />


          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded mt-4"
          >
            Inicia sesión
          </button>
        </form>

        {loginError && <p className="text-red-500 mt-3">{loginError}</p>}

        <div className="flex flex-col items-center">
          <p className="text-black mt-5">
            ¿No tienes una cuenta?
            <Link href="/auth/register" className="text-blue-500">
              {" "}
              Regístrate
            </Link>
          </p>

          <div className="w-full h-[2px] bg-gray-200 my-2"/>

          <Link href="/auth/reset_password" className="text-blue-500 text-center">
            Olvide la contraseña
          </Link>
        </div>
        
      </div>
    </>
  );
}
