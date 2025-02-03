import React from 'react'
import Image from 'next/image'

export default function SearchUserCard({data, onClick} : {data : ResultUser, onClick: (uid: string) => void}) {
  return (
    <li className='border-b-2 border-gray-200'>
      <div className='flex items-center gap-2 p-2 hover:bg-slate-100' onClick={() => {
        onClick(data.uid);
      }}>
        <Image
          alt='Imagen de usuario'
          width={60}
          height={60}
          src={data.avatarUrl ? data.avatarUrl : "/images/default-user.png"}
          className='rounded-full'
        />
        <h5 className='font-bold text-sm'>{data.nombreUsuario}</h5>
      </div> 
    </li>
  )
}
