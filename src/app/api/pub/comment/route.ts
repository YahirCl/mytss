import { prisma } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log(data);

    await prisma.$transaction(async (prisma) => {
      await prisma.comentario.create({
        data: {
          usuarioId: data.userID,
          publicacionId: data.publicationID,
          contenido: data.content
        },
      });

      await prisma.publicacion.update({
        data: {
            reposts: {increment: 1}
        },
        where: {id: data.publicationID}
      })
    });
    
    return NextResponse.json({msg: 'Comentario creado Correctamente'});
  } catch (error) {
    console.log(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicationId = parseInt(searchParams.get('id') as string);
    const yourId = parseInt(searchParams.get('yourId') as string);

    const res = await prisma.publicacion.findUnique({
      where: {id: publicationId},
      select: {
        contenido: true,
        emocion: true,
        likes: true,
        reposts: true,
        fechaPublicacion: true,
        usuario: {
          select: {
            uid: true,
            avatarUrl: true,
            nombreUsuario: true
          }
        },
        interacciones: {
          where: {usuarioId: yourId},
          select: {tipoInteraccion: true},
        },
        comentarios: {
          select: {
            id: true,
            contenido: true,
            fechaComentario: true,
            usuario: {
              select: {
                uid: true,
                avatarUrl: true,
                nombreUsuario: true
              }
            },
          }
        }
      }
    });


    return NextResponse.json(res);

    // Si no se proporciona ni ID ni email
    //return NextResponse.json({ message: 'Se requiere un parámetro de búsqueda (uid)' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: 'Error al buscar usuario', error: error.message }, { status: 500 });
  }
}