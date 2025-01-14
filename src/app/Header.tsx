import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Header() {
    const router = useRouter();
  return (
    <header className='bg-[#3C5998] flex justify-between p-3'>

        <search className='bg-slate-50 flex flex-row rounded-full px-3 py-1 gap-2'>
            <Image
                src="/images/search-svgrepo-com.svg" // Ruta en la carpeta public
                alt="Un ícono SVG"
                width={20}
                height={20}
            />
            <input placeholder='Buscar'/>
        </search>

        <div className='flex flex-row justify-center pr-60 gap-6'>
            <button onClick={ () => { router.push('/dashboard') } }>
            <Image 
                src="/images/home-1-svgrepo-com.svg" // Ruta en la carpeta public
                alt="Un ícono SVG"
                width={30}
                height={20}
            />
            </button>
                <button onClick={ () => { router.push('/profile') } }>
                <Image 
                src="/images/user-avatar-profile-svgrepo-com.svg" // Ruta en la carpeta public
                alt="Un ícono SVG"
                width={25}
                height={20}
            />
            </button>
                <Image 
                src="/images/bell-ring-svgrepo-com.svg" // Ruta en la carpeta public
                alt="Un ícono SVG"
                width={30}
                height={20}
            />
        </div>

        <div>
            <Image 
                src="/images/menu-svgrepo-com.svg" // Ruta en la carpeta public
                alt="Un ícono SVG"
                width={30}
                height={20}
            />
        </div>
    </header>
  )
}


