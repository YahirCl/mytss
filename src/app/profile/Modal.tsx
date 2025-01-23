import React, { useState } from 'react';
import Image from 'next/image';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useAuth } from '@/hooks/useAuth';

const Modal: React.FC = () => {
  const { userData, updateUserData } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Estado para abrir la modal de confirmación

  const [images, setImages] = useState({
    profileImage: userData?.avatarUrl as string,
    coverImage: userData?.coverUrl as string
  })

  const [newImages, setNewImages] = useState<{
    profileImage: File | null,
    coverImage: File | null
  }>({profileImage: null, coverImage: null});


  const toggleModal = () => {
    if ((images.profileImage !== userData?.avatarUrl) || (images.coverImage !== userData?.coverUrl)) {
      setIsConfirmOpen(true);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImages({...newImages, profileImage: file});

      //Mostrar la imagen seleccionada
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages({...images, profileImage: reader.result as string});
      };
      reader.readAsDataURL(file);
    } 
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImages({...newImages, coverImage: file});

      //Mostrar la imagen seleccionada
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages({...images, coverImage: reader.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiscardChanges = () => {
    // Cierra todo y descarta los cambios
    setIsConfirmOpen(false);
    setIsOpen(false);
    setImages({profileImage: userData?.avatarUrl as string, coverImage: userData?.coverUrl as string});
    setNewImages({profileImage: null, coverImage: null});
  };

  const handleSave = async () => {
    const storage = getStorage();
    let urlProfile = userData?.avatarUrl;
    let urlCover = userData?.coverUrl;

    try {
      if(newImages.profileImage !== null) {
        const storageRef = ref(storage, `/users/${userData?.uid}/profile_img`);
        await uploadBytes(storageRef, newImages.profileImage);
        urlProfile = await getDownloadURL(storageRef);
  
        await fetch(`/api/auth`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: userData?.id,
            avatarUrl: urlProfile,
          })
        });
      }
  
      if(newImages.coverImage !== null) {
        const storageRef = ref(storage, `/users/${userData?.uid}/cover_img`);
        await uploadBytes(storageRef, newImages.coverImage);
        urlCover = await getDownloadURL(storageRef);
  
        await fetch(`/api/auth`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: userData?.id,
            coverUrl: urlCover,
          })
        });
      }

      updateUserData({...userData, avatarUrl:  urlProfile, coverUrl: urlCover} as UserData);
      alert("Fotos actualizadas correctamente");
      setNewImages({coverImage: null, profileImage: null});
      setIsOpen(!isOpen);


    } catch (error) {
      console.error('Ocurrió un Error al actualizar la foto', error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300"
      >
        <Image
          src="/images/edit-1-svgrepo-com.svg"
          alt="Ícono de editar"
          width={25}
          height={20}
        />
        Editar Foto
      </button>

      {/* Modal principal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-xl w-96 animate-fadeIn">
            <div className="px-6 py-4 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Editar Fotos</h2>
            </div>
            <div className="px-6 py-4 space-y-6">
              <div className="flex items-center gap-4">
                <Image
                  src={images.profileImage}
                  alt="Foto de Perfil"
                  width={80}
                  height={80}
                  className="rounded-full border border-gray-300"
                />
                <div>
                  <h3 className="font-semibold text-lg">Foto de Perfil</h3>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="mt-2 text-sm file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-500 hover:file:bg-blue-100 file:cursor-pointer"
                    style={{ color: 'transparent' }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Image
                  src={images.coverImage}
                  alt="Foto de Portada"
                  width={160}
                  height={100}
                  className="rounded border border-gray-300"
                />
                <div>
                  <h3 className="font-semibold text-lg">Foto de Portada</h3>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="mt-2 text-sm file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-500 hover:file:bg-blue-100 file:cursor-pointer"
                    style={{ color: 'transparent' }}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end px-6 py-4 border-t space-x-4">
              <button
                onClick={toggleModal}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition-all duration-300"
              >
                Cerrar
              </button>
              {((images.profileImage !== userData?.avatarUrl) || (images.coverImage !== userData?.coverUrl)) && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 transition-all duration-300"
                >
                  Guardar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-xl w-80 animate-fadeIn">
            <div className="px-6 py-4">
              <h2 className="text-xl font-bold text-gray-800">
                ¿Descartar los cambios?
              </h2>
              <p className="text-gray-600 mt-2">
                Hay cambios no guardados. ¿Estás seguro de que quieres salir sin guardar?
              </p>
            </div>
            <div className="flex justify-end px-6 py-4 border-t space-x-4">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-all duration-300"
              >
                No
              </button>
              <button
                onClick={handleDiscardChanges}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition-all duration-300"
              >
                Sí
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
