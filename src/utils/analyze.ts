import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Asegúrate de agregar tu clave en .env.local
});

export async function analyzeText(text: string): Promise<string> {
  try {
    if (!text) {
      throw new Error("Texto requerido");
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Analiza el siguiente texto y responde únicamente con una de estas tres palabras, sin agregar explicaciones adicionales:
- "bueno": si el texto es positivo y no presenta señales de riesgo.
- "llamado de atención": si el texto muestra advertencias o señales preventivas.
- "alerta de vacío existencial": si el texto revela signos de vacío emocional o existencial.

Texto: "${text}"`,
        },
      ],
    });

    const responseText = response.choices[0]?.message.content?.trim() || "";
    const regex = /\b(bueno|llamado de atención|alerta de vacío existencial)\b/;
    const match = responseText.match(regex);

    return match ? match[0] : "No válido";
  } catch (error) {
    console.error("Error en la API de OpenAI:", error);
    return "Error al analizar el texto";
  }
}
