import { prisma } from '@/libs/db';
import { NextRequest, NextResponse } from 'next/server';

// Obtener un usuario por UID
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userQuery = searchParams.get('q');
        const yourID = searchParams.get('uid');

        // Buscar por ID si se proporciona
        if (userQuery) {
        const usuario = await prisma.usuario.findMany({
            where: {
              AND: [
                {
                  nombreUsuario: {
                    contains: userQuery, // Coincidencias parciales en el nombre
                  },
                },
                {
                  uid: {
                    not: yourID as string, // Excluir al usuario actual por ID
                  },
                },
              ],
            },
            select: {
              uid: true,
              avatarUrl: true,
              nombreUsuario: true
            },
        });


        if (!usuario) {
            return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
        }

        return NextResponse.json(usuario);
        }

        // Si no se proporciona ni ID ni email
        return NextResponse.json({ message: 'Se requiere un parámetro de búsqueda (uid)' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al buscar usuario', error: error }, { status: 500 });
    }
}