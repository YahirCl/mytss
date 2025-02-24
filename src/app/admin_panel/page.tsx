/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { auth } from '@/libs/firebase-config'
import React, { useState } from 'react'
import { Home,  BarChart, AlertCircle } from 'lucide-react';
import Header from '../Header';

const students = [
  { name: 'Pedro', risk: 'Riesgo Alto' },
  { name: 'Pancho', risk: 'Riesgo Alto' },
];

const reports = [
  { id: 1, title: 'Reporte 1', date: '2025-02-19', risk: 'Riesgo Medio', description: 'Tengo mucha ansiedad me siento triste.' },
  { id: 2, title: 'Reporte 2', date: '2025-02-18', risk: 'Riesgo Alto', description: 'Tiene algun sentido la vida?.' },
];

const highRiskMessages = [
  { id: 1, message: 'Estoy cansado de todo...', user: 'Pedro' },
  { id: 2, message: 'No quiero seguir así...', user: 'Pancho' },
];

export default function page() {
  const [selected, setSelected] = useState('Lista de Alumnos');
  
  return (
    <>
      <Header route='NON'/>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col p-4">
        <div className="space-y-4">
          <button
            className={`flex items-center space-x-2 p-2 rounded-lg w-full ${
              selected === 'Lista de Alumnos' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            onClick={() => setSelected('Lista de Alumnos')}
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
              selected === 'Mensajes con nivel Alto' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            onClick={() => setSelected('Mensajes con nivel Alto')}
          >
            <AlertCircle className="w-5 h-5" />
            <span>Mensajes con nivel Alto</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {selected === 'Lista de Alumnos' && (
          <>
            <h1 className="text-xl font-bold mb-4">Lista de Alumnos</h1>
            <div className="space-y-4">
              {students.map((student, index) => (
                <div key={index} className="flex items-center bg-gray-300 dark:bg-gray-700 p-4 rounded-lg justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                    <span className="font-semibold">{student.name}</span>
                  </div>
                  {student.risk && <span className="text-red-600 dark:text-red-400 font-bold">{student.risk}</span>}
                </div>
              ))}
            </div>
          </>
        )}

        {selected === 'Reportes' && (
          <>
            <h1 className="text-xl font-bold mb-4">Reportes</h1>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="bg-gray-300 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <span className="font-semibold">{report.title}</span>
                      <span className="text-gray-600 dark:text-gray-400">({report.date})</span>
                    </div>
                    <span className={`font-bold ${report.risk === 'Riesgo Alto' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>{report.risk}</span>
                  </div>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">{report.description}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {selected === 'Mensajes con nivel Alto' && (
          <>
            <h1 className="text-xl font-bold mb-4">Mensajes con Nivel Alto</h1>
            <div className="space-y-4">
              {highRiskMessages.map((message) => (
                <div key={message.id} className="bg-gray-300 dark:bg-gray-700 p-4 rounded-lg">
                  <span className="font-semibold">{message.user}:</span> {message.message}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  </>
  )
}
