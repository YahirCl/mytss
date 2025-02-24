/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { auth } from '@/libs/firebase-config';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from '@/hooks/useAuth';
import LoadingTransparent from '@/app/LoadingTransparent';

export default function EncuestaForm() {
  const router = useRouter();
  const { userData } = useAuth();

  const [formData, setFormData] = useState<any>({
    // Vacío Existencial - Parte I (Valores de Creación)
    ...Array.from({ length: 9 }, (_, i) => [`Logo_S1_R${i + 1}_Val`, '']).reduce((acc, [key]) => ({ ...acc, [key]: '' }), {}),

    // Vacío Existencial - Parte II (Valores de Vivencia)
    ...Array.from({ length: 7 }, (_, i) => [`Logo_S2_R${i + 1}_Val`, '']).reduce((acc, [key]) => ({ ...acc, [key]: '' }), {}),

    // Vacío Existencial - Parte III (Valores de Actitud)
    Logo_S3_R1: '',
    Logo_S3_R2: '',
    Logo_S3_R3: '',

    // Desesperanza (20 ítems)
    ...Array.from({ length: 20 }, (_, i) => [`Desesp_R${i + 1}`, false]).reduce((acc, [key]: any) => ({ ...acc, [key]: false }), {}),

    // Expresiones evaluables
    ...Array.from({ length: 4 }, (_, i) => ([
      [`Expresiones_R${i + 1}`, ''],
      [`Expresiones_R${i + 1}_texto`, '']
    ])).flat().reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {})
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleValidation = () => {
    const newErrors: { [key: string]: string } = {};

    // Validar solo si la respuesta es "Sí"
    ['Expresiones_R1', 'Expresiones_R2', 'Expresiones_R3', 'Expresiones_R4'].forEach((key) => {
      if (formData[key] === 'Sí' && !formData[`${key}_texto`]) {
        newErrors[`${key}_texto`] = 'Por favor, proporciona más detalles.';
      }
    });

    // Retornar false si hay errores, de lo contrario true
    return Object.keys(newErrors).length === 0;
  };

  const calcularPuntajeDesesperanza = () => {
    const positivas = [2,4,7,9,11,12,14,16,17,18,20];
    const negativas = [1,3,5,6,8,10,13,15,19];
    
    return positivas.reduce((acc, num) => acc + (formData[`Desesp_R${num}`] ? 1 : 0), 0) +
           negativas.reduce((acc, num) => acc + (!formData[`Desesp_R${num}`] ? 1 : 0), 0);
  };


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!handleValidation()) {
      alert("Por favor complete todos los campos requeridos");
      return;
    }
    setIsLoading(true);

    const puntaje = calcularPuntajeDesesperanza();
    const resultado = {
      puntaje,
      riesgoAlto: puntaje >= 8,
      fecha: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/auth/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId: userData?.id, formData, ...resultado }),
      });

      if(response.ok) {
        router.replace('/dashboard');
      }
  
    } catch (error) {
      console.error("Error al enviar la encuesta:", error);
    }

    //console.log({...formData, resultado});
    //alert(`Encuesta enviada\nPuntaje de desesperanza: ${puntaje}\nRiesgo alto: ${resultado.riesgoAlto ? 'Sí' : 'No'}`);
  };

  const preguntas = {
    vacioCreacion: [
      "Si soy honesto, prefiero una vida agradable, pacífica, sin grandes dificultades, con suficiente sostén financiero.",
      "Tengo conceptos definidos acerca de lo que quisiera llegar a ser y en qué me gustaría triunfar y trato con todas mis fuerzas de concretar estas ideas.",
      "Me siento bien solamente en el refugio de un hogar, en el círculo de la familia y quisiera hacer lo posible para procurarles una base igual a los hijos.",
      "En mi trabajo profesional, que realizo en la actualidad o para el que me estoy preparando, encuentro mi realización.",
      "Tengo compromisos y relaciones con una o más personas, el cumplimiento de los cuales me da satisfacción.",
      "Existe una especialidad que me interesa notablemente sobre la que quisiera aprender cada vez más y de la cual me ocupo en cuanto tengo tiempo.",
      "Gozo con experiencias de determinada clase (placer en el arte, contemplación de la naturaleza) y no quisiera verme privado de ellas.",
      "Creo firmemente en una misión religiosa o política (o una misión de servicio para el progreso) y me pongo a su disposición.",
      "Mi vida se halla oscurecida por la necesidad, la preocupación, pero me estoy esforzando por mejorar esta situación."
    ],
    vacioVivencia: [
      "Sentimientos de rabia porque pensó que todo lo que realizó hasta ahora fue inútil.",
      "El deseo de volver a ser niño y comenzar de nuevo.",
      "Ha observado que trata de hacer su vida más llena de contenido de lo que realmente es para sí mismo y para los demás.",
      "La aversión de cargarse con pensamientos profundos y eventualmente incómodos sobre su actividad.",
      "La esperanza de transformar en un hecho positivo un propósito fallido o una desgracia, poniendo todo su esfuerzo.",
      "Un impulso de desasosiego que se apodera de Ud. contrariando su buen juicio, y que atrae una torturante falta de interés en todo lo que se le brinda.",
      "El pensamiento de que, ante la muerte, tendría que admitir que no valió la pena vivir."
    ],
    desesperanza: [
      "Espero el futuro con esperanza y entusiasmo",
      "Bien podría rendirme, porque no puedo hacer mejor las cosas por mí mismo",
      "Cuando las cosas van mal, me ayuda saber que no pueden permanecer así por siempre",
      "No puedo imaginar cómo sería mi vida en 10 años",
      "Tengo suficiente tiempo para lograr las cosas que más quiero hacer",
      "En el futuro, espero tener éxito en lo que más me preocupa",
      "Mi futuro me parece oscuro",
      "Espero conseguir más de las cosas buenas de la vida que la persona promedio",
      "Simplemente no consigo buenas oportunidades y no hay razón para creer que las conseguiré en el futuro",
      "Mis experiencias pasadas me han preparado bien para mi futuro",
      "Todo lo que puedo ver delante de mí es desagradable más que agradable",
      "No espero conseguir lo que realmente quiero",
      "Cuando miro hacia el futuro espero que seré más feliz de lo que soy ahora",
      "Las cosas simplemente no funcionarán como yo quiero",
      "Tengo una gran fe en el futuro",
      "Nunca consigo lo que quiero, así que es tonto querer algo",
      "Es muy improbable que obtenga una satisfacción real en el futuro",
      "El futuro me parece vago e incierto",
      "Puedo esperar más buenos momentos que malos momentos",
      "No sirve de nada tratar de obtener algo que quiera, porque probablemente no lo obtendré"
    ]
  };

  const SeccionSelect = ({ titulo, preguntas, opciones, prefijo }: {titulo: string, preguntas: string[], opciones: string[], prefijo: string}) => (
    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">{titulo}</h3>
      {preguntas.map((pregunta, index) => (
        <div key={index} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {index + 1}. {pregunta}
          </label>
          <select
            name={`${prefijo}_R${index + 1}_Val`}
            value={formData[`${prefijo}_R${index + 1}_Val`]}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="">Seleccione...</option>
            {opciones.map((opcion, i) => (
              <option key={i} value={opcion}>{opcion}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );

  const PreguntaCondicional = ({ num, label }: {num: number, label: string}) => {
    const preguntaKey = `Expresiones_R${num}`;

    return (
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {label}
        </label>
        <div className="flex gap-4 mb-2">
          <label className="flex items-center">
            <input
              type="radio"
              name={preguntaKey}
              value="Sí"
              checked={formData[preguntaKey] === 'Sí'}
              onChange={handleChange}
              className="mr-2"
              required
            />
            Sí
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name={preguntaKey}
              value="No"
              checked={formData[preguntaKey] === 'No'}
              onChange={handleChange}
              className="mr-2"
              required
            />
            No
          </label>
        </div>       
      </div>
    );
  };

  return (
    <>
      { isLoading && <LoadingTransparent />}
      <div className="min-h-screen bg-white text-black">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Instrumento de Detección Completo</h1>

        {/* Vacío Existencial - Parte I */}
        <SeccionSelect
          titulo="Valores de Creación (Parte I)"
          preguntas={preguntas.vacioCreacion}
          opciones={["De acuerdo", "En desacuerdo", "No estoy seguro"]}
          prefijo="Logo_S1"
        />

        {/* Vacío Existencial - Parte II */}
        <SeccionSelect
          titulo="Valores de Vivencia (Parte II)"
          preguntas={preguntas.vacioVivencia}
          opciones={["Muy Frecuentemente", "Alguna vez", "Nunca"]}
          prefijo="Logo_S2"
        />

        {/* Vacío Existencial - Parte III */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Valores de Actitud (Parte III)</h3>
  
            {/* Presentación de los 3 casos */}
            <div className="mb-6 space-y-4 bg-white p-4 rounded-lg shadow-inner">
              <p className="font-semibold text-gray-700 mb-2">Lea cuidadosamente los siguientes casos:</p>
              
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-3">
                  <p className="font-medium">Caso A:</p>
                  <p className="text-sm">&quot;Un hombre/mujer tiene éxito en su vida. Aquello que siempre deseaba no lo pudo lograr, pero con el tiempo se procuró una buena posición y puede esperar un futuro sin sobresaltos.&quot;</p>
                </div>

                <div className="border-l-4 border-green-500 pl-3">
                  <p className="font-medium">Caso B:</p>
                  <p className="text-sm">&quot;Un hombre/mujer se empeñó en una tarea que eligió como meta. A pesar de constantes fracasos todavía se aferra a ella. Por esa causa ha debido renunciar a muchas cosas y ha logrado muy poco beneficio.&quot;</p>
                </div>

                <div className="border-l-4 border-purple-500 pl-3">
                  <p className="font-medium">Caso C:</p>
                  <p className="text-sm">&quot;Un hombre/mujer ha establecido un compromiso entre sus deseos y las circunstancias. Cumple con sus obligaciones mansamente, aunque sin gusto, y cuando es posible se dedica a sus ambiciones privadas.&quot;</p>
                </div>
              </div>
            </div>

            {/* Preguntas sobre los casos */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    ¿Cuál de estos casos considera MÁS FELIZ?
                  </label>
                  <select
                    name="Logo_S3_R1"
                    value={formData.Logo_S3_R1}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="A">Caso A</option>
                    <option value="B">Caso B</option>
                    <option value="C">Caso C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    ¿Cuál de estos casos considera que SUFRE MÁS?
                  </label>
                  <select
                    name="Logo_S3_R2"
                    value={formData.Logo_S3_R2}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="A">Caso A</option>
                    <option value="B">Caso B</option>
                    <option value="C">Caso C</option>
                  </select>
                </div>
              </div>

              {/* Descripción personal */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  3. Describa SU PROPIO CASO en pocas frases:
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="Logo_S3_R3"
                  value={formData.Logo_S3_R3}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows={4}
                  placeholder="Indique: 
          - Lo que siempre ha buscado
          - Lo que ha alcanzado
          - Qué actitud tiene hacia ello"
                  required
                />
              </div>
            </div>
          </div>



                {/* Escala de Desesperanza */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Escala de Desesperanza</h3>
            <p className="text-sm text-gray-600 mb-4">
              Instrucciones: A continuación, se presentan 20 afirmaciones con respecto a cómo ves tu futuro y percibes tu bienestar. Responde <strong>“Verdadero”</strong> si te sientes identificado con la afirmación y <strong>“Falso”</strong> si no te sientes identificado.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {preguntas.desesperanza.map((pregunta, index) => (
                <div key={index} className="p-2 border rounded hover:bg-gray-100">
                  <p className="text-sm mb-2">{index + 1}. {pregunta}</p>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        required
                        type="radio"
                        name={`Desesp_R${index + 1}`}
                        value="true"
                        checked={formData[`Desesp_R${index + 1}`] === "true"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span className="text-sm">Verdadero</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        required
                        type="radio"
                        name={`Desesp_R${index + 1}`}
                        value="false"
                        checked={formData[`Desesp_R${index + 1}`] === "false"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span className="text-sm">Falso</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>




        {/* Expresiones Personales */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Expresiones Personales</h3>
          <PreguntaCondicional
            num={1}
            label="a) ¿Has sentido alguna vez que tu vida es vacía o que no tiene sentido?"
          />
          {formData.Expresiones_R1 === 'Sí' && 
          (<textarea
            name={'Expresiones_R1_texto'}
            value={formData.Expresiones_R1_texto}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Indique su propio caso..."
          />)}

          <PreguntaCondicional
            num={2}
            label="b) ¿Has pensado que tu vida no vale la pena?"
          />
          {formData.Expresiones_R2 === 'Sí' && 
          (<textarea
            name={'Expresiones_R2_texto'}
            value={formData.Expresiones_R2_texto}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Indique su propio caso..."
          />)}

          <PreguntaCondicional
            num={3}
            label="c) ¿Has deseado alguna vez estar muerto(a)?"
          />
          {formData.Expresiones_R3 === 'Sí' && 
          (<textarea
            name={'Expresiones_R3_texto'}
            value={formData.Expresiones_R3_texto}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Indique su propio caso..."
          />)}

          <PreguntaCondicional
            num={4}
            label="d) ¿Has pensado alguna vez en terminar con tu vida?"
          />
          {formData.Expresiones_R4 === 'Sí' && 
          (<textarea
            name={'Expresiones_R4_texto'}
            value={formData.Expresiones_R4_texto}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Indique su propio caso..."
          />)}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Enviar Encuesta
        </button>

        <div className='w-full flex justify-center mt-3'>
          <button
            type="button"
            className="w-96 bg-gray-400 text-white py-3 px-6 rounded-lg hover:bg-gray-500 transition-colors"
            onClick={() => auth.signOut()}
          >
            Cerrar Sesión
          </button>
        </div>
      </form>
    </div>
    </>
  );
}