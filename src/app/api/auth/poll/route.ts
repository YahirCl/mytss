import { verifyToken } from '@/libs/authMiddleware';
import { prisma } from '@/libs/db';
import { NextRequest, NextResponse } from 'next/server';

// Crear un nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const answers = Object.entries(data.formData).map(([pregunta, respuesta]) => ({
      pregunta,
      respuesta: typeof respuesta === "boolean" ? (respuesta ? "true" : "false") : respuesta as string,
    }))

    await prisma.encuesta.create({
      data: {
        usuarioId: data.usuarioId,
        puntajeDesesperanza: data.puntaje,
        riesgoAlto: data.riesgoAlto,
        respuestas: {
          create: answers
        },
      },
    });

    return NextResponse.json("Datos de la encuesta Guardados Correctamente");
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Error al registrar los datos de la Encuesta', error: error.message }, { status: 500 });
  }
}