import { prisma } from '@/libs/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log(data.file);
    return NextResponse.json("Hola chavales")
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Error al registrar usuario', error: error.message }, { status: 500 });
  }
}