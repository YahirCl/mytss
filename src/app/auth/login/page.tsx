"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Logo from '../../../../public/images/logo1.png'
import Link from 'next/link'
import MyInput from '../MyInput'
import { auth } from '../../../../firebase-config'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function page() {

  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  console.log(auth.currentUser?.email)
  
  async function handleLogin() {
    try{
      console.log(email);
      console.log(password);
      await signInWithEmailAndPassword(auth, email, password);
      alert("Inicio de sesión exitoso");
      router.replace('/dashboard')
      // Aquí podrías redirigir al usuario a otra página si el inicio de sesión es exitoso
      // Por ejemplo, usando router.push('/dashboard')

    } catch {
      console.error("Soy un error ayuda");
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
       
      <form className='flex flex-col'>
        <MyInput placeholder='Correo' required onChangeText={(e) => setEmail(e.target.value)}/>
        
        <MyInput placeholder='Contraseña' required onChangeText={(e) => setPassword(e.target.value)}/>
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          onClick={handleLogin}
        >
          Inicia sesión
        </button>
      </form>
        
      <p className='text-black mt-5'>
        No tienes una cuenta?
        <Link href="/auth/register" className='text-blue-500'> Regístrate</Link>
      </p>
    </div>
  )
}
