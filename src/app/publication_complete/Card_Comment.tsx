/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Card_Profile from '../dashboard/Card_Profile';

export default function Card_Comment(
  {infoComment, infoCreator, onClickUser} : 
  {
    infoComment : Comment,
    infoCreator: UserData,
    onClickUser: (uid: string) => void
  }) {

  const {contenido, fechaComentario} = infoComment;
  
  return (
    <>
      <article className='bg-white rounded-md w-[100%] text-black my-3'>
        <div className='p-3 border-b border-gray-200'>
          <Card_Profile data={{name: infoCreator.nombreUsuario, img: infoCreator.avatarUrl as string, date: fechaComentario}} onClickUser={() => onClickUser(infoCreator.uid)}/>
          <p className='ml-2 mt-2'>{contenido}</p>
        </div>
      </article>
    </>

  )
}
