import React, { useState } from 'react';
import Image from 'next/image';

const Modal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div>
      {/* Botón para abrir el modal */}
      <button
        onClick={toggleModal}
        className="flex gap-2 px-4 py-2 font-bold rounded-lg text-white bg-blue-500 hover:bg-blue-600"
      >
        <Image 
          src="/images/edit-1-svgrepo-com.svg" // Ruta en la carpeta public
          alt="Un ícono SVG"
          width={25}
          height={20}
        />
        Editar Foto
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-96">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Editar Fotos</h2>
            </div>
            <div className="px-6 py-4 space-y-6">
              {/* Sección Foto de Perfil */}
              <div className="flex items-center gap-4">
              <Image
                  src = '/images/messirve.jpg'
                  alt = 'Un ícono JPG'
                  width = {80}
                  height = {80}
                  className='rounded-full'
                />
                <div>
                  <h3 className="font-semibold text-lg">Foto de Perfil</h3>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="text-blue-500"
                  />
                </div>
              </div>

              {/* Sección Foto de Portada */}
              <div className="flex items-center gap-4">
              <Image
                  src = '/images/good.jpg'
                  alt = 'Un ícono JPG'
                  width = {100}
                  height = {200}
                  className='rounded'
                />
                <div>
                  <h3 className="font-semibold text-lg">Foto de Portada</h3>
                  <button className="text-blue-500">Cambiar Foto</button>
                </div>
              </div>
            </div>
            <div className="flex justify-end px-6 py-4 border-t">
              <button
                onClick={toggleModal}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
