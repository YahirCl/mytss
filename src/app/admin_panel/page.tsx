'use client'

import { auth } from '@/libs/firebase-config'
import React from 'react'

export default function page() {
  return (
    <div>
        <h1>Hola psicólogo</h1>
        <button onClick={() => auth.signOut()}>Cerrar Sesion</button>
    </div>
    
  )
}
