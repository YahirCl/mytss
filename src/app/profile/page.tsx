'use client';

import React from 'react'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Header from '../Header';
import ProtectedRoute from '../ProtectedRoute';
import Image from 'next/image';

export default function page() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<User>();

    useEffect(() => {
        async function getDataUser() {
          try {
            const res = await fetch(`/api/auth?uid=${user?.uid}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            setUserData(await res.json())
          } catch (error) {
            console.error(error);
          }
        }
        getDataUser();
      }, [user?.uid])
    
  return (
    <ProtectedRoute>
      <Header/>
      <main className='h-screen bg-slate-100' >
          <header className='h-[70vh] flex flex-col items-center bg-white'>
            <Image
              src = '/images/good.jpg'
              alt = 'Un ícono JPG'
              width = {1300}
              height = {200}
              className='w-[60%] h-[70%] rounded-b-xl'
            />
            <div className='flex flex-col w-[60%] h-[100%] px-5'>
              <div className='flex border-b-2 border-gray'>
                <Image
                  src = '/images/messirve.jpg'
                  alt = 'Un ícono JPG'
                  width = {180}
                  height = {180}
                  className='rounded-full mt-[-60px] mb-5'
                />
                <div className='p-5'>
                    <h1 className='text-4xl font-bold'>{userData?.nombreUsuario}</h1>
                    <div className='flex gap-5'>
                      <h5 className='text-gray-500'><span className='font-bold text-black'>60</span> Seguidores</h5>
                      <h5 className='text-gray-500'><span className='font-bold text-black'>35</span> Siguiendo</h5>
                    </div>
                </div>
              </div>
              <div className='h-[100%] px-5 flex gap-10 items-center '>
                <button className='font-bold text-gray-500'>Publicaciones</button>
                <button className='font-bold text-gray-500'>Información</button>
              </div>
            </div>
          </header>
      </main>
    </ProtectedRoute>
  )
}
