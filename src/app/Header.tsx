/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { auth } from '../libs/firebase-config';
import { debounce } from '@/utils/debounce';
import { Bolt, ShieldAlert, LogOut  } from 'lucide-react'

import SearchUserCard from './dashboard/SearchUserCard';
import DropDownMenu from './DropDownMenu';
import { useAuth } from '@/hooks/useAuth';

export default function Header({route} : {route: 'HOME' | 'PROFILE' | 'NON'}) {
  const router = useRouter();
  const { userData } = useAuth();

  const [isOpenDropDown, setIsOpenDropDown] = useState(false);
  //const [isModalOpen, setIsModalOpen] = useState(false);
  const [querySearchUser, setQuerySearchUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultUsers, setResultUsers] = useState<ResultUser[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const resultUsersRef = useRef<HTMLDivElement>(null);
  //const modalRef = useRef<HTMLDivElement>(null);

  const fetchUsers = async (searchQuery: string) => {
    if (searchQuery.trim() === "") return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/search/simpleUser?q=${searchQuery}&uid=${auth.currentUser?.uid}`);
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpenDropDown(false);
    }
    if (resultUsersRef.current && !resultUsersRef.current.contains(event.target)) {
      setQuerySearchUser("");
    }
    // if (modalRef.current && !modalRef.current.contains(event.target)) {
    //   setIsModalOpen(false);
    // }
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
  
  const toggleDropdown = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();                                                                                                                                    
    setIsOpenDropDown(!isOpenDropDown);
  };

  // const toggleModal = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   event.stopPropagation();
  //   setIsModalOpen(!isModalOpen);
  // };

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
          {/* <button onClick={toggleModal} className='bg-blue-600 rounded-full p-2'>
            <Image 
              src="/images/bell-outline.svg" // Ruta en la carpeta public
              alt="Un ícono SVG"
              width={19}
              height={19}
            />
          </button> */}
          <button onClick={toggleDropdown}>
            <Image 
              src={ userData?.avatarUrl ? userData.avatarUrl : "/images/default-user.png"}
              alt="Un ícono SVG"
              width={35}
              height={35}
              className='rounded-full'
            />
          </button>
        </div>

        {/* Opciones del menú */}
        {isOpenDropDown && (
          <DropDownMenu dropdownRef={dropdownRef} adjust='15px'>
            <ul className="py-2 bg-white rounded-md">
              {userData?.usuarioEspecial &&
                <li>
                <button className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex w-full gap-2" onClick={() => router.push('/admin_panel')}>
                  <ShieldAlert/>
                  Admin Panel
                </button>
                </li>
              }
              <li>
                <button className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex w-full gap-2">
                  <Bolt/>
                  Configuración
                </button>
              </li>
              <li>
                <button className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex w-full gap-2" onClick={() => auth.signOut()}>
                  <LogOut/>
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </DropDownMenu>
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

      {/* Modal de notificaciones */}
      {/* {isModalOpen && (
        <div
          className="absolute right-3 top-16 w-80 bg-white shadow-xl rounded-lg p-4"
          ref={modalRef}
        >
          <h3 className="font-bold text-lg text-gray-800 mb-3">
            Notificaciones
          </h3>
          <ul className="space-y-2">
            <li className="p-3 bg-gray-50 rounded-lg flex items-center gap-3 hover:bg-gray-100 cursor-pointer">
              <div className="bg-blue-100 p-2 rounded-full">
                <Image
                  src="/images/prueba1.jpg"
                  alt="Icono usuario"
                  width={20}
                  height={20}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Nueva solicitud de amistad
                </p>
                <p className="text-xs text-gray-500">Hace 5 minutos</p>
              </div>
            </li>
            <li className="p-3 bg-gray-50 rounded-lg flex items-center gap-3 hover:bg-gray-100 cursor-pointer">
              <div className="bg-green-100 p-2 rounded-full">
                <Image
                 src="/images/prueba1.jpg"
                  alt="Icono mensaje"
                  width={20}
                  height={20}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Comento en tu publicación
                </p>
                <p className="text-xs text-gray-500">Hace 2 horas</p>
              </div>
            </li>
            <li className="p-3 bg-gray-50 rounded-lg flex items-center gap-3 hover:bg-gray-100 cursor-pointer">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Image
                  src="/images/prueba1.jpg"
                  alt="Icono alerta"
                  width={20}
                  height={20}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Le gusta tu publicación
                </p>
                <p className="text-xs text-gray-500">Hace 1 día</p>
              </div>
            </li>
          </ul>
        </div>
      )} */}
    </header>
  );
}
