import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase-config";

export default function Header() {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsModalOpen(false);
    }
  };

  const toggleMenu = (event) => {
    event.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleModal = (event) => {
    event.stopPropagation();
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className="bg-[#3C5998] flex justify-between items-center p-4">
      {/* Barra de búsqueda */}
      <div className="bg-slate-50 flex flex-row items-center rounded-full px-4 py-2 gap-3">
        <Image
          src="/images/search.svg"
          alt="Buscar"
          width={20}
          height={20}
        />
        <input
          placeholder="Buscar"
          className="outline-none bg-transparent text-sm w-full"
        />
      </div>

      {/* Navegación */}
      <div className="flex items-center gap-6">
        <button onClick={() => router.push("/dashboard")}>
          <Image src="/images/home.svg" alt="Inicio" width={30} height={20} />
        </button>
        <button onClick={() => router.push("/profile")}>
          <Image
            src="/images/profile.svg"
            alt="Perfil"
            width={25}
            height={20}
          />
        </button>
        <button onClick={toggleModal} className="relative">
          <Image
            src="/images/bell-ring.svg"
            alt="Notificaciones"
            width={30}
            height={20}
          />
          {/* Indicador de notificaciones */}
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </button>
      </div>

      {/* Menú desplegable */}
      <div>
        <button onClick={toggleMenu}>
          <Image src="/images/menu.svg" alt="Menú" width={30} height={20} />
        </button>
      </div>

      {isMenuOpen && (
        <div
          className="absolute right-3 top-12 w-56 text-black bg-white shadow-lg rounded-lg"
          ref={menuRef}
        >
          <ul className="py-2">
            <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
              Configuración y privacidad
            </li>
            <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
              Ayuda y asistencia
            </li>
            <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
              Pantalla y accesibilidad
            </li>
            <li
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => auth.signOut()}
            >
              Cerrar sesión
            </li>
          </ul>
        </div>
      )}

      {/* Modal de notificaciones */}
      {isModalOpen && (
        <div
          className="absolute right-3 top-16 w-80 bg-white shadow-xl rounded-lg p-4"
          ref={modalRef}
        >
          <h3 className="font-bold text-lg text-gray-800 mb-3">
            Notificaciones
          </h3>
          <ul className="space-y-2">
            <li className="p-3 bg-gray-50 rounded-lg flex items-center gap-3 hover:bg-gray-100 cursor-pointer">
              <div className="bg-blue-100 p-2 rounded-full">
                <Image
                  src="/images/prueba1.jpg"
                  alt="Icono usuario"
                  width={20}
                  height={20}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Nueva solicitud de amistad
                </p>
                <p className="text-xs text-gray-500">Hace 5 minutos</p>
              </div>
            </li>
            <li className="p-3 bg-gray-50 rounded-lg flex items-center gap-3 hover:bg-gray-100 cursor-pointer">
              <div className="bg-green-100 p-2 rounded-full">
                <Image
                 src="/images/prueba1.jpg"
                  alt="Icono mensaje"
                  width={20}
                  height={20}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Comento en tu publicación
                </p>
                <p className="text-xs text-gray-500">Hace 2 horas</p>
              </div>
            </li>
            <li className="p-3 bg-gray-50 rounded-lg flex items-center gap-3 hover:bg-gray-100 cursor-pointer">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Image
                  src="/images/prueba1.jpg"
                  alt="Icono alerta"
                  width={20}
                  height={20}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Le gusta tu publicación
                </p>
                <p className="text-xs text-gray-500">Hace 1 día</p>
              </div>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
