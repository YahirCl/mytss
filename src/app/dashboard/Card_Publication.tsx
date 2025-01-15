/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Card_Profile from './Card_Profile';


export default function Card_Publication({info} : {info : Publication}) {

  const {contenido, usuario} = info;

  return (
    <article className='bg-white rounded-md w-[60%] text-black my-3'>
      <div className='p-3'>
        <Card_Profile name={usuario.nombreUsuario} date={usuario.fechaRegistro}/>
        <p>{contenido}</p>
      </div>

      <div className='flex border-t border-gray-200 justify-around p-1'>
        <button className='text-black'>👍Like</button>
        <button className='text-black'>💬Comentarios</button>
        <button className='text-black'>♻️Compartir</button>
      </div>
    </article>
  )
}
