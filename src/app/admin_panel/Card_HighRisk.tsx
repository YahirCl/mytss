import React from 'react'
import Card_Profile from '../dashboard/Card_Profile'
import emotions from '@/utils/Emotions'

export default function Card_HighRisk({data, onClick}: {data: Publication, onClick: (id: number) => void}) {

  const {id, contenido, emocion, fechaPublicacion, usuario} = data
  data.Emotion = emotions.find((e) => e.label === emocion) as Emotions;

  return (
    <div className="bg-gray-300 dark:bg-gray-700 p-4 rounded-lg">
      <div className='flex items-center'>
        <div className="flex flex-col w-full cursor-pointer" onClick={() => onClick(id)}>
            <Card_Profile data={{name: usuario.nombreUsuario, img: usuario.avatarUrl as string, date: fechaPublicacion, emotion: data.Emotion}}/>
            <p className="mt-2 text-gray-700 dark:text-gray-300">{contenido}</p>
        </div>
        <span className={`text-red-500 font-bold text-xl text-center`}>Riesgo Alto</span>
      </div>
    </div>
  )
}
