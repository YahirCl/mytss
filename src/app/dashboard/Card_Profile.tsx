/* eslint-disable @next/next/no-img-element */
import React from 'react'

type Props = {
    name: string;
    post_date: boolean;
}

export default function Card_Profile({name, post_date}: Props) {
  return (
    <div className='flex'>
      <img 
        alt="Image Profile" 
        src="https://i.pinimg.com/736x/0a/63/1d/0a631d43ccc073b54a6781f0c9f5aed2.jpg" // Reemplaza con tu URL
        width={50} 
        height={50} 
        style={{ borderRadius: '50%' }} // Opcional: estilos adicionales
      />
      <div className='ml-2 mt-1'>
        <p className='font-bold'>{name}</p>
        {post_date && <p className='font-bold text-gray-400 text-[14px]'>3h ago</p>}
      </div>
    </div>
  )
}
