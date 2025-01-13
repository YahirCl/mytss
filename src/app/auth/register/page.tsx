/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import React, { useState } from 'react'
import Image from 'next/image'
import Logo from '../../../../public/images/logo1.png'
import Link from 'next/link'
import MyInput from '../MyInput'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../../firebase-config';
import { useRouter } from 'next/navigation';

export default function page() {

  const router = useRouter();

  const [formInfo, setFormInfo] = useState<FormInfo>({
    username: "",
    email: "",
    password: "",
    repeatPassword: ""
  });
  
  const [formErrors, setFormErrors] = useState<Record<keyof FormInfo, FormErrors>>({
    username: {error: false, msg: ""},
    email: { error: false, msg: "" },
    password: { error: false, msg: "" },
    repeatPassword: {error: false, msg: ""}
  });

  function validateForm(): Record<keyof FormInfo, FormErrors> {
    const errors: Record<keyof FormInfo, FormErrors> = {
      username: {error: false, msg: ""},
      email: { error: false, msg: "" },
      password: { error: false, msg: "" },
      repeatPassword: {error: false, msg: ""}
    };

    if (!formInfo.username?.trim()) {
      errors.username = { error: true, msg: "Ingrese su nombre" };
    } else if (formInfo.username.length < 4) {
      errors.username = {
        error: true,
        msg: "El nombre debe de contener al menos 4 letras",
      };
    }

    if (!formInfo.email.trim()) {
      errors.email = { error: true, msg: "Ingrese su correo" };
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formInfo.email)) {
      errors.email = { error: true, msg: "El correo no es válido" };
    }

    if (!formInfo.password.trim()) {
      errors.password = { error: true, msg: "Ingrese su contraseña" };
    } else if (formInfo.password.length < 6) {
      errors.password = {error: true, msg: "La contraseña debe tener al menos 6 caracteres",
      };
    }

    if (!formInfo.repeatPassword?.trim()) {
      errors.repeatPassword = { error: true, msg: 'Repita su contraseña' };
    } else if (formInfo.repeatPassword !== formInfo.password) {
      errors.repeatPassword = { error: true, msg: 'Las contraseñas no coinciden'};
    }

    return errors;
  }
  
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);

    const hasErrors = Object.values(errors).some((err) => err.error);
    if (hasErrors) return;

    try {
      await createUserWithEmailAndPassword(auth,formInfo.email, formInfo.password);

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username: formInfo.username, photo: ""}),
      });
      const msg = await res.text();

      console.log(msg);

      alert("Cuenta creada correctamente");
      router.replace('../dashboard');
    } catch (error) {
      console.error(error);
    }
  }

  return( 
    <div className='bg-white min-h-screen flex justify-center items-center flex-col' >
      <Image
        src={Logo}
        alt='Hola'
        width={400}
        height={300} 
      />
       
      <form className='flex flex-col' onSubmit={handleRegister} >
        <MyInput
          placeholder="Nombre"
          value={formInfo.username}
          onChangeText={(e) => setFormInfo({ ...formInfo, username: e.target.value })}
          required={formErrors.username.error}
          errorMessage={formErrors.username.msg}
        />

        <MyInput
          placeholder="Correo"
          value={formInfo.email}
          onChangeText={(e) => setFormInfo({ ...formInfo, email: e.target.value })}
          required={formErrors.email.error}
          errorMessage={formErrors.email.msg}
        />
        <MyInput
          placeholder="Contraseña"
          secureTextEntry
          value={formInfo.password}
          onChangeText={(e) => setFormInfo({ ...formInfo, password: e.target.value })}
          required={formErrors.password.error}
          errorMessage={formErrors.password.msg}
        />
        <MyInput
          placeholder="Repetir Contraseña"
          secureTextEntry
          value={formInfo.repeatPassword}
          onChangeText={(e) => setFormInfo({ ...formInfo, repeatPassword: e.target.value })}
          required={formErrors.repeatPassword.error}
          errorMessage={formErrors.repeatPassword.msg}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        >
          Registrar
        </button>
      </form>

      <p className='text-black mt-5'>
        Ya tienes cuenta?
        <Link href="/auth/login"  className='text-blue-500'>Inicia sesión</Link>
      </p>
    </div>
  )
}
