/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import Header from '../Header';
import ProtectedRoute from '../ProtectedRoute';
import Image from 'next/image';
import Modal  from './Modal';

export default function page() {
  const { userData } = useAuth();

  return (
    <ProtectedRoute>
      <Header/>
      <main className='h-screen bg-slate-100' >
          <header className='h-[70vh] flex flex-col items-center bg-white'>
            <Image
              src={userData?.coverUrl as string} 
              alt='Imagen de fondo de perfil'
              width={1300}
              height={200}
              className='w-[60%] h-[70%] rounded-b-xl min-h-[70%]'
            />
            <div className='flex flex-col w-[60%] h-[100%] px-5'>
              <div className='flex border-b-2 border-gray'>
                <Image
                  src={userData?.avatarUrl as string} // Nombre público de la imagen en Cloudinary
                  alt="Imagen de Usuario"
                  width={210}
                  height={0}
                  className='rounded-full mt-[-60px] mb-5 max-h-44'
                />
                <div className='p-5 w-full'>
                    <h1 className='text-4xl font-bold'>{userData?.nombreUsuario}</h1>
                    <div className='flex gap-5'>
                      <h5 className='text-gray-500'><span className='font-bold text-black'>60</span> Seguidores</h5>
                      <h5 className='text-gray-500'><span className='font-bold text-black'>35</span> Siguiendo</h5>
                      <div className='w-full flex justify-end'>
                        <Modal/>
                      </div>
                    </div>
                </div>
              </div>
              <div className='h-[100%] px-5 flex gap-10 items-center '>
                <button className='font-bold text-blue-400 border-blue-400 border-b-4 h-full'>Publicaciones</button>
                <button className='font-bold text-gray-500'>Información</button>
              </div>
            </div>
          </header>
          
      </main>
    </ProtectedRoute>
  )
}
