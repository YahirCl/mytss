/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { auth } from '@/libs/firebase-config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { BadgeCheck, OctagonAlert } from 'lucide-react';
import React, { useState } from 'react'

export default function page() {

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function submitEmail() {
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim())) {
      setError("Correo Invalido")
    } else {
      setLoading(true);
      setError("");
      setEmail("");

      sendPasswordResetEmail(auth, email)
      .then(() => {
        setTimeout(() => {
          setSent(true);
        }, 2000)
      });
    }
  }

  return (
    <main className='w-full h-screen bg-slate-100 flex justify-center items-center text-black'>
      <div className='w-2/4 h-1/3 bg-white rounded-lg p-4'>
        {sent ? (
          <div className='h-full flex flex-col justify-center items-center'>
            <div className='flex gap-1'>
              <BadgeCheck size={30}/>
              <h5 className='text-2xl'>Correo Enviado Correctamente</h5>
            </div>
            <div className='flex gap-1 mt-1'>
              <OctagonAlert color='#9ca3af' size={16}/>
              <p className='text-gray-400'>Revisa la bandeja de tu correo</p>
            </div>
          </div>
        ) : (
         (
          loading ? (
            <div role="status" className='w-full h-full flex justify-center items-center'>
              <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-300 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <div className='h-full flex flex-col items-center justify-center'>
              <h1 className='text-2xl font-bold text-center border-b border-gray-200 pb-2'>Restablecer Contraseña</h1>
  
              <h5 className='text-center my-4'>Ingresa tu correo electrónico. Se te enviara un correo para recuperar la contraseña</h5>
              <input
                className='w-1/2 p-2 outline-none border-2 rounded border-gray-400'
                placeholder='Correo electrónico'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
  
              {error && <p className='text-red-400 mt-3'>{error}</p>}
  
              <button
                  type="button"
                  disabled={email === ''}
                  onClick={submitEmail}
                  className={`w-1/2 text-white font-bold py-2 px-4 border-b-4 rounded mt-4 ${email !== '' ? 'bg-blue-500 hover:bg-blue-400  border-blue-700 hover:border-blue-500' : 'bg-gray-400 border-gray-600'}`}
                >
                  Enviar
                </button>
            </div>
          )
         ) 
        )}
      </div>
    </main>
  )
}
