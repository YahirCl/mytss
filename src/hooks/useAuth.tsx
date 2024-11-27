"use client"

import { browserLocalPersistence, setPersistence, User } from 'firebase/auth';
import { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../../firebase-config';


const AuthContext = createContext<{user: User | null }>({ user: null});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [initializing, setInitializing] = useState(true);
  
    function onAuthStateChanged(user: User | null) {
      setUser(user);
      setInitializing(false);
    }
  
    useEffect(() => {
      // Configurar la persistencia de inicio de sesión
      setPersistence(auth, browserLocalPersistence)
        .then(() => {
          console.log('Persistencia configurada');
          // Suscribirse a los cambios del estado de autenticación
          const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
          return () => {
            subscriber(); // Limpiar suscripción
          };
        })
        .catch((error) => {
          console.error('Error al configurar persistencia:', error.message);
        });
    }, []);
  
    if (initializing) {
      return null; // Opcional: podrías mostrar un spinner mientras carga
    }
  
    return (
      <AuthContext.Provider value={{ user }}>
        {children}
      </AuthContext.Provider>
    );
  };

export const useAuth = () => useContext(AuthContext);
