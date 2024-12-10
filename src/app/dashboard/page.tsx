'use client'

import { useAuth } from '@/hooks/useAuth'
import React, { useEffect } from 'react'
import { auth } from '../../../firebase-config';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../ProtectedRoute';

export default function page() {

  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div>
        <h1>Hola soy DASHBOARD y tu eres {user?.email}</h1>
        <button onClick={() => alert('Hola')}>Cerrar sesión</button>
      </div>
    </ProtectedRoute>
  )
}
