/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import Card_Profile from './Card_Profile';
import Image from 'next/image';


export default function Card_Publication({info, isLiked, onPressLike} : {info : Publication, isLiked: boolean, onPressLike: (id: number, isLiked: boolean) => void}) {

  const {contenido, usuario, emocion, fechaPublicacion, id} = info;
  const [liked, setLiked] = useState(isLiked);
  
  return (
    <article className='bg-white rounded-md w-[60%] text-black my-3'>
      <div className='p-3 '>
        <Card_Profile name={usuario.nombreUsuario} img={usuario.avatarUrl as string} emocion={emocion} date={fechaPublicacion}/>
        <p className='ml-2 mt-3'>{contenido}</p>
      </div>

      <div className='flex border-t border-gray-200 justify-around p-1'>
        <button className='flex text-black gap-1' onClick={() => {
          onPressLike(id, isLiked);
          setLiked(!liked);
        }}>
          <Image
            src={liked ? "/like-fill.svg" : "/like-outline.svg"}
            alt="Un ícono SVG"
            width={20}
            height={20}
          />
          Like
        </button>
        <button className='flex text-black gap-1'>
          <Image
            src="/images/comment.svg" // Ruta en la carpeta public
            alt="Un ícono SVG"
            width={24}
            height={24}
          />
          Comentarios
        </button>
        <button className='flex text-black gap-1'>
          <Image
            src="/images/share.svg" // Ruta en la carpeta public
            alt="Un ícono SVG"
            width={24}
            height={24}
          />
          Compartir
        </button>
      </div>
    </article>
  )
}
