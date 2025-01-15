import { prisma } from '@/libs/db';
import { NextRequest, NextResponse } from 'next/server';

// Crear un nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

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
    return NextResponse.json({ message: 'Error al registrar usuario', error: error.message }, { status: 500 });
  }
}

// Obtener un usuario por UID
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const uid = searchParams.get('uid');

        // Buscar por ID si se proporciona
        if (uid) {
        const usuario = await prisma.usuario.findUnique({
            where: { uid: uid },
        });

        if (!usuario) {
            return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
        }

        return NextResponse.json(usuario);
        }

        // Si no se proporciona ni ID ni email
        return NextResponse.json({ message: 'Se requiere un parámetro de búsqueda (uid)' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al buscar usuario', error: error.message }, { status: 500 });
    }
}
  

// Actualizar un usuario por ID
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...resto } = data;

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: id },
      data: resto,
    });

    return NextResponse.json({
      message: 'Usuario actualizado correctamente',
      usuario: usuarioActualizado,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error al actualizar usuario', error: error.message }, { status: 500 });
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
    return NextResponse.json({ message: 'Error al eliminar usuario', error: error.message }, { status: 500 });
  }
}