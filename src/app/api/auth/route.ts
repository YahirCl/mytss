import { verifyToken } from '@/libs/authMiddleware';
import { prisma } from '@/libs/db';
import { NextRequest, NextResponse } from 'next/server';

// Crear un nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log(data);

    await prisma.usuario.create({
      data: {
        uid: data.uid,
        nombreUsuario: data.nombreUsuario,
        nombreCompleto: data.nombreCompleto,
        email: data.email,
      },
    });

    return NextResponse.json("Usuario registrado correctamente");
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Error al registrar usuario', error: error }, { status: 500 });
  }
}

// Obtener un usuario por UID
export async function GET(request: NextRequest) {
  try {
    const authResponse = await verifyToken(request);
    if (authResponse) return authResponse;

    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') as string);
    const uid = searchParams.get('uid');

    if (id) {
      //Search for ID, getting your remaining information
      const rI = await prisma.publicacion.findMany({
        where: {usuarioId: id},
        select: {
          id: true,
          contenido: true,
          emocion: true,
          fechaPublicacion: true,
          likes: true,
          reposts: true,
          nivelVacio: true,
          interacciones: {
            where: {usuarioId: id},
            select: {tipoInteraccion: true},
          }
        }
      });

      const formattedPublications = rI.map(pub => ({
        ...pub,
        interacciones: pub.interacciones.map(i => i.tipoInteraccion)
      }));

      if (!rI) {
        return NextResponse.json({ message: 'No se encontraron publicaciones de este Usuario' }, { status: 404 });
      }
      
      return NextResponse.json(formattedPublications);
    } else if (uid) {
      //Search for UID, getting your necessary information
      const usuario = await prisma.usuario.findUnique({
        where: { uid: uid },
        include: {encuesta: {
          select: {
            puntajeDesesperanza: true,
            riesgoAlto: true,
            fecha: true
          }
        }}
      });

      if (!usuario) {
          return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
      }
      
      return NextResponse.json({...usuario, encuesta: !!usuario.encuesta});
    }

    // Si no se proporciona ni ID ni email
    return NextResponse.json({ message: 'Se requiere un parámetro de búsqueda (uid)' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: 'Error al buscar usuario', error: error }, { status: 500 });
  }
}
  

// Actualizar un usuario por ID
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...resto } = data;

    console.log(resto);

    await prisma.usuario.update({
      where: { id: id },
      data: resto,
    });

    return NextResponse.json({
      message: 'Usuario actualizado correctamente',
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error al actualizar usuario', error: error }, { status: 500 });
  }
}

// Eliminar un usuario por ID
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    await prisma.usuario.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    return NextResponse.json({ message: 'Error al eliminar usuario', error: error }, { status: 500 });
  }
}