/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import Card_Profile from './Card_Profile';
import Image from 'next/image';
import CommentModal from './CommentModal';
import { useRouter } from 'next/navigation';


export default function Card_Publication(
  {infoPublication, infoCreator, isLiked, onPressLike, onClickUser} : 
  {
    infoPublication : Publication,
    infoCreator: UserData,
    isLiked: boolean,
    onPressLike: (id: number, isLiked: boolean) => Promise<boolean>,
    onClickUser: (uid: string) => void
  }) {

  const router = useRouter();
  const {contenido, emocion, fechaPublicacion, id} = infoPublication;
  const [comments, setComments] = useState(infoPublication.reposts);
  const [likes, setLikes] = useState(infoPublication.likes);

  const [liked, setLiked] = useState(isLiked);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  
  return (
    <>
      {commentModalOpen && <CommentModal infoCreator={infoCreator} infoPublication={infoPublication} onClickClose={(pub) => {
        if(pub) setComments((prev) => prev+1);
        setCommentModalOpen(false);
      }}/>}
        
      <article className='bg-white rounded-md w-[100%] text-black my-3' onClick={() => router.push('hola', {})}>
      <div className='p-3 '>
        <Card_Profile data={{name: infoCreator.nombreUsuario, img: infoCreator.avatarUrl as string, date: fechaPublicacion, emocion: emocion}} onClickUser={() => {
          onClickUser(infoCreator.uid);
        }}/>
        <p className='ml-2 mt-3'>{contenido}</p>
      </div>

      <div className='flex border-t border-gray-200 justify-around py-2'>
        <button className='flex text-black gap-1' onClick={async () => {
          const success = await onPressLike(id, liked as boolean);
          if (success) {
            setLiked(!liked);
            setLikes(liked ? likes-1 : likes+1);
          }
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
          {comments}
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
