/* eslint-disable @typescript-eslint/no-unused-vars */
type RequiredFormFields = {
    email: string;
    password: string;
}

type OthersFormFields = {
    username: string;
    fullname: string;
    repeatPassword: string;
};

type ErrorFields = {
    error: boolean;
    msg?: string;
}

type Emotions = {
    emoji: string;
    label: string
}

type FormErrors = Record<keyof (RequiredFormFields & OthersFormFields), ErrorFields>

type CustomButtonProps = {
    text: string;
    onPress?: () => void;
}

interface UserData {
    id: number;
    uid: string;
    nombreUsuario: string;
    nombreCompleto: string | null;
    email: string;
    fechaRegistro: Date;
    avatarUrl: string | null;
    coverUrl: string | null;
    sexo: boolean | null;
    fechaNacimiento: string | null;
    carrera: string | null;
    siguiendo: number;
    seguidores: number;
    usuarioEspecial: boolean;
    publicaciones: Publication[];
    seguidoresList: Follower[]
    interacciones: Interactions[];
    encuesta: boolean;
}

interface Publication {
    id: number;
    usuarioId: number;
    contenido: string;
    emocion: string;
    fechaPublicacion: string; 
    likes: number;
    reposts: number;
    nivelVacio: string;
    alertas: number;
    usuario: UserData;
    interacciones?: string[];
    comentarios: CommentT[];
    Emotion: Emotions
  }
  

interface Interactions {
    id: number;
    usuarioId: number;
    publicacionId: number;
    tipoInteraccion: string;
    fechaInteraccion: string;
    usuario: UserData;
    publicacion: Publication;
}

interface CommentT {
  id: number;
  usuarioId: number;
  publicacionId: number;
  contenido: string;
  fechaComentario: string
  usuario: UserData;      
  publicacion: Publication;
}

interface Follower {
    id: number;
    seguidorId: number;
    seguidoId: number;
    fechaSeguimiento: string;
    seguidor: UserData;
    seguido: UserData;
}

interface ResultUser {
    uid: string;
    nombreUsuario: string;
    avatarUrl: string;
}
interface Poll {
  id: number;               
  usuarioId: number;          
  fecha: string;
  puntajeDesesperanza: number;
  riesgoAlto: boolean;
  usuario: UserData;
}