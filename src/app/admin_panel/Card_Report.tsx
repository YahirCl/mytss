import React from 'react'
import Card_Profile from '../dashboard/Card_Profile'
import emotions from '@/utils/Emotions'
import classNames from "classnames";

export default function Card_Report({data, onClick}: {data: Publication, onClick: (id: number) => void}) {

  const {id, contenido, emocion, fechaPublicacion, alertas, nivelVacio, usuario} = data
  data.Emotion = emotions.find((e) => e.label === emocion) as Emotions;

  const bgColor = classNames({
    "bg-green-400": nivelVacio === "bueno",
    "bg-yellow-300": nivelVacio === "llamado de atención",
    "bg-red-400": nivelVacio === "alerta de vacío existencial",
  });

  return (
    <div className="bg-gray-300 dark:bg-gray-700 p-4 rounded-lg">
      <div className='flex'>
      <div className="flex flex-col w-full cursor-pointer" onClick={() => onClick(id)}>
        <Card_Profile data={{name: usuario.nombreUsuario, img: usuario.avatarUrl as string, date: fechaPublicacion, emotion: data.Emotion}}/>
        <p className="mt-2 text-gray-700 dark:text-gray-300">{contenido}</p>
      </div>

      <div className='flex flex-col items-center'>
          <div className={`${bgColor} w-5 h-5 rounded-full`}/>
          <span className={'font-bold mt-5'}>Reportes</span>
          <span className={'font-bold'}>{alertas}</span>
        </div>
      </div> 
    </div>
  )
}
