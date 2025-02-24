import { NextRequest, NextResponse } from "next/server";
import admin from './firebaseAdmin';

export async function verifyToken (request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    request.headers.set("userId", decodedToken.uid); // O puedes devolverlo en la respuesta
    return null; // Indica que la autenticación pasó
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}
