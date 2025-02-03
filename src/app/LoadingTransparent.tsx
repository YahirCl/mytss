import React from 'react'

export default function LoadingTransparent() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-[rgba(0,0,0,0.4)] z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <p className="text-black">Cargando...</p>
      </div>
    </div>
  );
}
