'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '../ProtectedRoute';
import Header from '../Header';
import Card_Profile from './Card_Profile';
import { useAuth } from '@/hooks/useAuth';
import Card_Publication from './Card_Publication';

export default function Page() {
  const { userData } = useAuth();

  const [selectedEmotion, setSelectedEmotion] = useState(null);
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
    async function getPublications() {
      try {
        const res = await fetch(`/api/pub`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        setPublications(await res.json());
      } catch (error) {
        console.error(error);
      }
    }

    getPublications();
  }, [userData?.uid])

  const handleEmotionClick = (emoji, label) => {
    if (selectedEmotion?.emoji === emoji) {
      setSelectedEmotion(null);
    } else {
      setSelectedEmotion({ emoji, label });
    }
  };

  async function makePublication() {
    try {
      const res = await fetch('/api/pub', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: userData?.id,
          content: publicationInput
        }),
      });

      res.json()
        .then((data) => {
          setPublicationInput('');
          setPublications([...publications, data.pub])
          alert(data.msg);
      });

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ProtectedRoute>
      <Header/>
      <main className='flex flex-col items-center bg-slate-100 text-black'>
        <section className='border-[1.8px] border-black p-5 rounded-md w-[60%] mt-5'>
          <div className='flex'>
            <Card_Profile name={userData?.nombreUsuario} img={userData?.avatarUrl} />
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

            <button className='bg-[#4B90E2] px-4 py-2 rounded-full text-white hover:bg-blue-500'
              onClick={makePublication}>
              Publicar
            </button>
          </div>
        </section>
        {publications.map((pub, index) => {
          return (
            <Card_Publication key={index} info={pub}/>
          )
        })}
      </main>
    </ProtectedRoute>
  );
}