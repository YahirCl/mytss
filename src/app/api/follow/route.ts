import { prisma } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";

// Seguir a un usuario por su uid
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { uid, uidFollower, isFollowed } = data;

    // Ejecutar la transacción
    await prisma.$transaction(async (prisma) => {
        if(isFollowed) {
          // Borrar la interacción
          await prisma.seguidor.delete({
              where: {
                seguidorUid_seguidoUid: {
                  seguidorUid: uidFollower,
                  seguidoUid: uid
                },
              },
            });
  
          // Decrementar el contador de likes
          await prisma.usuario.update({
            where: { uid: uid },
            data: { seguidores: { decrement: 1 } },
          });

          await prisma.usuario.update({
            where: { uid: uidFollower },
            data: { siguiendo: { decrement: 1 } },
          });
        } else {

          // Crear la interacción
          await prisma.seguidor.create({
            data: {
              seguidorUid: uidFollower,
              seguidoUid: uid
            },
          });
  
          // Incrementar el contador de likes
          await prisma.usuario.update({
            where: { uid: uid },
            data: { seguidores: { increment: 1 } },
          });

          await prisma.usuario.update({
            where: { uid: uidFollower },
            data: { siguiendo: { increment: 1 } },
          });
          
        }
      });
  
      // Respuesta de éxito
      return NextResponse.json(
        { success: true, message: "Follow registrado correctamente"},
        { status: 200 }
      );
  } catch (error) {
    return NextResponse.json({ message: 'Error al dejar tu Follow', error: error }, { status: 500 });
  }
}