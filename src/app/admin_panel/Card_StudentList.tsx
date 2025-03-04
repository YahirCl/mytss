import React from 'react'
import Image from 'next/image'

export default function Card_StudentList({data, onClick} : {data: Poll, onClick: (uid: string) => void}) {

  const {puntajeDesesperanza, riesgoAlto, usuario} = data

  return (
    <div className="flex items-center bg-gray-300 dark:bg-gray-700 p-4 rounded-lg justify-between">
      <div className="flex items-center space-x-4 cursor-pointer" onClick={() => onClick(usuario.uid)}>
        <Image 
            src={ usuario.avatarUrl ? usuario.avatarUrl : "/images/default-user.png"}
            alt="Un ícono SVG"
            width={35}
            height={35}
            className='rounded-full'
        />
        <span className="font-semibold">{usuario.nombreUsuario}</span>
        </div>
        <div className='flex flex-col items-center'>
        {riesgoAlto && <span className="text-red-500 font-bold">Riesgo Alto</span>}
        <span className="text-white-600 dark:text-white-400 font-bold">{`Desesperanza: ${puntajeDesesperanza}pts`}</span>
      </div>
    </div>
  )
}
