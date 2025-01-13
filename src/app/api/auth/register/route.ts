import { prisma } from '@/libs/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST( request: NextRequest) {
    const data = await request.json();

    await prisma.user.create({
        data: data
    });

    return NextResponse.json('Usuario Registrado Correctamente');
}   