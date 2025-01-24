"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../firebase-config";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

type UserContextType = {
  user: User | null;
  userData: UserData | null; // Para los datos adicionales
  updateUserData: (newData: UserData) => void;
};

const AuthContext = createContext<UserContextType>({ user: null, userData: null, updateUserData: () => {}});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const storage = getStorage();

  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [initializing, setInitializing] = useState(true);

  function updateUserData(newData: UserData) {
    setUserData(newData);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Consulta la base de datos usando el UID del usuario
        try {
          const response = await fetch(`/api/auth?uid=${user?.uid}`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json() as UserData;

            //Comprobar las publicaciones con likes
            const likedPublications = new Set(data.interacciones.filter(({tipoInteraccion}) => tipoInteraccion === 'LIKE').map(({publicacionId}) => publicacionId));

            let imgUserURL = '/images/default-user.png';
            let imgCoverURL = '/images/default-cover.png';

            if(data.avatarUrl !== null) {
              imgUserURL = await getDownloadURL(ref(storage, `users/${user.uid}/profile_img`));
            }
            if(data.coverUrl !== null) {
              imgCoverURL = await getDownloadURL(ref(storage, `users/${user.uid}/cover_img`));
            }


            setUserData({...data, avatarUrl: imgUserURL, coverUrl: imgCoverURL, likedPublications: likedPublications});
          } else {
            console.error("Error al obtener la información adicional del usuario");
          }
        } catch (error) {
          console.error("Error en la solicitud:", error);
        }
      } else {
        setUserData(null);
      }
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  if (initializing) {
    return <p>Loading...</p>; // Puedes reemplazarlo con un spinner
  }

  return (
    <AuthContext.Provider value={{ user, userData, updateUserData}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
