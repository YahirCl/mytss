import React from 'react'
import Image from 'next/image'
import Logo from '../../../../public/images/logo1.png'
import Link from 'next/link'
import MyInput from '../MyInput'

export default function page() {
  return( 
    <div className='bg-white min-h-screen flex justify-center items-center flex-col' >
        <Image
            src={Logo}
            alt='Hola'
            width={400}
            height={300} 
        />
       
       
      <form className='flex flex-col'>
       <MyInput placeholder='Nombre'/>
       <MyInput placeholder='Correo'/>
       <MyInput placeholder='Contraseña'/>
       <MyInput placeholder='Repetir contrase'/>
        <button
          type="submit"
          
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        >
          Registrar
        </button>
      </form>

      <p className='text-black mt-5'>
        Ya tienes cuenta?
        <Link href="/auth/login"  className='text-blue-500'>Inicia sesión</Link>
      </p>
    </div>
  )
}
