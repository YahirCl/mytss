'use client';

import React, { useState } from 'react';
import ProtectedRoute from '../ProtectedRoute';
import Header from '../Header';
import Card_Profile from './Card_Profile';
import { useAuth } from '@/hooks/useAuth';

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
      <main className='flex flex-col items-center bg-white'>
        <section className='border-[1.8px] border-black p-5 rounded-md w-[60%] mt-5'>
          <Card_Profile name={user?.email} post_date/>
          <div className='flex flex-wrap gap-2 mb-3'>
            {selectedEmotion && (
              <span className='flex items-center gap-1'>
                Me siento: {selectedEmotion.emoji} {selectedEmotion.label}
              </span>
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

            <button className='bg-[#4B90E2] px-4 py-2 rounded-full text-white hover:bg-blue-500'>
              Publicar
            </button>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}