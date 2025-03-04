/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import Card_Profile from '../dashboard/Card_Profile';
import { FileX, Trash2 } from 'lucide-react';

export default function Card_Comment(
  {infoComment, infoCreator, showBtnDelete, onClickUser, onClickDelete} : 
  {
    infoComment : CommentT;
    infoCreator: UserData;
    showBtnDelete: boolean
    onClickUser: (uid: string) => void;
    onClickDelete: (id: number) => Promise<boolean>;
  }) {

  const {id, contenido, fechaComentario} = infoComment;
  const [cDelete, setCDelete] = useState(false);

  return (
    <>
      <article className='bg-white rounded-md w-[100%] text-black my-3'>
        <div className='p-3 border-b border-gray-200'>
          {cDelete ? (
            <div className='flex p-2 gap-2'>
              <FileX />
              <h5>Comentario Elimindo</h5>
            </div>
          ) : (
            <div className='flex'>
              <div className='flex flex-col w-full'>
                <Card_Profile data={{name: infoCreator.nombreUsuario, img: infoCreator.avatarUrl as string, date: fechaComentario}} onClickUser={() => onClickUser(infoCreator.uid)}/>
                <p className='ml-2 mt-2'>{contenido}</p>
              </div>
              {showBtnDelete && 
              <button 
                type="button"
                className="my-3 text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-0.5 text-center inline-flex items-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800 dark:hover:bg-red-500"
                onClick={async () => {
                  const isDelete = await onClickDelete(id);
                  if (isDelete) setCDelete(isDelete);
                }}>
                <Trash2 size={15}/>
              </button>}
            </div>
          )}
        </div>
      </article>
    </>

  )
}
