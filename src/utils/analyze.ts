import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Asegúrate de agregar tu clave en .env.local
});

export type NivelVacio = "bueno" | "llamado de atención" | "alerta de vacío existencial";

const NIVELES: NivelVacio[] = ["bueno", "llamado de atención", "alerta de vacío existencial"];

// Instrucciones con el contexto de la aplicación y criterios claros para clasificar.
const SYSTEM_PROMPT = `Eres un asistente de apoyo para psicólogos en una red social universitaria. Los estudiantes publican cómo se sienten y tú clasificas cada publicación para detectar señales de VACÍO EXISTENCIAL (falta de sentido o propósito en la vida, logoterapia de Viktor Frankl) y DESESPERANZA (escala de Beck), para que un psicólogo pueda dar seguimiento oportuno.

Clasifica en uno de estos tres niveles:

1. "bueno": No hay señales de riesgo. Incluye:
   - Saludos, preguntas y mensajes cortos o neutrales ("hola", "hola?", "buenos días", "¿alguien sabe a qué hora es el examen?").
   - Comentarios cotidianos, bromas, planes, noticias, opiniones.
   - Emociones negativas normales y pasajeras ligadas a algo concreto ("qué flojera la clase", "me enojé porque perdió mi equipo", "estoy cansado", "me fue mal en el examen").
   - Ante la duda o falta de información, usa "bueno". Un mensaje corto o ambiguo NUNCA es motivo de alerta por sí solo.

2. "llamado de atención": Señales moderadas que conviene observar, sin llegar a riesgo grave:
   - Tristeza, desánimo o estrés que parece persistente o generalizado, no solo por un evento puntual ("últimamente nada me sale bien", "siento que no avanzo en nada").
   - Aislamiento o soledad ("no tengo con quién hablar", "nadie me entiende").
   - Apatía o falta de motivación sostenida ("ya no me dan ganas de nada", "no quiero ir a la escuela", "me da igual todo").
   - Dudas sobre el propio valor o rumbo ("no sé qué estoy haciendo con mi vida").

3. "alerta de vacío existencial": Señales graves que requieren atención prioritaria:
   - Sensación clara de que la vida no tiene sentido o propósito ("nada tiene sentido", "no sé para qué vivo").
   - Desesperanza sobre el futuro ("nunca va a mejorar", "no tengo futuro").
   - Sentirse vacío, una carga o que a nadie le importaría su ausencia.
   - Cualquier mención, directa o indirecta, de querer morir, desaparecer, hacerse daño o suicidio, incluso en tono de broma.

Reglas:
- Basa tu decisión en lo que el texto realmente dice, no en suposiciones. No sobreinterpretes signos de puntuación, faltas de ortografía ni mensajes breves.
- Considera el lenguaje coloquial y el sarcasmo de estudiantes mexicanos ("me muero de risa", "me muero de hambre" son expresiones normales, no riesgo).
- La emoción que el usuario eligió es solo contexto: no clasifiques como riesgo solo por la emoción si el texto no muestra señales.
- Si dudas entre dos niveles y hay evidencia real de riesgo, elige el más alto (es preferible que el psicólogo revise de más a que se pase por alto un caso).`;

export async function analyzeText(text: string, emocion?: string): Promise<string> {
  try {
    if (!text || !text.trim()) {
      throw new Error("Texto requerido");
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0, // respuestas consistentes: el mismo texto siempre da el mismo resultado
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Emoción elegida por el usuario: ${emocion ? emocion : "ninguna"}\nPublicación:\n"""${text.trim()}"""`,
        },
      ],
      // Salida estructurada: obliga a razonar brevemente y a devolver solo un nivel válido
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "clasificacion",
          strict: true,
          schema: {
            type: "object",
            properties: {
              razonamiento: {
                type: "string",
                description: "Explicación breve (1-2 oraciones) de las señales encontradas o de por qué no hay riesgo.",
              },
              nivel: { type: "string", enum: NIVELES },
            },
            required: ["razonamiento", "nivel"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message.content ?? "";
    let nivel: string | undefined;
    try {
      nivel = (JSON.parse(content) as { nivel?: string }).nivel;
    } catch {
      nivel = undefined;
    }

    if (nivel && (NIVELES as string[]).includes(nivel)) {
      return nivel;
    }

    // Respaldo por si la respuesta no viene en el formato esperado
    const match = content.toLowerCase().match(/(alerta de vacío existencial|llamado de atención|bueno)/);
    return match ? match[0] : "No válido";
  } catch (error) {
    console.error("Error en la API de OpenAI:", error);
    return "Error al analizar el texto";
  }
}
