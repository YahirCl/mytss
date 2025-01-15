import { prisma } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const pub = await prisma.publicacion.create({
      data: {
        contenido: data.content,
        usuarioId: data.userID
      },
      include: {usuario: true}
    });

    return NextResponse.json({msg: 'Publicación creada Correctamente', pub: pub});
  } catch (error) {
    console.log(error);
  }
}

export async function GET() {
    try {
        // Buscar por ID si se proporciona
        const publications = await prisma.publicacion.findMany({
            include: {usuario: true}
        });

        if (!publications) {
            return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
        }

        return NextResponse.json(publications);


        // Si no se proporciona ni ID ni email
        return NextResponse.json({ message: 'Se requiere un parámetro de búsqueda (uid)' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al buscar usuario', error: error.message }, { status: 500 });
    }
}