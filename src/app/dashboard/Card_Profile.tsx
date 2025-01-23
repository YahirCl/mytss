/* eslint-disable @next/next/no-img-element */
import React from 'react'

type Props = {
    name: string | undefined;
    img: string | undefined | null;
    date?: string;
}

export default function Card_Profile({name, img, date}: Props) {
  return (
    <div className='flex'>
      <img 
        alt="Image Profile" 
        src={img ? img : '/images/profile-round-1342-svgrepo-com.svg'} // Reemplaza con tu URL
        width={50} 
        height={50} 
        style={{ borderRadius: '50%' }} // Opcional: estilos adicionales
      />
      <div className='ml-2 mt-1'>
        <p className='font-bold'>{name}</p>
        {date && <p className='font-bold text-gray-400 text-[14px]'>{date}</p>}
      </div>
    </div>
  )
}
