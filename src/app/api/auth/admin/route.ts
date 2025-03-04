import { verifyToken } from '@/libs/authMiddleware';
import { prisma } from '@/libs/db';
import { NextRequest, NextResponse } from 'next/server';

// Obtener un usuario por UID
export async function GET(request: NextRequest) {
  try {
    const authResponse = await verifyToken(request);
    if (authResponse) return authResponse;

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    // const id = parseInt(searchParams.get('id') as string);
    // const uid = searchParams.get('uid');

    if (q) {
      if (q === 'Lista_de_Alumnos') {
        const users = await prisma.encuesta.findMany({
          orderBy:{ puntajeDesesperanza : 'desc'},
          select: {
            puntajeDesesperanza: true,
            riesgoAlto: true,
            usuario: {
              select: {
                uid: true,
                nombreUsuario: true,
                avatarUrl: true,
              }
            }
          }
        });

        return NextResponse.json(users);

      } else if (q === 'Reportes') {
        const pubs = await prisma.publicacion.findMany({
          orderBy:{ alertas : 'desc'},
          select: {
            id: true,
            contenido: true,
            emocion: true,
            fechaPublicacion: true,
            alertas: true,
            nivelVacio: true,
            usuario: {
              select: {
                nombreUsuario: true,
              }
            }
          }
        });

        return NextResponse.json(pubs);

      } else if (q === 'Mensajes_con_nivel_Alto') {
        const pubs = await prisma.publicacion.findMany({
          where: {nivelVacio: 'alerta de vacío existencial'},
          select: {
            id: true,
            contenido: true,
            emocion: true,
            fechaPublicacion: true,
            alertas: true,
            nivelVacio: true,
            usuario: {
              select: {
                nombreUsuario: true,
              }
            }
          }
        });

        return NextResponse.json(pubs);

      } else {
        return NextResponse.json({ message: 'Parámetro de Búsqueda incorrecto'}, { status: 500 });
      }
      
    //   if (!rI) {
    //     return NextResponse.json({ message: 'No se encontraron publicaciones de este Usuario' }, { status: 404 });
    //   
    } 

    // Si no se proporciona ninguna Query
    return NextResponse.json({ message: 'Se requiere un parámetro de búsqueda' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: 'Error al buscar usuario', error: error }, { status: 500 });
  }
}