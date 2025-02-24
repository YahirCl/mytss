/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import Card_Profile from '../dashboard/Card_Profile';
import { FileX, Trash } from 'lucide-react';

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
            <div>
              <div className='flex justify-between'>
                <Card_Profile data={{name: infoCreator.nombreUsuario, img: infoCreator.avatarUrl as string, date: fechaComentario}} onClickUser={() => onClickUser(infoCreator.uid)}/>
                <button className='mt-[-15px]' onClick={async () => {
                  const isDelete = await onClickDelete(id);
                  if (isDelete) setCDelete(isDelete);
                }}>
                    {showBtnDelete && <Trash color='red' size={18}/>}
                </button>
              </div>
              <p className='ml-2 mt-2'>{contenido}</p>
            </div>
          )}
          
        </div>
      </article>
    </>

  )
}
