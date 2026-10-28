import { NextRequest, NextResponse } from "next/server";
import admin from './firebaseAdmin';
import { prisma } from './db';

export async function verifyToken (request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    await admin.auth().verifyIdToken(token);
    return null; // Indica que la autenticación pasó
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}

// Verifica el token y además que el usuario sea administrador (usuarioEspecial)
export async function verifyAdmin (request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const usuario = await prisma.usuario.findUnique({
      where: { uid: decodedToken.uid },
      select: { usuarioEspecial: true },
    });

    if (!usuario?.usuarioEspecial) {
      return NextResponse.json({ error: "Acceso solo para administradores" }, { status: 403 });
    }
    return null;
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}
