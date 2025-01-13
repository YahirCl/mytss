/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Card_Profile from './Card_Profile';

type PUB = {
    name: string;
    fecha: string;
    foto: string;
    content: string;
}

export default function Card_Publication({info} : {info : PUB}) {

  const {name, content, fecha, foto} = info;

  return (
    <article className='bg-white rounded-md w-[60%] text-black my-3'>
      <div className='p-3'>
        <Card_Profile name={name} date={fecha}/>
        <p>{content}</p>
      </div>

      <div className='flex border-t border-gray-200 justify-around p-1'>
        <button className='text-black'>👍Like</button>
        <button className='text-black'>💬Comentarios</button>
        <button className='text-black'>♻️Compartir</button>
      </div>
    </article>
  )
}
