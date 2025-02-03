import React from 'react'
import Image from 'next/image'

export default function Loading() {
  return (
    <div className='w-svw h-svh flex justify-center items-center bg-white'>
      <Image 
        src={'/Loading.gif'}
        alt='Gift de carga'
        width={150}
        height={150}
        unoptimized
      />
    </div>
  )
}
