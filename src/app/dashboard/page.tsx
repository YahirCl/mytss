'use client';

import React, { useState } from 'react';
import ProtectedRoute from '../ProtectedRoute';
import Header from '../Header';
import Card_Profile from './Card_Profile';
import { useAuth } from '@/hooks/useAuth';
import Card_Publication from './Card_Publication';
import { auth } from '../../../firebase-config';

export default function Page() {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const emotions = [
    { emoji: '😃', label: 'Alegría' },  
    { emoji: '😨', label: 'Miedo'},
    { emoji: '😡', label: 'Enojo' },
    { emoji: '🤢', label: 'Asco' }, 
    { emoji: '😭', label: 'Tristeza profunda' },
    { emoji: '😔', label: 'Tristeza' },
    { emoji: '🤯', label: 'Sorprendido'},
  ];

  const pub = [
    {
      name: 'Pedrito Salzar',
      fecha: '12-12-24',
      foto: 'https://i.pinimg.com/736x/0a/63/1d/0a631d43ccc073b54a6781f0c9f5aed2.jpg',
      content: 'Hoy me hicieron bulling en la escuela estoy sad',
    },
    {
      name: 'Debian soto',
      fecha: '12-12-24',
      foto: 'https://i.pinimg.com/736x/0a/63/1d/0a631d43ccc073b54a6781f0c9f5aed2.jpg',
      content: 'A mi también',
    },
    {
      name: 'Iker casillas',
      fecha: '12-12-24',
      foto: 'https://i.pinimg.com/736x/0a/63/1d/0a631d43ccc073b54a6781f0c9f5aed2.jpg',
      content: 'Me dijeron chico f1',
    },
    {
      name: 'Cuco',
      fecha: '12-12-24',
      foto: 'https://i.pinimg.com/736x/0a/63/1d/0a631d43ccc073b54a6781f0c9f5aed2.jpg',
      content: 'x4',
    }
  ]

  const { user } = useAuth();

  const handleEmotionClick = (emoji, label) => {
    if (selectedEmotion?.emoji === emoji) {
      setSelectedEmotion(null);
    } else {
      setSelectedEmotion({ emoji, label });
    }
  };

  return (
    <ProtectedRoute>
      <Header/>
      <main className='flex flex-col items-center bg-slate-100 text-black'>
        <section className='border-[1.8px] border-black p-5 rounded-md w-[60%] mt-5'>
          <div className='flex'>
            <Card_Profile name={user?.email} post_date />
            {selectedEmotion && (
              <p className='text-gray-500 font-bold text-sm mt-[6px] ml-2'>Me siento con: <span className='bg-blue-100 p-2 rounded-full'>{selectedEmotion.emoji} {selectedEmotion.label}</span></p>
            )}
          </div>
          <input 
            className='border-[1.8px] border-black p-3 rounded-md w-[100%] h-24 my-3'
            type="text"
            placeholder='¿Como te sientes?'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
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
              onClick={() => auth.signOut()}>
              Publicar
            </button>
          </div>
        </section>
        {pub.map((pub, index) => {
          return (
            <Card_Publication key={index} info={pub}/>
          )
        })}
      </main>
    </ProtectedRoute>
  );
}