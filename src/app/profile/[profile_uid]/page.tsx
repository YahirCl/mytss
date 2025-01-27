/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useParams } from 'next/navigation';
import Header from '../../Header';
import ProtectedRoute from '../../ProtectedRoute';
import Image from 'next/image';
import Modal from '../Modal';

export default function Page() {
  const { userData } = useAuth();
  const params = useParams();
  
  const { uid } = params;

  console.log(uid);

  const [activeTab, setActiveTab] = useState('publicaciones'); // Estado para manejar la pestaña activa

  // Datos de ejemplo para la sección de información
  const informacion = [
    { icon: '👤', label: 'Nombre completo', value: userData?.nombreCompleto || 'Nombre no disponible' },
    { icon: '✉️', label: 'Correo electrónico', value: userData?.email || 'Correo no disponible' },
    { icon: '🔒', label: 'Contraseña', value: userData?.contrasena || 'Contraseña no disponible' },
  ];

  return (
    <ProtectedRoute>
      <Header route='PROFILE'/>
      <main className="min-h-screen bg-slate-100 flex flex-col text-black">
        {/* Encabezado del perfil */}
        <header className="h-[70vh] flex flex-col items-center bg-white">
          <Image
            src={userData?.coverUrl as string}
            alt="Imagen de fondo de perfil"
            width={1300}
            height={200}
            className="w-[60%] h-[70%] rounded-b-xl min-h-[70%]"
          />
          <div className="flex flex-col w-[60%] h-[100%] px-5">
            <div className="flex border-b-2 border-gray">
              <Image
                src={userData?.avatarUrl as string}
                alt="Imagen de Usuario"
                width={210}
                height={0}
                className="rounded-full mt-[-60px] mb-5 max-h-44"
              />
              <div className="p-5 w-full">
                <h1 className="text-4xl font-bold">{userData?.nombreUsuario}</h1>
                <div className="flex gap-5">
                  <h5 className="text-gray-500">
                    <span className="font-bold text-black">60</span> Seguidores
                  </h5>
                  <h5 className="text-gray-500">
                    <span className="font-bold text-black">35</span> Siguiendo
                  </h5>
                  <div className="w-full flex justify-end">
                    <Modal />
                  </div>
                </div>
              </div>
            </div>
            {/* Tabs de navegación */}
            <div className="h-[100%] px-5 flex gap-10 items-center">
              <button
                className={`font-bold ${
                  activeTab === 'publicaciones'
                    ? 'text-blue-400 border-blue-400 border-b-4'
                    : 'text-gray-500'
                } h-full`}
                onClick={() => setActiveTab('publicaciones')}
              >
                Publicaciones
              </button>
              <button
                className={`font-bold ${
                  activeTab === 'informacion'
                    ? 'text-blue-400 border-blue-400 border-b-4'
                    : 'text-gray-500'
                } h-full`}
                onClick={() => setActiveTab('informacion')}
              >
                Información
              </button>
            </div>
          </div>
        </header>

        {/* Contenido dinámico según la pestaña activa */}
        <section className="w-[60%] mx-auto mt-5 mb-5">
          {activeTab === 'publicaciones' && (
            <div className="bg-white p-5 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-4">Publicaciones</h2>
              <p>Aquí se mostrarán las publicaciones del usuario.</p>
            </div>
          )}
          {activeTab === 'informacion' && (
            <div className="bg-white p-5 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-4">Información</h2>
              <ul className="space-y-4">
                {informacion.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <h3 className="font-bold">{item.label}</h3>
                        <p className="text-gray-700">{item.value}</p>
                      </div>
                    </div>
                    <button className="text-gray-500 hover:text-black">✏️</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}
