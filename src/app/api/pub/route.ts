import { prisma } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const pub = await prisma.publicacion.create({
      data: {
        contenido: data.content,
        emocion: data.emocion,
        usuarioId: data.userID
      },
      select: {
        id: true,
        contenido: true,
        emocion: true,
        fechaPublicacion: true,
        likes: true,
        reposts: true,
        usuario: {
          select: {
            uid: true,
            nombreUsuario: true,
            avatarUrl: true,
          }
        },
        interacciones: {
          where: {usuarioId: data.userID},
          select: {tipoInteraccion: true},
        }
      }
      
    });

    return NextResponse.json({msg: 'Publicación creada Correctamente', pub: pub});
  } catch (error) {
    console.log(error);
  }
}

export async function GET(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const yourId = parseInt(searchParams.get('id') as string);
      // Buscar por ID si se proporciona
      const publications = await prisma.publicacion.findMany({
        select: {
          id: true,
          contenido: true,
          emocion: true,
          fechaPublicacion: true,
          likes: true,
          reposts: true,
          usuario: {
            select: {
              uid: true,
              nombreUsuario: true,
              avatarUrl: true,
              siguiendo: true,
              seguidores: true,
            }
          },
          interacciones: {
            where: {usuarioId: yourId},
            select: {tipoInteraccion: true},

          }
        },
        });

        if (!publications) {
            return NextResponse.json({ message: 'Publicaciones no encontrado' }, { status: 404 });
        }

        const formattedPublications = publications.map(pub => ({
          ...pub,
          interacciones: pub.interacciones.map(i => i.tipoInteraccion)
        }));

        return NextResponse.json(formattedPublications);


        // Si no se proporciona ni ID ni email
        return NextResponse.json({ message: 'Se requiere un parámetro de búsqueda (uid)' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al buscar usuario', error: error.message }, { status: 500 });
    }
}