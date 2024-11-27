import Link from 'next/link'
import React from 'react'
import { redirect } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function page() {

  const { user } = useAuth();

  console.log(user);

  if(user) {
    redirect('/dashboard');
  } else {
    redirect('/auth/login');
  }
  return (
    <div className='bg-white'>
        <h1 className='text-black'>HHolaomeaaaaaaaaaaaaaaaaaaaaaaaa</h1>
        <Link href="/auth/login" className='text-black'>Ir</Link>
    </div>
  )
}
