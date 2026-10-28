import { prisma } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";
import { analyzeText } from '@/utils/analyze'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    let analyze = "";
    
    if(data.content) {
      analyze = await analyzeText(data.content);
    }

    const pub = await prisma.publicacion.create({
      data: {
        contenido: data.content,
        emocion: data.emocion,
        nivelVacio: analyze,
        usuarioId: data.userID
      },
      select: {
        id: true,
        contenido: true,
        emocion: true,
        fechaPublicacion: true,
        likes: true,
        reposts: true,
        nivelVacio: true,
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


    return NextResponse.json({
      msg: 'Publicación creada Correctamente',
      pub: { ...pub, interacciones: pub.interacciones.map(i => i.tipoInteraccion) }
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: 'Error al crear la publicación', error: error }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const yourId = parseInt(searchParams.get('id') as string) || 0;
      // Buscar por ID si se proporciona
      const publications = await prisma.publicacion.findMany({
        orderBy: { id: 'asc' },
        select: {
          id: true,
          contenido: true,
          emocion: true,
          fechaPublicacion: true,
          likes: true,
          reposts: true,
          nivelVacio: true,
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
    } catch (error) {
        return NextResponse.json({ message: 'Error al buscar usuario', error: error }, { status: 500 });
    }
}

export async function DELETE (request: NextRequest) {
  try {
    const data = await request.json();

    await prisma.publicacion.delete({
      where: {id: data.pubId}
    })


    return NextResponse.json({msg: 'Publicación Eliminada Correctamente'});
  } catch (error) {
    return NextResponse.json({ message: 'Error al Eliminar Publicación', error: error }, { status: 500 });
  }
}

export async function PUT (request: NextRequest) {
  try {
    const data = await request.json();

    const { pubId, nContent, nEmotion } = data;

    await prisma.publicacion.update({
      where: {id: pubId},
      data: {
        contenido: nContent,
        emocion: nEmotion
      }
    })


    return NextResponse.json({msg: 'Publicación Actualizada Correctamente'});
  } catch (error) {
    return NextResponse.json({ message: 'Error al Actualizar la Publicación', error: error }, { status: 500 });
  }
}