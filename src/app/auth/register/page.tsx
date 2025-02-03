/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import React, { useState } from 'react'
import Image from 'next/image'
import Logo from '../../../../public/images/logo.png'
import Link from 'next/link'
import MyInput from '../MyInput'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../libs/firebase-config';
import { useRouter } from 'next/navigation';
import LoadingTransparent from '@/app/LoadingTransparent';

export default function page() {

  const router = useRouter();

  const [formInfo, setFormInfo] = useState<RequiredFormFields & OthersFormFields>({
    username: "",
    fullname: "",
    email: "",
    password: "",
    repeatPassword: ""
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({
    username: {error: false, msg: ""},
    fullname: {error: false, msg: ""},
    email: { error: false, msg: "" },
    password: { error: false, msg: "" },
    repeatPassword: {error: false, msg: ""}
  });

  const [isLoading, setIsLoading] = useState(false);

  function validateForm(): FormErrors {
    const errors: FormErrors = {
      username: {error: false, msg: ""},
      fullname: {error: false, msg: ""},
      email: { error: false, msg: "" },
      password: { error: false, msg: "" },
      repeatPassword: {error: false, msg: ""}
    };

    if (!formInfo.username?.trim()) {
      errors.username = { error: true, msg: "Ingrese su nombre de usuario" };
    } else if (formInfo.username.length < 4) {
      errors.username = {
        error: true,
        msg: "SU usuario debe de contener al menos 4 letras",
      };
    }

    if (!formInfo.fullname?.trim()) {
      errors.fullname = { error: true, msg: "Ingrese su nombre completo" };
    } else if (formInfo.fullname.length < 10) {
      errors.fullname = {
        error: true,
        msg: "El nombre debe de contener al menos 10 letras",
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
      setIsLoading(true);
      const userData = await createUserWithEmailAndPassword(auth,formInfo.email, formInfo.password);

      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: userData.user.uid,
          nombreUsuario: formInfo.username,
          nombreCompleto: formInfo.fullname,
          email: formInfo.email,
        }),
      }); 
      
      if (!res.ok) {
        setIsLoading(false);
        throw new Error('Error al registrar los datos del usuario.');
      }

      console.log('Registro del usuario completado');
      
      // Asegurar que los datos estén listos antes de redirigir
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Pequeña espera opcional

      auth.signOut();
      router.replace('/auth/login');
    } catch (error) {
      console.error(error);
    }
  }

  return(
    <>
      { isLoading && <LoadingTransparent />}
      <div className='bg-white min-h-screen flex justify-center items-center flex-col' >
        <Image
          src={Logo}
          alt='Hola'
          width={400}
          height={300} 
        />
        
        <form className='flex flex-col' onSubmit={handleRegister} >
          <MyInput
            placeholder="Nombre de Usuario"
            value={formInfo.username}
            onChangeText={(e) => setFormInfo({ ...formInfo, username: e.target.value })}
            required={formErrors.username.error}
            errorMessage={formErrors.username.msg}
          />

          <MyInput
            placeholder="Nombre Completo"
            value={formInfo.fullname}
            onChangeText={(e) => setFormInfo({ ...formInfo, fullname: e.target.value })}
            required={formErrors.fullname.error}
            errorMessage={formErrors.fullname.msg}
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
    </>
    
  )
}
