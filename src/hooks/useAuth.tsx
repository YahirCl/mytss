"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../libs/firebase-config";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useRouter } from 'next/navigation';
import Loading from "@/app/Loading";

type UserContextType = {
  user: User | null;
  userData: UserData | null; // Para los datos adicionales\\
  userToken: string;
  updateUserData: (newData: UserData) => void;
  setIsNewUser: (value: boolean) => void;
  getToken: () => Promise<string>;
};

// Devuelve un token vigente (Firebase lo renueva solo si ya expiró; los tokens duran 1 hora)
async function getToken() {
  return (await auth.currentUser?.getIdToken()) ?? "";
}

const AuthContext = createContext<UserContextType>({ user: null, userData: null, userToken: "", updateUserData: () => {},  setIsNewUser: () => {}, getToken});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const storage = getStorage();

  const [user, setUser] = useState<User | null>(null);
  const [userToken, setUserToken] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  function updateUserData(newData: UserData) {
    setUserData(newData);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Consulta la base de datos usando el UID del usuario
        const token = await user.getIdToken();
        setUserToken(token);
        
        try {
          const response = await fetch(`/api/auth?uid=${user?.uid}`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });

          if (response.ok) {
            const data = await response.json() as UserData;

            //Comprobar las publicaciones con likes
            //const likedPublications = new Set(data.interacciones.filter(({tipoInteraccion}) => tipoInteraccion === 'LIKE').map(({publicacionId}) => publicacionId));
 
            let imgUserURL = null;
            let imgCoverURL = null;

            // Si la imagen ya no existe en Storage no debe romper el inicio de sesión
            if(data.avatarUrl !== null) {
              imgUserURL = await getDownloadURL(ref(storage, `users/${user.uid}/profile_img`)).catch(() => data.avatarUrl);
            }
            if(data.coverUrl !== null) {
              imgCoverURL = await getDownloadURL(ref(storage, `users/${user.uid}/cover_img`)).catch(() => data.coverUrl);
            }

            setUserData({...data, avatarUrl: imgUserURL, coverUrl: imgCoverURL});
            if (isNewUser || !data.encuesta) {
              if(data.usuarioEspecial) {
                setRedirectTo("/admin_panel");
              } else {
                setRedirectTo(data.encuesta ? "/dashboard" : "/auth/form");
              }
              setIsNewUser(false);
            }
            
          } else {
            setUserData(null);
          }
        } catch (error) {
          console.error("Error en la solicitud:", error);
        }
      } else {
        setUserData(null);
        setRedirectTo("/auth/login");
      }
      setInitializing(false);
    });

    return () => unsubscribe();
  }, [isNewUser]);

  // Manejar la redirección
  useEffect(() => {
    if (redirectTo) {
      router.replace(redirectTo);
    }
  }, [redirectTo]);

  if (initializing) {
    return <Loading />; // Puedes reemplazarlo con un spinner
  }

  return (
    <AuthContext.Provider value={{ user, userData, userToken, updateUserData, setIsNewUser, getToken}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
