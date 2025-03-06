import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <p className="text-xl text-gray-700 mt-2">
        ¡Oops! Parece que te perdiste.
      </p>

      <Image
        width={100}
        height={100}
        src="/images/confused-face-emoji.png" 
        alt="Astronauta perdido" 
        className="w-auto h-auto mt-6"
      />
      <Link 
        href="/" 
        className="mt-10 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500 transition"
      >
        Volver al inicio
      </Link>
    </div>
  )
}