/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { format } from "date-fns";

type Props = {
    name: string | undefined;
    img: string;
    emocion?: string;
    date?: string;
}

const emociones = new Map<string, string>([
  ["Alegría", "😊"],
  ["Miedo", "😨"],
  ["Enojo", "😡"],
  ["Asco", "🤢"],
  ["Tristeza profunda", "😭"],
  ["Tristeza", "😢"],
  ["Sorprendido", "😲"],
]);



export default function Card_Profile({data, onClickUser}: {data : Props, onClickUser?: (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => void}) {
  const {name, img, date, emocion} = data
  return (
    <div className='flex'>
      <img 
        alt="Image Profile" 
        src={img ? img : '/images/default-user.png'} // Reemplaza con tu URL
        width={50} 
        height={50} 
        style={{ borderRadius: '50%' }} // Opcional: estilos adicionales
      />
      <div className='ml-2 mt-1'>
        <div className='flex items-center'>
          <p className='font-bold hover:underline cursor-pointer' onClick={onClickUser}>{name}</p>
          {emocion && <span className='bg-blue-100 px-3 ml-2 py-1 rounded-full text-sm'>{emociones.get(emocion)} {emocion}</span>}
        </div>
        {date && <p className='font-bold text-gray-400 text-[14px]'>{format(date, "dd/MM/yyyy")}</p>}
      </div>
    </div>
  )
}
