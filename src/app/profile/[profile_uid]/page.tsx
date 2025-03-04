/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../Header';
import ProtectedRoute from '../../ProtectedRoute';
import Image from 'next/image';
import Modal from '../Modal';
import Loading from '@/app/Loading';
import FollowButton from '../FollowButton';
import Card_Publication from '@/app/dashboard/Card_Publication';
import ConfirmationModal from '@/app/ConfirmationModal';
import InformationComponent from '../InformationComponent';
import { User, VenusAndMars, Calendar1, University    } from 'lucide-react'

export default function Page() {
  const params = useParams();
  const router = useRouter();

  const { profile_uid } = params;
  const { userData, userToken, updateUserData } = useAuth();
  const own = profile_uid === userData?.uid;

  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean, texts: {txtBtn: string, title: string, msg: string}, resolve: (value: boolean) => void } | null>(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [editMode, setEditMode] = useState({name: false, sex: false, date: false, school: false});

  const [profileData, setProfileData] = useState<UserData>();
  const [followedBtn, setFollowedBtn] = useState(false);
  const [activeTab, setActiveTab] = useState('publicaciones'); // Estado para manejar la pestaña activa


  useEffect(() => {
    async function getCompleteUserData() {
      if(!own) {
        const response = await fetch(`/api/search/completeUser?uid=${userData?.uid}&id=${userData?.id}&uidToSearch=${profile_uid}`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        //console.log(data);
        setProfileData(data.usuario as UserData);
        setFollowedBtn(data.followed as boolean);
        setIsLoadingScreen(false);
      } else {
        //Get your remaining information
        const response = await fetch(`/api/auth?id=${userData?.id}`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`

          },
        });

        const data = await response.json();
        setProfileData({...userData as UserData, publicaciones: data});
        setIsLoadingScreen(false);
      }
    }

    getCompleteUserData();
  }, [own, profile_uid, userData]);

  async function followUser() {
    setBtnLoading(true);
    try {
      const response = await fetch(`/api/follow`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: profile_uid,
          uidFollower: userData?.uid, 
          isFollowed: followedBtn
        }),
      });

      console.log(await response.json());
      setFollowedBtn(!followedBtn);
      setProfileData({...profileData as UserData, seguidores: followedBtn ? profileData?.seguidores as number - 1 : profileData?.seguidores as number + 1});
      updateUserData({...userData as UserData, siguiendo: followedBtn ? userData?.siguiendo as number - 1 : userData?.siguiendo as number + 1})
    } finally {
      setBtnLoading(false);
    }
  }

  async function updatePublicData (data: string | boolean | null, field: string) {
    try {
      const response = await fetch(`/api/auth`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userData?.id, 
          [field]: data
        }),
      });

      if(response.ok) {
        updateUserData({...userData as UserData, [field]: data});
        
      }
      return response.ok;
      
    } catch (error) {
      console.log(error);
      return false
    }
  }

  function showModal(texts: {txtBtn: string, title: string, msg: string}): Promise<boolean> {
    return new Promise((resolve) => {
      setModalConfig({ isOpen: true, texts, resolve });
    });
  }

  if(isLoadingScreen) {
    return <Loading />
  }

  console.log(profileData);

  return (
    <ProtectedRoute>
      <Header route={own ? 'PROFILE': 'NON'}/>
      <main className="min-h-screen bg-slate-100 flex flex-col text-black">
        {/* Encabezado del perfil */}
        <header className="h-[70vh] flex flex-col items-center bg-white">
          <Image
            src={profileData?.coverUrl ? profileData.coverUrl : '/images/default-cover.png'}
            alt="Imagen de fondo de perfil"
            width={1300}
            height={200}
            className="w-[60%] h-[70%] rounded-b-xl min-h-[70%]"
          />
          <div className="flex flex-col w-[60%] h-[100%] px-5">
            <div className="flex border-b-2 border-gray">
              <Image
                src={profileData?.avatarUrl ? profileData.avatarUrl : '/images/default-user.png'}
                alt="Imagen de Usuario"
                width={210}
                height={0}
                className="rounded-full mt-[-60px] mb-5 max-h-44 max-w-40"
              />
              <div className="p-5 w-full">
                <h1 className="text-4xl font-bold">{profileData?.nombreUsuario}</h1>
                <div className="flex gap-5">
                  <h5 className="text-gray-500">
                    <span className="font-bold text-black">{profileData?.seguidores}</span> Seguidores
                  </h5>
                  <h5 className="text-gray-500">
                    <span className="font-bold text-black">{profileData?.siguiendo}</span> Siguiendo
                  </h5>
                  <div className="w-full flex justify-end">
                    {own ? 
                    (<Modal />) 
                    : 
                    (
                      <FollowButton followed={followedBtn} loading={btnLoading} onClick={followUser}/>
                    )
                    }
                    
                  </div>
                </div>
              </div>
            </div>
            {/* Tabs de navegación */}
            <div className="h-[100%] px-5 flex gap-10 items-center">
              <button
                className={`font-bold ${
                  activeTab === 'publicaciones'
                    ? 'text-blue-400 border-blue-400 border-b-4'
                    : 'text-gray-500'
                } h-full`}
                onClick={() => setActiveTab('publicaciones')}
              >
                Publicaciones
              </button>
              <button
                className={`font-bold ${
                  activeTab === 'informacion'
                    ? 'text-blue-400 border-blue-400 border-b-4'
                    : 'text-gray-500'
                } h-full`}
                onClick={() => setActiveTab('informacion')}
              >
                Información
              </button>
            </div>
          </div>
        </header>

        {/* Contenido dinámico según la pestaña activa */}
        <section className="w-[60%] mx-auto mt-5 mb-5">
          {activeTab === 'publicaciones' && (
            <div className="bg-white p-5 rounded-lg shadow flex flex-col gap-1">
              <h2 className="text-lg font-bold mb-4">Publicaciones</h2>
              {profileData?.publicaciones.map((pub, index) => {
                const yourInteractions = pub.interacciones as string[];
                const isLiked = yourInteractions.includes("LIKE");
                const isAlert = yourInteractions.includes("ALERT");
                return (
                  <Card_Publication
                    key={index}
                    infoPublication={pub}
                    infoCreator={profileData}
                    isLiked={isLiked}
                    isAlerted={isAlert}
                    showOptionsBtn={own}
                    onPressDelete={showModal}
                    onPressAlert={(alerted) => showModal({
                      txtBtn: alerted ? 'Quitar Alerta' : 'Si, Alertar',
                      msg: alerted ? '¿Estás seguro de que quieres Quitar tu Alerta a esta publicación?' : '¿Estás seguro de que quieres agregar tu Alerta a esta publicación?',
                      title: alerted ? 'Eliminar Alerta' :'Mandar Alerta'})}
                    onPressPublication={() => router.push(`../publication_complete/${pub.id}`)}
                    onClickUser={() => window.scrollTo({ top: 0, behavior: 'smooth' })}/>
                )
              })}
            </div>
          )}
          {activeTab === 'informacion' && (
            <div className="bg-white p-5 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-4">Información</h2>
              <InformationComponent 
                title='Nombre completo'
                data={profileData?.nombreCompleto !== null ? profileData?.nombreCompleto as string : ""}
                type='text'
                name='nombreCompleto'
                isEdit={editMode.name}
                onChangeEdit={(value) => setEditMode({name: value, sex: false, date: false, school: false})}
                onClickSave={updatePublicData}
              >
                <User/>
              </InformationComponent>
              <InformationComponent 
                title='Sexo'
                data={profileData?.sexo !== null ? profileData?.sexo.toString() as string : ""}
                type='select'
                name='sexo'
                isEdit={editMode.sex}
                onChangeEdit={(value) => setEditMode({name: false, sex: value, date: false, school: false})}
                onClickSave={updatePublicData}
              >
                <VenusAndMars/>
              </InformationComponent>
              <InformationComponent
                title='Fecha de nacimiento'
                data={profileData?.fechaNacimiento !== null ? profileData?.fechaNacimiento as string : ""}
                type='date'
                name='fechaNacimiento'
                isEdit={editMode.date}
                onChangeEdit={(value) => setEditMode({name: false, sex: false, date: value, school: false})}
                onClickSave={updatePublicData}
              >
                <Calendar1/>
              </InformationComponent>
              <InformationComponent
                title='Carrera'
                data={profileData?.carrera !== null ? profileData?.carrera as string : ""}
                type='text'
                name='carrera'
                isEdit={editMode.school}
                onChangeEdit={(value) => setEditMode({name: false, sex: false, date: false, school: value})}
                onClickSave={updatePublicData}
              >
                <University/>
              </InformationComponent>
            </div>
          )}
        </section>
      </main>
      {modalConfig && (
        <ConfirmationModal
          title={modalConfig.texts.title}
          textBtn={modalConfig.texts.txtBtn}
          msg={modalConfig.texts.msg}
          onClose={(confirm) => {
            modalConfig.resolve(confirm);
            setModalConfig(null);
          }}
        />
      )}
    </ProtectedRoute>
  );
}
