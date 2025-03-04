import React, { useState } from 'react'
import Card_Profile from './dashboard/Card_Profile'
import Image from 'next/image'
import emotions from '@/utils/Emotions';

export default function EditModal({infoPublication, infoCreator, onClickClose}: {infoPublication : Publication, infoCreator: UserData, onClickClose: (dEdit : {nContent: string, nEmotion: Emotions} | null) => void}) {

  const [content, setContent] = useState(infoPublication.contenido);
  const [selectedEmotion, setSelectedEmotion] = useState<Emotions | null>(infoPublication.Emotion);
  const [loading, setLoading] = useState(false);

  const handleEmotionClick = (emoji: string, label: string) => {
    if (selectedEmotion?.emoji === emoji) {
      setSelectedEmotion(null);
    } else {
      setSelectedEmotion({ emoji, label });
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-2/4 text-black">
        <button onClick={() => onClickClose(null)}>
          <Image
            alt='Close-Icon'
            width={30}
            height={30}
            src={'/images/close-outline.svg'}
          />
        </button>

        <Card_Profile data={{name: infoCreator.nombreUsuario, img: infoCreator.avatarUrl as string, emotion: selectedEmotion, date: infoPublication.fechaPublicacion}}/>
        <textarea
          placeholder='Comenta algo...'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={250}
          className="w-full h-24 my-2 resize-none rounded-xl bg-transparent p-3 text-base text-black outline-none"
        />

         <div className='w-full bg-gray-400 h-[1px]'/> {/* line */}

        <div className='py-2 mb-5 flex flex-row gap-2'>
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

        <button className={`px-4 py-2 rounded-full text-white ${
          (content !== '' && !loading && content !== infoPublication.contenido) ? 'bg-[#4B90E2] hover:bg-blue-500' : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={content === '' || loading || content === infoPublication.contenido}
          onClick={() => {
            if (loading) return;
            setLoading(true);
            onClickClose({nContent: content, nEmotion: selectedEmotion as Emotions})
          }}
          >
          {loading ? 'Cargando...' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}
