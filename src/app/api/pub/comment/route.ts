import { prisma } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const comment = await prisma.$transaction(async (prisma) => {
      const newComment = await prisma.comentario.create({
        data: {
          usuarioId: data.userID,
          publicacionId: data.publicationID,
          contenido: data.content
        },
        select: {
          id: true,
          contenido: true,
          fechaComentario: true,
        }
      });

      await prisma.publicacion.update({
        data: {
            reposts: {increment: 1}
        },
        where: {id: data.publicationID}
      })

      return newComment;
    });
    
    return NextResponse.json({comment: comment, msg: 'Comentario creado Correctamente'});
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
        id: true,
        contenido: true,
        emocion: true,
        likes: true,
        reposts: true,
        nivelVacio: true,
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

    const formattedResponse = {
      ...res,
      interacciones : res?.interacciones.map(i => i.tipoInteraccion)
    }

    return NextResponse.json(formattedResponse);

    // Si no se proporciona ni ID ni email
    //return NextResponse.json({ message: 'Se requiere un parámetro de búsqueda (uid)' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: 'Publicación NO Encontrada', error: error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();

    await prisma.$transaction(async (prisma) => {
      await prisma.comentario.delete({
        where: { id: data.commentId }
      });

      await prisma.publicacion.update({
        data: {
            reposts: {decrement: 1}
        },
        where: {id: data.pubId}
      })

    });
    
    return NextResponse.json({msg: 'Comentario Eliminado Correctamente'});
  } catch (error) {
    console.log(error);
  }
}