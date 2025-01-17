import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { auth } from '../../firebase-config';

export default function Header() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Agregar evento al hacer clic
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Eliminar evento al desmontar
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Función para cerrar el menú si haces clic fuera de él
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  
  const toggleDropdown = (event) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <header className='bg-[#3C5998] flex justify-between p-3'>

        <search className='bg-slate-50 flex flex-row rounded-full px-3 py-1 gap-2'>
            <Image
                src="/images/search-svgrepo-com.svg" // Ruta en la carpeta public
                alt="Un ícono SVG"
                width={20}
                height={20}
            />
            <input placeholder='Buscar'/>
        </search>

        <div className='flex flex-row justify-center pr-60 gap-6'>
            <button onClick={ () => { router.push('/dashboard') } }>
            <Image 
                src="/images/home-1-svgrepo-com.svg" // Ruta en la carpeta public
                alt="Un ícono SVG"
                width={30}
                height={20}
            />
            </button>
                <button onClick={ () => { router.push('/profile') } }>
                <Image 
                src="/images/profile-round-1342-svgrepo-com.svg" // Ruta en la carpeta public
                alt="Un ícono SVG"
                width={25}
                height={20}
            />
            </button>
                <Image 
                src="/images/bell-ring-svgrepo-com.svg" // Ruta en la carpeta public
                alt="Un ícono SVG"
                width={30}
                height={20}
            />
        </div>

        <div>
          <button onClick={toggleDropdown}>
            <Image 
              src="/images/menu-svgrepo-com.svg" // Ruta en la carpeta public
              alt="Un ícono SVG"
              width={30}
              height={20}
            />
          </button>
        </div>

        {/* Opciones del menú */}
        {isOpen && (
          <div className="absolute right-3 top-10 mt-2 w-56 text-black bg-white shadow-lg rounded-md" ref={dropdownRef}>
            <ul className="py-2">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Configuración y privacidad
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Ayuda y asistencia
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Pantalla y accesibilidad
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => auth.signOut()}>
                Cerrar sesión
              </li>
            </ul>
          </div>
        )}
    </header>
  )
}


