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
};

const AuthContext = createContext<UserContextType>({ user: null, userData: null, userToken: "", updateUserData: () => {}});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const storage = getStorage();

  const [user, setUser] = useState<User | null>(null);
  const [userToken, setUserToken] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  function updateUserData(newData: UserData) {
    setUserData(newData);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      console.log("Hola soy useAuth, en teoría cambio el Auth", user);

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
            console.log(data);

            //Comprobar las publicaciones con likes
            //const likedPublications = new Set(data.interacciones.filter(({tipoInteraccion}) => tipoInteraccion === 'LIKE').map(({publicacionId}) => publicacionId));
 
            let imgUserURL = null;
            let imgCoverURL = null;

            if(data.avatarUrl !== null) {
              imgUserURL = await getDownloadURL(ref(storage, `users/${user.uid}/profile_img`));
            }
            if(data.coverUrl !== null) {
              imgCoverURL = await getDownloadURL(ref(storage, `users/${user.uid}/cover_img`));
            }


            setUserData({...data, avatarUrl: imgUserURL, coverUrl: imgCoverURL});
            if(data.usuarioEspecial) {
              setRedirectTo("/admin_panel");
            } else {
              setRedirectTo(data.encuesta ? "/dashboard" : "/auth/form");
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
  }, []);

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
    <AuthContext.Provider value={{ user, userData, userToken, updateUserData}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
