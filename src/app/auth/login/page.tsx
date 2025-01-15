"use client";

import React, { useState } from "react";
import Image from "next/image";
import Logo from "../../../../public/images/logo1.png";
import Link from "next/link";
import MyInput from "../MyInput";
import { auth } from "../../../../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";


export default function Page() {
  const router = useRouter();

  const [formInfo, setFormInfo] = useState<RequiredFormFields>({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState<Record<keyof RequiredFormFields, FormErrors>>({
    email: { error: false, msg: "" },
    password: { error: false, msg: "" },
  });

  const [loginError, setLoginError] = useState<string | null>(null);

  function validateForm(): Record<keyof RequiredFormFields, FormErrors> {
    const errors: Record<keyof RequiredFormFields, FormErrors> = {
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

    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        formInfo.email,
        formInfo.password
      );
      alert(
        "Usuario logeado correctamente: " + userCredentials.user.email
      );
      router.replace("/dashboard");
    } catch (error) {
      setLoginError("Credenciales incorrectas. Por favor, inténtelo de nuevo.");
    }
  }

  return (
    <div className="bg-white min-h-screen flex justify-center items-center flex-col">
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

      <p className="text-black mt-5">
        ¿No tienes una cuenta?
        <Link href="/auth/register" className="text-blue-500">
          {" "}
          Regístrate
        </Link>
      </p>
    </div>
  );
}
