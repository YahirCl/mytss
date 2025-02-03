import React from 'react'
import Image from 'next/image'

export default function FollowButton({followed, loading, onClick}: {followed: boolean, loading: boolean, onClick: () => void}) {
  return (
    <button
      className={`flex items-center gap-1 px-4 py-1 font-medium rounded-lg text-white transition-all duration-300
        ${loading ? "bg-gray-400 cursor-not-allowed" : followed ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-600"}
      `}
      onClick={!loading ? onClick : undefined} // Deshabilita el onClick si está en loading
      disabled={loading} // Propiedad estándar de HTML para deshabilitar el botón
    >
      {loading ? (
        <>
          Procesando...
        </>
      ) : (
        <>
          <Image
            alt={followed ? "Icon remove friend" : "Icon add friend"}
            src={followed ? "/images/person-remove-outline.svg" : "/images/person-add-outline.svg"}
            width={20}
            height={20}
          />
          {followed ? "Dejar de Seguir" : "Seguir"}
        </>
      )}
    </button>
  );
}
