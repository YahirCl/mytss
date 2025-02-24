import { prisma } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const { pubId, userId, isLiked } = await request.json();

    // Validar que pubId y userId existan
    if (!pubId || !userId) {
      return NextResponse.json(
        { success: false, message: "pubId y userId son requeridos" },
        { status: 400 }
      );
    }

    // Ejecutar la transacción
    await prisma.$transaction(async (prisma) => {
      if(isLiked) {
        // Borrar la interacción
        await prisma.interaccion.delete({
            where: {
              usuarioId_publicacionId: {
                usuarioId: userId,
                publicacionId: pubId,
              },
            },
          });

        // Decrementar el contador de likes
        await prisma.publicacion.update({
            where: { id: pubId },
            data: { likes: { decrement: 1 } },
        });
      } else {
        // Crear la interacción
        await prisma.interaccion.create({
          data: {
          usuarioId: userId,
          publicacionId: pubId,
          tipoInteraccion: "LIKE",
            },
        });

        // Incrementar el contador de likes
        await prisma.publicacion.update({
          where: { id: pubId },
          data: { likes: { increment: 1 } },
        });
      }

    });

    // Respuesta de éxito
    return NextResponse.json(
      { success: true, message: "Like registrado correctamente", pubId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al dar like:", error);

    // Respuesta de error
    return NextResponse.json(
      { success: false, message: "Error al dar like", error: error },
      { status: 500 }
    );
  }
}
