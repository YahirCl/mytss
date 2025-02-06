/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import React, { useEffect, useRef, useState } from 'react'
import Header from '../../Header'
import ProtectedRoute from '../../ProtectedRoute'
import Card_Comment from '../Card_Comment'
import Card_Publication from '@/app/dashboard/Card_Publication'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { useRouter, useParams } from 'next/navigation';

export default function page() {
  const params = useParams();
  const router = useRouter();

  const { publication_id } = params;
  const { userData } = useAuth();

  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const textareaRef = useRef(null);

  const handleInput = (e) => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Restablece la altura para calcular correctamente
    textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta la altura según el contenido
    setComment(e.target.value);
  };

  useEffect(() => {
    async function getComments () {
      try {
        const res = await fetch(`/api/pub/comment?id=${publication_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const resJSON = await res.json();
        setComments(resJSON);
      } catch (error) {
        console.log(error);
      }
    };

    getComments();
  }, []);

  console.log(comments);
  
  return (
    <ProtectedRoute>
      <Header route='NON'/>
      <main className='bg-slate-100 h-screen flex justify-center'>
        <section className='bg-white w-2/4'> 
          <Card_Publication infoCreator={userData} infoPublication={{
            contenido: 'Natalia quintana es una tia que come mierda de burro cincelada',
            emocion: 'Enojo',
            fechaPublicacion: '12-12-12',
            id: 1,
            likes: 10,
            reposts: 10,
            usuario: userData as UserData,
            usuarioId: 10
            }}/>
          <div className='border border-grays-200 mt-[-12px]'/>

          <div className='border-b border-gray-200'>
            <div className='flex  p-4'>
              <Image
                alt='image-user'
                width={50}
                height={0}
                src={userData?.avatarUrl ? userData.avatarUrl : '/images/default-user.png'}
                className='rounded-full h-auto w-auto max-h-12'
              />
              <textarea
                placeholder="Escribe tu comentario..."
                ref={textareaRef}
                value={comment}
                onChange={handleInput}
                rows={1} // Altura inicial
                maxLength={280}
                className="w-full mb-4 resize-none rounded-xl bg-transparent p-3 text-black outline-none"
              />
            </div>
            <div className='flex justify-end pr-4 pb-4'>
              <button className={`px-4 py-2 rounded-full text-white ${
                    (comment !== '') ? 'bg-[#4B90E2] hover:bg-blue-500' : 'bg-gray-400 cursor-not-allowed'
                }`}
                onClick={() => {
                }}
                disabled={comment == ''}
                >
                Comentar
              </button>
            </div>
          </div>
          {comments.map((com, index) => {
            return (
              <Card_Comment
                key={index}
                infoComment={com} 
                infoCreator={com.usuario}
              />
            );
          })}
        </section>
      </main>
    </ProtectedRoute>
  )
}
