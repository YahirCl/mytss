import React, { useState } from 'react'
import Image from 'next/image'
import Card_Profile from './Card_Profile'
import { useAuth } from '@/hooks/useAuth'

export default function CommentModal({infoPublication, infoCreator, onClickClose}: {infoPublication : Publication, infoCreator: UserData, onClickClose: (pub: boolean) => void}) {

  const { userData } = useAuth();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  async function createComment() {
    try {
      const res = await fetch('/api/pub/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: userData?.id,
          publicationID: infoPublication.id,
          content: comment,
        }),
      });

      res.json()
        .then((data) => {
          console.log(data.msg);
          onClickClose(res.ok)
      });

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl w-1/3 animate-fadeIn">
        <div className="px-6 py-4 border-b">
          <button onClick={() => onClickClose(false)}>
            <Image
                alt='Close-Icon'
                width={30}
                height={30}
                src={'/images/close-outline.svg'}
            />
          </button>

          <Card_Profile data={{img: infoCreator.avatarUrl as string, name: infoCreator.nombreUsuario, date: infoPublication.fechaPublicacion, emocion: infoPublication.emocion}}/>
          <p className='pb-4 border-gray-400 border-b-[0.5px]'>{infoPublication.contenido}</p>

          <div className='flex mt-4'>
            <Image
              alt='image-user'
              width={50}
              height={0}
              src={userData?.avatarUrl ? userData.avatarUrl : '/images/default-user.png'}
              className='rounded-full h-auto w-auto max-h-12'
            />
            <textarea
              placeholder='Escribe tu comentario'
              maxLength={250}
              className="w-full h-24 mb-4 resize-none rounded-xl bg-transparent p-3 text-sm text-black outline-none"
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className='flex justify-end'>
            <button className={`px-4 py-2 rounded-full text-white ${
                (comment !== '' && !loading) ? 'bg-[#4B90E2] hover:bg-blue-500' : 'bg-gray-400 cursor-not-allowed'
              }`}
              onClick={() => {
                setLoading(true);
                createComment();
              }}
              disabled={comment == ''}
              >
              {loading ? 'Cargando...' : 'Comentar'}
            </button>
          </div>
          
        </div>
      </div>   
    </div>
  )
}
