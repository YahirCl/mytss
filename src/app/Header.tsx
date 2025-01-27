import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { auth } from '../../firebase-config';
import { debounce } from '@/utils/debounce';
import SearchUserCard from './dashboard/SearchUserCard';

export default function Header({route} : {route: 'HOME' | 'PROFILE'}) {
  const router = useRouter();

  const [isOpenDropDown, setIsOpenDropDown] = useState(false);
  const [querySearchUser, setQuerySearchUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultUsers, setResultUsers] = useState<ResultUser[]>([]);
  const dropdownRef = useRef(null);
  const resultUsersRef = useRef(null);


  const fetchUsers = async (searchQuery: string) => {
    if (searchQuery.trim() === "") return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/search?q=${searchQuery}&uid=${auth.currentUser?.uid}`);
      const data = await response.json();

      setResultUsers(data);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchResults = useCallback(debounce(fetchUsers, 700), []);

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
      setIsOpenDropDown(false);
    }
    if (resultUsersRef.current && !resultUsersRef.current.contains(event.target)) {
      setQuerySearchUser("");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuerySearchUser(value);

    if (value.trim() !== "") {
      setIsLoading(true); // Mostrar el círculo de carga inmediatamente
      debouncedFetchResults(value); // Llamar a la función con debounce
    } else {
      setIsLoading(false); // Si el campo está vacío, desactivar el estado de carga
      setResultUsers([]); // Limpiar resultados
    }
  };

  
  const toggleDropdown = (event) => {
    event.stopPropagation();                                                                                                                                    
    setIsOpenDropDown(!isOpenDropDown);
  };

  return (
    <header className='bg-[#3C5998] flex justify-between p-3'>
                                    
        <search className='bg-slate-50 flex flex-row rounded-full px-3 py-1 gap-2'>
            <Image
                src="/images/search.svg" // Ruta en la carpeta public
                alt="Un ícono SVG"
                width={20}
                height={20}
            />
            <input 
              placeholder='Buscar'
              className='text-black outline-none'
              onChange={handleInputChange}
            />
        </search>

        <div className='flex flex-row justify-center pr-60 gap-6'>
            <button onClick={ () => { router.push('/dashboard') }} className={route === "HOME" ? 'bg-blue-100 rounded-full p-2' : ''}>
            <Image 
                src={route === "HOME" ? "/images/home-fill-blue.svg" : "/images/home-fill.svg"} // Ruta en la carpeta public
                alt="Un ícono SVG"
                width={20}
                height={20}
            />
            </button>
                <button onClick={ () => { router.push(`/profile/${auth.currentUser?.uid}`) } } className={route === "PROFILE" ? 'bg-blue-100 rounded-full p-2' : ''}>
                <Image 
                src={route === "PROFILE" ? "/images/user-fill-blue.svg" : "/images/user-fill.svg"} // Ruta en la carpeta public
                alt="Un ícono SVG"
                width={16}
                height={16}
            />
            </button>
        </div>

        <div className='flex gap-4 mr-1'>
          <button onClick={toggleDropdown} className='bg-blue-600 rounded-full p-2'>
            <Image 
              src="/images/bell-outline.svg" // Ruta en la carpeta public
              alt="Un ícono SVG"
              width={19}
              height={19}
            />
          </button>
          <button onClick={toggleDropdown} className='bg-blue-600 rounded-full p-2'>
            <Image 
              src="/images/signout.svg" // Ruta en la carpeta public
              alt="Un ícono SVG"
              width={19}
              height={19}
            />
          </button>
        </div>

        {/* Opciones del menú */}
        {isOpenDropDown && (
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

        {/* Resultados de usuarios */}
        {querySearchUser.length !== 0 && (
          <div className="absolute left-4 top-12 mt-2 w-80 text-black bg-white shadow-lg rounded-md" ref={resultUsersRef}>
            {isLoading ? (
              <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : resultUsers.length === 0 ? (
              <p className="p-4 font-bold text-center">Usuario no Encontrado</p>
            ) : (
              <ul className="py-2">
                {resultUsers.map((user, index) => (
                  <SearchUserCard
                    key={index}
                    data={user}
                    onClick={(uid) => router.push(`/profile/${uid}`)}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
    </header>
  )
}


