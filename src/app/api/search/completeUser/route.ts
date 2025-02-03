import { prisma } from '@/libs/db';
import { NextRequest, NextResponse } from 'next/server';

// Obtener un usuario por UID
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const uid = searchParams.get('uid');
        const id = parseInt(searchParams.get('id') as string);
        const uidToSearch = searchParams.get('uidToSearch');

        // Buscar por UID si se proporciona
        if (uidToSearch && uid) {
          const usuario = await prisma.usuario.findUnique({
            where: { uid: uidToSearch },
            select: {
              avatarUrl: true,
              coverUrl: true,
              nombreUsuario: true,
              nombreCompleto: true,
              fechaRegistro: true,
              siguiendo: true,
              seguidores: true,
              publicaciones: {
                omit: {usuarioId: true},
                include: {
                  interacciones: {
                    where: {usuarioId: id},
                    select: {tipoInteraccion: true},
                  }
                }
              }
            }
          });

          const isFollowed = await prisma.seguidor.findFirst({
            where: {
              seguidorUid: uid,
              seguidoUid: uidToSearch,
            }
          });
          const formattedPublications = usuario?.publicaciones.map(pub => ({
            ...pub,
            interacciones: pub.interacciones.map(i => i.tipoInteraccion)
          }));
          const formattedResponse = {
            usuario: {...usuario, publicaciones: formattedPublications},
            followed: !!isFollowed
          }

          if (!usuario) {
            return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
          }

          return NextResponse.json(formattedResponse);
        }

        // Si no se proporciona ni ID ni email
        return NextResponse.json({ message: 'Se requiere un parámetro de búsqueda (uid)' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al buscar usuario', error: error.message }, { status: 500 });
    }
}