/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import React, { useEffect, useState } from 'react'
import { Home,  BarChart, AlertCircle } from 'lucide-react';
import Header from '../Header';
import { useAuth } from '@/hooks/useAuth';
import Card_Report from './Card_Report';
import Card_HighRisk from './Card_HighRisk';
import Card_StudentList from './Card_StudentList';
import { useRouter } from 'next/navigation';
import Loading from '../Loading';

export default function page() {
  const { userToken, userData } = useAuth();
  const router = useRouter();

  const [selected, setSelected] = useState<'Lista_de_Alumnos' | 'Reportes' | 'Mensajes_con_nivel_Alto'>('Lista_de_Alumnos');
  const [listStudents, setListStudents] = useState<Poll[]>([]);
  const [listReports, setListReports] = useState<Publication[]>([]);
  const [listRiskMessages, setListRiskMessages] = useState<Publication[]>([]);
  const [firstsLoading, setFirstLoading] = useState({Lista_de_Alumnos: true, Reportes: true, Mensajes_con_nivel_Alto: true});

  useEffect(() => {
    async function fetchData() {
      console.log(`Voy a hacer el fetch a ${selected}`)
      const response = await fetch(`/api/auth/admin?q=${selected}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
      });

      const resData = await response.json();

      if (selected === 'Lista_de_Alumnos') {
        setListStudents(resData);
      } else if (selected === 'Reportes') {
        setListReports(resData);
      } else {
        setListRiskMessages(resData);
      }
    }

    if(!userData?.usuarioEspecial) router.back();

    if (firstsLoading[selected]) {
      setFirstLoading({...firstsLoading, [selected]: false});
      console.log('Entro aqui')
      fetchData();
    }
  }, [selected]);

  if (listStudents.length === 0) {
    return <Loading />
  } else {
    return (
      <>
        <Header route='NON'/>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col p-4">
          <div className="space-y-4">
            <button
              className={`flex items-center space-x-2 p-2 rounded-lg w-full ${
                selected === 'Lista_de_Alumnos' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => setSelected('Lista_de_Alumnos')}
            >
              <Home className="w-5 h-5" />
              <span>Lista de Alumnos</span>
            </button>
            <button
              className={`flex items-center space-x-2 p-2 rounded-lg w-full ${
                selected === 'Reportes' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => setSelected('Reportes')}
            >
              <BarChart className="w-5 h-5" />
              <span>Reportes</span>
            </button>
            <button
              className={`flex items-center space-x-2 p-2 rounded-lg w-full ${
                selected === 'Mensajes_con_nivel_Alto' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => setSelected('Mensajes_con_nivel_Alto')}
            >
              <AlertCircle className="w-5 h-5" />
              <span>Mensajes con nivel Alto</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {selected === 'Lista_de_Alumnos' && (
            <>
              <h1 className="text-xl font-bold mb-4">Lista de Alumnos</h1>
              <div className="space-y-4">
                {listStudents.map((student, index) => (
                  <Card_StudentList key={index} data={student} onClick={(uid) => router.push(`/profile/${uid}`)}/>
                ))}
              </div>
            </>
          )}

          {selected === 'Reportes' && (
            <>
              <h1 className="text-xl font-bold mb-4">Reportes</h1>
              <div className="space-y-4">
                {listReports.map((report) => (
                  <Card_Report key={report.id} data={report} onClick={(id) => router.push(`/publication_complete/${id}`)}/>
                ))}
              </div>
            </>
          )}

          {selected === 'Mensajes_con_nivel_Alto' && (
            <>
              <h1 className="text-xl font-bold mb-4">Mensajes con Nivel Alto</h1>
              <div className="space-y-4">
                {listRiskMessages.map((pub) => (
                  <Card_HighRisk key={pub.id} data={pub} onClick={(id) => router.push(`/publication_complete/${id}`)}/>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
    )
  }
}
