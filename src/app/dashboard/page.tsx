'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '../ProtectedRoute';
import Header from '../Header';
import Card_Profile from './Card_Profile';
import { useAuth } from '@/hooks/useAuth';
import Card_Publication from './Card_Publication';
import Loading from '../Loading';
import { useRouter } from 'next/navigation';
import LoadingTransparent from '../LoadingTransparent';

export default function Page() {
  const router = useRouter();
  const { userData } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isTransLoading, setIsTransLoading] = useState(false);

  const [selectedEmotion, setSelectedEmotion] = useState<{emoji: string, label: string} | null>(null);
  const [publicationInput, setPublicationInput] = useState('');
  const [publications, setPublications] = useState<Publication[]>([]);

  const emotions = [
    { emoji: '😃', label: 'Alegría' },  
    { emoji: '😨', label: 'Miedo'},
    { emoji: '😡', label: 'Enojo' },
    { emoji: '🤢', label: 'Asco' }, 
    { emoji: '😭', label: 'Tristeza profunda' },
    { emoji: '😔', label: 'Tristeza' },
    { emoji: '🤯', label: 'Sorprendido'},
  ];

  useEffect(() => {
    console.log("Voy a empezar a cargar las publicaciones");
    async function getPublications() {
      try {
        const res = await fetch(`/api/pub?id=${userData?.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        setPublications(await res.json());
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    getPublications();
  }, [userData?.uid])

  const handleEmotionClick = (emoji: string, label: string) => {
    if (selectedEmotion?.emoji === emoji) {
      setSelectedEmotion(null);
    } else {
      setSelectedEmotion({ emoji, label });
    }
  };

  async function pressedLike(id: number, isLiked: boolean){
    try {
      const res = await fetch('/api/pub/like', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pubId: id,
          userId: userData?.id,
          isLiked: isLiked
        }),
      });

      const resJSON = await res.json();

      console.log(resJSON.message);

    } catch (error) {
      console.log(error);
    }
  }

  async function makePublication() {
    setIsTransLoading(true);
    try {
      const res = await fetch('/api/pub', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: userData?.id,
          content: publicationInput,
          emocion: selectedEmotion?.label
        }),
      });

      res.json()
        .then((data) => {
          setPublicationInput('');
          setSelectedEmotion(null);
          setPublications([...publications, data.pub]);
          setIsTransLoading(false);
          alert(data.msg);
      });

    } catch (error) {
      console.log(error);
    }
  }

  if(isLoading) {
    return <Loading />
  }

  return (
    <>
      {isTransLoading && <LoadingTransparent />}
      <ProtectedRoute>
        <Header route='HOME'/>
        <main className='flex flex-col items-center bg-slate-100 text-black'>
          <section className='border-[1.8px] border-black p-5 rounded-md w-[60%] mt-5'>
            <div className='flex'>
              <Card_Profile data={{name: userData?.nombreUsuario, img: userData?.avatarUrl as string}} />
              {selectedEmotion && (
                <p className='text-gray-500 font-bold text-sm mt-[6px] ml-2'>Me siento con: <span className='bg-blue-100 p-2 rounded-full'>{selectedEmotion.emoji} {selectedEmotion.label}</span></p>
              )}
            </div>
            <input 
              className='border-[1.8px] border-black p-3 rounded-md w-[100%] h-24 my-3'
              type="text"
              placeholder='¿Como te sientes?'
              value={publicationInput}
              onChange={(e) => setPublicationInput(e.target.value)}
            />
            
            <div className='flex flex-row justify-between items-center mt-5'>
              <div className='py-2 flex flex-row gap-2'>
                {emotions.map(({emoji, label}, index) => {
                  const isSelected = selectedEmotion?.emoji === emoji;
                  return (
                    <button 
                      key={index} 
                      onClick={() => handleEmotionClick(emoji, label)}
                      className={`px-6 py-3 rounded-xl ${isSelected ? 'bg-blue-200' : 'bg-gray-100'} hover:bg-blue-100`}
                    >
                      <p>{emoji} {label}</p>
                    </button>
                  );
                })}
              </div>

              <button
                className={`px-4 py-2 rounded-full text-white ${
                  (publicationInput !== '' || selectedEmotion !== null) ? 'bg-[#4B90E2] hover:bg-blue-500' : 'bg-gray-400'
                }`}
                disabled={(publicationInput === '' && selectedEmotion === null)}
                onClick={makePublication}
              >
                Publicar
              </button>

            </div>
          </section>
          <div className="flex flex-col-reverse w-full items-center">
            {publications.map((pub, index) => {
              const yourInteractions = pub.interacciones as string[];
              const isLiked = yourInteractions.includes("LIKE");
              return (
                <div key={index} className="w-[60%]">
                  <Card_Publication 
                    infoPublication={pub} 
                    infoCreator={pub.usuario}
                    isLiked={isLiked} 
                    onPressLike={pressedLike}
                    onClickUser={(uid) => router.push(`/profile/${uid}`)}/>
                </div>
              );
            })}
        </div>
        </main>
      </ProtectedRoute>
    </>
  );
}