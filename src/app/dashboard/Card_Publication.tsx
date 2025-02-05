/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import Card_Profile from './Card_Profile';
import Image from 'next/image';
import CommentModal from './CommentModal';


export default function Card_Publication(
  {infoPublication, infoCreator, isLiked, onPressLike, onClickUser} : 
  {
    infoPublication : Publication,
    infoCreator: UserData,
    isLiked: boolean,
    onPressLike: (id: number, isLiked: boolean) => void,
    onClickUser: (uid: string) => void
  }) {

  const {contenido, emocion, likes, reposts, fechaPublicacion, id} = infoPublication;
  const [liked, setLiked] = useState(isLiked);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  
  return (
    <>
      {commentModalOpen && <CommentModal infoCreator={infoCreator} infoPublication={infoPublication} onClickClose={() => setCommentModalOpen(false)}/>}
        
      <article className='bg-white rounded-md w-[100%] text-black my-3'>
      <div className='p-3 '>
        <Card_Profile data={{name: infoCreator.nombreUsuario, img: infoCreator.avatarUrl as string, date: fechaPublicacion, emocion: emocion}} onClickUser={() => {
          onClickUser(infoCreator.uid);
        }}/>
        <p className='ml-2 mt-3'>{contenido}</p>
      </div>

      <div className='flex border-t border-gray-200 justify-around p-1'>
        <button className='flex text-black gap-1' onClick={() => {
          if (onPressLike !== undefined) onPressLike(id, isLiked as boolean);
          setLiked(!liked);
        }}>
          <Image
            src={liked ? "/like-fill.svg" : "/like-outline.svg"}
            alt="Un ícono SVG"
            width={20}
            height={20}
          />
          {likes}
        </button>
        <button className='flex text-black gap-1' onClick={() => setCommentModalOpen(true)}>
          <Image
            src="/images/comment.svg" // Ruta en la carpeta public
            alt="Un ícono SVG"
            width={24}
            height={24}
          />
          {reposts}
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
    </>

  )
}
