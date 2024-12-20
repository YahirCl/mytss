'use client'

import React from 'react'
import ProtectedRoute from '../ProtectedRoute';
import Header from '../Header';

export default function page() {

  return (
    <ProtectedRoute>
      <Header/>
      <main className='flex flex-col items-center'>
        <section className='border-[1.8px] border-black p-5 rounded-md w-[60%] mt-5'>
          <input className='border-[1.8px] border-black p-3 rounded-md w-[100%] h-24'
            type="text"
            placeholder='¿Como te sientes?'
          />
          
          <div className='flex flex-row justify-between items-center'>
            <div className='h-20'>
              😀😑🤔🤕🥴🥳😨👽😧😬
            </div>

            <button className='bg-[#4B90E2] px-4 py-2 rounded-full text-white'>
              Publicar
            </button>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  )
}
