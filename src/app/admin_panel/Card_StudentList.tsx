import React from 'react'
import Image from 'next/image'
import classNames from 'classnames';

export default function Card_StudentList({data, onClick} : {data: Poll, onClick: (uid: string) => void}) {

  const {puntajeDesesperanza, riesgoAlto, usuario} = data

  const riskColor = classNames({
    "text-green-400": puntajeDesesperanza < 5,
    "text-yellow-300": puntajeDesesperanza >= 5 && puntajeDesesperanza < 10,
    "text-red-400": puntajeDesesperanza >= 10,
  });

  return (
    <div className="flex items-center bg-gray-300 dark:bg-gray-700 p-4 rounded-lg justify-between">
      <div className="flex items-center space-x-4 cursor-pointer" onClick={() => onClick(usuario.uid)}>
        <Image 
            src={usuario.avatarUrl || "/images/default-user.png"}
            alt="Un ícono SVG"
            width={35}
            height={35}
            className='rounded-full w-12 h-12 object-cover'
        />
        <span className="font-semibold">{usuario.nombreUsuario}</span>
        </div>
        <div className='flex flex-col items-center'>
        {riesgoAlto && <span className={`${riskColor} font-bold `}>Riesgo {riskColor.split('-')[1] === 'green' ? 'Bajo' : riskColor.split('-')[1] === 'yellow' ? 'Medio' : 'Alto'}</span>}
        <span className="text-white-600 dark:text-white-400 font-bold">{`Desesperanza: ${puntajeDesesperanza}pts`}</span>
      </div>
    </div>
  )
}
