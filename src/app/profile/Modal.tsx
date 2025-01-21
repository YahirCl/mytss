import React, { useState } from 'react';
import Image from 'next/image';

const Modal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('/images/messirve.jpg'); // Imagen por defecto
  const [coverImage, setCoverImage] = useState<string>('/images/good.jpg'); // Imagen por defecto
  const [isProfileChanged, setIsProfileChanged] = useState(false); // Para controlar si la foto de perfil se cambió
  const [isCoverChanged, setIsCoverChanged] = useState(false); // Para controlar si la foto de portada se cambió

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string); // Actualiza la imagen mostrada
        setIsProfileChanged(true); // Marca que la foto de perfil fue cambiada
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string); // Actualiza la imagen mostrada
        setIsCoverChanged(true); // Marca que la foto de portada fue cambiada
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Lógica para guardar las imágenes (puedes agregar aquí la lógica que necesites)
    console.log("Guardando cambios...");
    // Después de guardar, restablece los cambios
    setIsProfileChanged(false);
    setIsCoverChanged(false);
  };

  return (
    <div className="flex justify-center items-center">
      {/* Botón para abrir el modal */}
      <button
        onClick={toggleModal}
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

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-xl w-96 animate-fadeIn">
            <div className="px-6 py-4 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Editar Fotos</h2>
            </div>
            <div className="px-6 py-4 space-y-6">
              {/* Sección Foto de Perfil */}
              <div className="flex items-center gap-4">
                <Image
                  src={profileImage}
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

              {/* Sección Foto de Portada */}
              <div className="flex items-center gap-4">
                <Image
                  src={coverImage}
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
              {/* Botón de Cerrar */}
              <button
                onClick={toggleModal}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition-all duration-300"
              >
                Cerrar
              </button>
              {/* Botón de Guardar, solo visible si se cambiaron las fotos */}
              {(isProfileChanged || isCoverChanged) && (
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
    </div>
  );
};

export default Modal;
