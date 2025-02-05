"use client";

import { useState } from 'react';

export default function EncuestaForm() {
  const [formData, setFormData] = useState({
    // Datos personales
    nombre: '',
    sexo: '',
    genero: '',
    fechaNacimiento: '',
    profesion: '',

    // Vacío Existencial - Parte I (Valores de Creación)
    ...Array.from({ length: 9 }, (_, i) => [`Logo_S1_R${i + 1}_Val`, '']).reduce((acc, [key]) => ({ ...acc, [key]: '' }), {}),

    // Vacío Existencial - Parte II (Valores de Vivencia)
    ...Array.from({ length: 7 }, (_, i) => [`Logo_S2_R${i + 1}_Val`, '']).reduce((acc, [key]) => ({ ...acc, [key]: '' }), {}),

    // Vacío Existencial - Parte III (Valores de Actitud)
    Logo_S3_R1: '',
    Logo_S3_R2: '',
    Logo_S3_R3: '',

    // Desesperanza (20 ítems)
    ...Array.from({ length: 20 }, (_, i) => [`Desesp_R${i + 1}`, false]).reduce((acc, [key]) => ({ ...acc, [key]: false }), {}),

    // Expresiones evaluables
    ...Array.from({ length: 4 }, (_, i) => ([
      [`Expresiones_R${i + 1}`, ''],
      [`Expresiones_R${i + 1}_texto`, '']
    ])).flat().reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {})
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('Expresiones_R') && !name.endsWith('_texto')) {
      const num = name.split('_')[2];
      if (value === 'No') {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          [`Expresiones_R${num}_texto`]: ''
        }));
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const calcularPuntajeDesesperanza = () => {
    const positivas = [2,4,7,9,11,12,14,16,17,18,20];
    const negativas = [1,3,5,6,8,10,13,15,19];
    
    return positivas.reduce((acc, num) => acc + (formData[`Desesp_R${num}`] ? 1 : 0), 0) +
           negativas.reduce((acc, num) => acc + (!formData[`Desesp_R${num}`] ? 1 : 0), 0);
  };

  const validarFormulario = () => {
    if (!formData.nombre || !formData.fechaNacimiento) return false;
    
    return Array.from({ length: 4 }).every((_, i) => {
      const key = `Expresiones_R${i + 1}`;
      return formData[key] === 'No' || (formData[key] === 'Sí' && formData[`${key}_texto`].trim().length > 0);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      alert("Por favor complete todos los campos requeridos");
      return;
    }

    const puntaje = calcularPuntajeDesesperanza();
    const resultado = {
      puntaje,
      riesgoAlto: puntaje >= 8,
      fecha: new Date().toISOString()
    };

    console.log({...formData, resultado});
    alert(`Encuesta enviada\nPuntaje de desesperanza: ${puntaje}\nRiesgo alto: ${resultado.riesgoAlto ? 'Sí' : 'No'}`);
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

  const SeccionSelect = ({ titulo, preguntas, opciones, prefijo }) => (
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

  const PreguntaCondicional = ({ num, label }) => {
    const preguntaKey = `Expresiones_R${num}`;
    const textoKey = `${preguntaKey}_texto`;

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
        {formData[preguntaKey] === 'Sí' && (
          <textarea
            name={textoKey}
            value={formData[textoKey]}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg mt-2"
            rows="3"
            required
            placeholder="Describa sus sentimientos en detalle..."
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Instrumento de Detección Completo</h1>

        {/* Datos Personales */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Datos Personales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo *"
              className="p-2 border rounded"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <select
              name="sexo"
              className="p-2 border rounded"
              value={formData.sexo}
              onChange={handleChange}
              required
            >
              <option value="">Sexo biológico *</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
            <select
              name="genero"
              className="p-2 border rounded"
              value={formData.genero}
              onChange={handleChange}
            >
              <option value="">Género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="No binario">No binario</option>
              <option value="Otro">Otro</option>
            </select>
            <input
              type="date"
              name="fechaNacimiento"
              className="p-2 border rounded"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="profesion"
              placeholder="Profesión"
              className="p-2 border rounded"
              value={formData.profesion}
              onChange={handleChange}
            />
          </div>
        </div>

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
                  <p className="text-sm">"Un hombre/mujer tiene éxito en su vida. Aquello que siempre deseaba no lo pudo lograr, pero con el tiempo se procuró una buena posición y puede esperar un futuro sin sobresaltos."</p>
                </div>

                <div className="border-l-4 border-green-500 pl-3">
                  <p className="font-medium">Caso B:</p>
                  <p className="text-sm">"Un hombre/mujer se empeñó en una tarea que eligió como meta. A pesar de constantes fracasos todavía se aferra a ella. Por esa causa ha debido renunciar a muchas cosas y ha logrado muy poco beneficio."</p>
                </div>

                <div className="border-l-4 border-purple-500 pl-3">
                  <p className="font-medium">Caso C:</p>
                  <p className="text-sm">"Un hombre/mujer ha establecido un compromiso entre sus deseos y las circunstancias. Cumple con sus obligaciones mansamente, aunque sin gusto, y cuando es posible se dedica a sus ambiciones privadas."</p>
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
                  rows="4"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {preguntas.desesperanza.map((pregunta, index) => (
              <label key={index} className="flex items-center p-2 border rounded hover:bg-gray-100">
                <input
                  type="checkbox"
                  name={`Desesp_R${index + 1}`}
                  checked={formData[`Desesp_R${index + 1}`]}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm">{index + 1}. {pregunta}</span>
              </label>
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
          <PreguntaCondicional
            num={2}
            label="b) ¿Has pensado que tu vida no vale la pena?"
          />
          <PreguntaCondicional
            num={3}
            label="c) ¿Has deseado alguna vez estar muerto(a)?"
          />
          <PreguntaCondicional
            num={4}
            label="d) ¿Has pensado alguna vez en terminar con tu vida?"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Enviar Encuesta
        </button>
      </form>
    </div>
  );
}