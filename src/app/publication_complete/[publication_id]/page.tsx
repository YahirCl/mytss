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
import Loading from '@/app/Loading'
import ConfirmationModal from '@/app/ConfirmationModal'

export default function page() {
  const params = useParams();
  const router = useRouter();

  const { publication_id } = params;
  const { userData } = useAuth();

  const [publication, setPublication] = useState<Publication>();
  const [comment, setComment] = useState("");
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean, texts: {txtBtn: string, title: string, msg: string}, resolve: (value: boolean) => void } | null>(null);
  const [loading, setLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (textarea) { // Asegúrate de que la referencia no sea null
    textarea.style.height = "auto"; // Restablece la altura para calcular correctamente
    textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta la altura según el contenido
  }
    setComment(e.target.value);
  };

  async function createComment() {
    try {
      const res = await fetch('/api/pub/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: userData?.id,
          publicationID: parseInt(publication_id as string),
          content: comment,
        }),
      });

      res.json()
        .then((data) => {
          //console.log(data.comment);
          data.comment.usuario = userData;
          setPublication({...publication as Publication, reposts: (publication?.reposts as number  + 1), comentarios: [...publication?.comentarios as CommentT[], data.comment]});
          setComment('');
          setLoading(false);
      });

    } catch (error) {
      console.log(error);
    }
  }

  async function deleteComment(id: number) {
    const confirmed = await showModal({txtBtn: 'Si, Borrar', msg: '¿Estás seguro de que deseas borrar este comentario?', title: 'Confirmar Eliminación'});
    //setModalConfig(null);
    if (confirmed) {
      try {
        const res = await fetch('/api/pub/comment', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            commentId: id,
            pubId: parseInt(publication_id as string)
          }),
        });
  
        if (res.ok) {
          setPublication({...publication as Publication, reposts: (publication?.reposts as number  - 1)})
        } 
        return res.ok
  
      } catch (error) {
        console.log(error);
        return false;
      }
    } else {
      return false
    }
  };

  function showModal(texts: {txtBtn: string, title: string, msg: string}): Promise<boolean> {
    return new Promise((resolve) => {
      setModalConfig({ isOpen: true, texts, resolve });
    });
  }

  useEffect(() => {
    async function getComments () {
      try {
        const res = await fetch(`/api/pub/comment?id=${publication_id}&yourId=${userData?.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();

        if (Object.keys(data).length === 0) {
          router.replace('/NoFoundedPublication')
        } else {
          setPublication(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getComments();
  }, []);

  if (publication === undefined) {
    return <Loading />

  } else {
    return (
      <ProtectedRoute>
        <Header route='NON'/>
        <main className='bg-slate-100 h-screen flex justify-center'>
          <section className='bg-white w-2/4'> 
            <Card_Publication 
              infoCreator={publication.usuario as UserData}
              infoPublication={publication as Publication}
              isLiked={publication.interacciones?.includes("LIKE") as boolean}
              isAlerted={publication.interacciones?.includes("ALERT") as boolean}
              showOptionsBtn={publication.usuario.uid === userData?.uid}
              onPressDelete={showModal}
              onPressAlert={(alerted) => showModal({
                txtBtn: alerted ? 'Quitar Alerta' : 'Si, Alertar',
                msg: alerted ? '¿Estás seguro de que quieres Quitar tu Alerta a esta publicación?' : '¿Estás seguro de que quieres agregar tu Alerta a esta publicación?',
                title: alerted ? 'Eliminar Alerta' :'Mandar Alerta'})}
              onClickUser={(uid) => router.push(`/profile/${uid}`)}
              commentMade={(commentMade) => {
                commentMade.usuario = userData as UserData;
                setPublication({...publication as Publication, reposts: (publication?.reposts as number  + 1), comentarios: [...publication?.comentarios as CommentT[], commentMade]})
              }}
              />
            <div className='border border-grays-200 mt-[-12px]'/>
  
            <div className='border-b border-gray-200'>
              <div className='flex p-4'>
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
                  className="w-full resize-none rounded-xl bg-transparent p-3 text-black outline-none"
                />
              </div>
              <div className='flex justify-end pr-4 pb-4'>
                <button className={`px-4 py-2 rounded-full text-white ${
                      (comment !== '' && !loading) ? 'bg-[#4B90E2] hover:bg-blue-500' : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={comment === '' || loading}
                  onClick={() => {
                    if (loading) return;
                    setLoading(true);
                    createComment();
                  }}
                  >
                  Comentar
                </button>
              </div>
            </div>
            <div className='flex flex-col-reverse'>
              {publication?.comentarios.map((com, index) => {
                const own = com.usuario.uid === userData?.uid ? true : false;
                return (
                  <Card_Comment
                    key={index}
                    infoComment={com} 
                    infoCreator={com.usuario}
                    showBtnDelete={own}
                    onClickUser={(uid) => router.push(`/profile/${uid}`)}
                    onClickDelete={deleteComment}
                  />
                );
              })}
            </div>
          </section>
        </main>
        {modalConfig && (
          <ConfirmationModal
            title={modalConfig.texts.title}
            textBtn={modalConfig.texts.txtBtn}
            msg={modalConfig.texts.msg}
            onClose={(confirm) => {
              modalConfig.resolve(confirm);
              setModalConfig(null);
            }}
          />
        )}
      </ProtectedRoute>
    )
  }
}
