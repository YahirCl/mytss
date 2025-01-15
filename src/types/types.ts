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

type FormErrors = Record<keyof (RequiredFormFields & OthersFormFields), ErrorFields>

type CustomButtonProps = {
    text: string;
    onPress?: () => void;
}

interface User {
    id: number;
    uid: string;
    nombreUsuario: string;
    nombreCompleto: string | null;
    email: string;
    fechaRegistro: Date;
    avatarUrl: string | null;
    siguiendo: number;
    seguidores: number;
}

interface Publication {
    id: number;
    usuarioId: number;
    contenido: string; 
    fechaPublicacion: string; 
    likes: number;
    reposts: number;
    usuario: User;
    interactions?: Interactions;
  }
  

interface Interactions {
    id: number;
    userId: number;
    publicationId: number;
    typeInteraction: string;
    interactionDate: string;
    user: User;
    publication: Publication;
}

interface Follower {
    id: number;
    followerId: number;
    followedById: number;
    followDate: string;
    follower: User;
    followedBy: User;
}