
import { GoogleGenAI, Type } from "@google/genai";
import type { CVData, ExperienceEntry, ComplementaryTrainingEntry, EducationEntry, SkillEntry } from '../types.ts';
import type { CoverLetterPromptData } from '../components/CoverLetterPromptModal.tsx';

// The AI client instance and the key used to initialize it.
let ai: GoogleGenAI | null = null;
let currentKey: string | null = null;

/**
 * Initializes the GoogleGenAI client with the provided API key.
 * Only creates a new instance if the key is different from the currently used one,
 * making it efficient to call multiple times.
 * @param apiKey The user's Google Gemini API key.
 */
export const initializeAi = (apiKey: string) => {
  if (!apiKey) {
    throw new Error("API Key is required to initialize the AI service.");
  }
  // Only create a new instance if the key has changed or it's the first time.
  if (apiKey !== currentKey) {
    ai = new GoogleGenAI({ apiKey });
    currentKey = apiKey;
  }
};

/**
 * A robust function to get the initialized Gemini AI client.
 * @returns The initialized GoogleGenAI client.
 * @throws {Error} If the client has not been initialized yet.
 */
const getAiClient = (): GoogleGenAI => {
  if (!ai) {
    throw new Error("El servicio de IA no se ha inicializado. Por favor, configura tu API Key primero.");
  }
  return ai;
};


export async function generateSummary(
  experience: ExperienceEntry[],
  education: EducationEntry[],
  skills: SkillEntry[],
  existingSummary: string
): Promise<string> {
  const localAi = getAiClient();
  const model = "gemini-2.5-flash";

  if (experience.length === 0 && education.length === 0 && !existingSummary) {
    return "Profesional proactivo y con gran capacidad de aprendizaje, buscando una oportunidad para aplicar mis habilidades y crecer profesionalmente. Listo para contribuir al éxito del equipo y de la empresa.";
  }

  const experienceText = experience.map(exp => 
    `- Cargo: ${exp.position} en ${exp.company}. Descripción: ${exp.description}`
  ).join('\n');

  const educationText = education.map(edu =>
    `- Título: ${edu.degree} en ${edu.institution}. Año fin: ${edu.endDate}`
  ).join('\n');
  
  const skillsText = skills.map(s => `- ${s.skill} (Nivel: ${s.level})`).join('\n');

  const contextPrompt = `
    **Experiencia Laboral:**
    ${experienceText || 'No especificada.'}

    **Educación:**
    ${educationText || 'No especificada.'}

    **Habilidades Técnicas:**
    ${skillsText || 'No especificadas.'}
  `;

  let prompt: string;

  if (existingSummary.trim()) {
    prompt = `
      Actúa como un reclutador experto. Tu única tarea es mejorar y reescribir el "Resumen Original" para que se ajuste estrictamente a una estructura de 3 partes, usando la información del contexto proporcionado.

      **Estructura OBLIGATORIA E INQUEBRANTABLE:**
      El resumen DEBE ser un párrafo único y fluido que contenga estas partes en orden:
      1.  **Profesión y Formación Actual:** Define el perfil profesional basándote en el título académico más reciente como principal indicador. Si en el contexto de "Educación" se indica que una carrera está en curso ("Presente"), **añade una frase final a esta sección para destacarlo de forma atractiva**, mostrando el deseo de crecimiento y actualización. (Ej: "Actualmente, complemento mi experiencia cursando la carrera de Ingeniería en Construcción...").
      2.  **Experiencia:** Menciona la experiencia de forma general y cualitativa, sin especificar un número exacto de años. (Ej: "...con años de experiencia en logística...", "...con sólida trayectoria en...").
      3.  **Herramientas y Habilidades Blandas:** Finaliza mencionando una o dos herramientas de software clave si las hay, y enriquece el perfil añadiendo habilidades blandas relevantes como "responsable", "proactivo", "resolución de conflictos" y "trabajo en equipo".

      **Reglas Estrictas:**
      - Redacta SIEMPRE en primera persona ("Soy", "Poseo", "Tengo experiencia").
      - El resultado debe ser un único párrafo muy conciso y directo, de no más de 3 líneas.
      - Aunque te bases en el "Resumen Original", debes priorizar la estructura de 3 puntos y corregir el original para que se ajuste a ella. El objetivo es que el texto final sea más general y profesional.
      - Idioma: Español.

      **Contexto (Formación Profesional y Académica):**
      ${contextPrompt}

      **Resumen Original a Mejorar:**
      ---
      ${existingSummary}
      ---

      Genera únicamente el texto del resumen profesional mejorado, sin encabezados ni introducciones.
    `;
  } else {
    prompt = `
      Actúa como un reclutador experto. Tu única tarea es redactar un resumen profesional desde cero, basándote estrictamente en el contexto proporcionado.

      **Estructura OBLIGATORIA E INQUEBRANTABLE:**
      El resumen DEBE ser un párrafo único y fluido que contenga estas partes en orden:
      1.  **Profesión y Formación Actual:** Define el perfil profesional basándote en el título académico más reciente como principal indicador. Si en el contexto de "Educación" se indica que una carrera está en curso ("Presente"), **añade una frase final a esta sección para destacarlo de forma atractiva**, mostrando el deseo de crecimiento y actualización. (Ej: "Actualmente, complemento mi experiencia cursando la carrera de Ingeniería en Construcción...").
      2.  **Experiencia:** Menciona la experiencia de forma general y cualitativa, sin especificar un número exacto de años. (Ej: "...con años de experiencia en logística...", "...con sólida trayectoria en...").
      3.  **Herramientas y Habilidades Blandas:** Finaliza mencionando una o dos herramientas de software clave si las hay, y enriquece el perfil añadiendo habilidades blandas relevantes como "responsable", "proactivo", "resolución de conflictos" y "trabajo en equipo".

      **Reglas Estrictas:**
      - Redacta SIEMPRE en primera persona ("Soy", "Poseo", "Tengo experiencia").
      - Sé directo y profesional, pero con un tono más general.
      - El resultado debe ser un único párrafo muy conciso y directo, de no más de 3 líneas.
      - Idioma: Español.

      **Contexto para generar el resumen (Formación Profesional y Académica):**
      ${contextPrompt}
      
      Genera únicamente el texto del resumen profesional, sin encabezados ni introducciones.
    `;
  }

  try {
    const response = await localAi.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 1,
        topK: 32,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    
    const summary = response.text.trim();
    if (!summary) {
        throw new Error("Gemini returned an empty summary.");
    }
    return summary;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate summary from Gemini API.");
  }
}

export async function extractDataFromCV(cvText: string): Promise<Partial<CVData>> {
  const localAi = getAiClient();
  const model = "gemini-2.5-flash";

  const schema = {
    type: Type.OBJECT,
    properties: {
      personal: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Nombre completo de la persona." },
          email: { type: Type.STRING, description: "Dirección de correo electrónico." },
          phoneNumber: { type: Type.STRING, description: "Número de teléfono, sin el código de país." },
          cityAndCountry: { type: Type.STRING, description: "Ciudad y país de residencia. Por ejemplo: 'Santiago, Chile'." },
          linkedin: { type: Type.STRING, description: "URL o nombre de usuario del perfil de LinkedIn. Extraer solo el perfil, no la URL completa. Ej: 'linkedin.com/in/usuario'." },
          website: { type: Type.STRING, description: "URL del sitio web o portafolio personal." },
        },
      },
      summary: {
        type: Type.STRING,
        description: "Resumen o perfil profesional. Un párrafo que describe a la persona."
      },
      experience: {
        type: Type.ARRAY,
        description: "Lista de experiencias laborales.",
        items: {
          type: Type.OBJECT,
          properties: {
            position: { type: Type.STRING, description: "El cargo o puesto ocupado." },
            company: { type: Type.STRING, description: "Nombre de la empresa." },
            city: { type: Type.STRING, description: "Ciudad donde se ubicaba la empresa." },
            country: { type: Type.STRING, description: "País donde se ubicaba la empresa." },
            startMonth: { type: Type.STRING, description: "Mes de inicio del trabajo (ej: 'Marzo')." },
            startDate: { type: Type.STRING, description: "Año de inicio del trabajo (ej: '2020')." },
            endMonth: { type: Type.STRING, description: "Mes de fin del trabajo (ej: 'Diciembre'). Si sigue trabajando, dejar vacío." },
            endDate: { type: Type.STRING, description: "Año de fin del trabajo (ej: '2022'). Si sigue trabajando, usar 'Presente'." },
            description: { type: Type.STRING, description: "Descripción de las responsabilidades y logros en el puesto. Usar saltos de línea para separar puntos." }
          }
        }
      },
      education: {
        type: Type.ARRAY,
        description: "Lista de formación académica.",
        items: {
          type: Type.OBJECT,
          properties: {
            institution: { type: Type.STRING, description: "Nombre de la institución educativa." },
            degree: { type: Type.STRING, description: "Título o grado obtenido." },
            city: { type: Type.STRING, description: "Ciudad de la institucion." },
            country: { type: Type.STRING, description: "País de la institucion." },
            startDate: { type: Type.STRING, description: "Año de inicio." },
            endDate: { type: Type.STRING, description: "Año de finalización." },
          }
        }
      },
      skills: {
        type: Type.ARRAY,
        description: "Lista de habilidades técnicas o software.",
        items: {
          type: Type.OBJECT,
          properties: {
            skill: { type: Type.STRING, description: "Nombre de la habilidad o software." },
            level: { type: Type.STRING, description: "Nivel de la habilidad, debe ser 'Básico', 'Intermedio' o 'Avanzado'." }
          }
        }
      },
      complementaryTraining: {
        type: Type.ARRAY,
        description: "Lista de cursos o certificaciones adicionales.",
        items: {
          type: Type.OBJECT,
          properties: {
            course: { type: Type.STRING, description: "Nombre del curso o certificación." },
            institution: { type: Type.STRING, description: "Institución que impartió el curso." },
            year: { type: Type.STRING, description: "Año de finalización del curso." },
            description: { type: Type.STRING, description: "Descripción breve del curso." },
            city: { type: Type.STRING, description: "Ciudad donde se impartió el curso." },
            country: { type: Type.STRING, description: "País donde se impartió el curso." }
          }
        }
      }
    }
  };

  const prompt = `
    Analiza el siguiente texto de un currículum vitae y extrae la información estructurada en formato JSON.
    Sigue el esquema JSON proporcionado de forma estricta.
    Si alguna información no está presente en el texto, omite el campo o déjalo como un string vacío o un array vacío.
    Asegúrate de que los meses y años estén en los campos correctos (startMonth, startDate, etc.).
    Para las descripciones de experiencia, concatena los puntos en un solo string, separados por saltos de línea (\\n).
    Para el nivel de habilidad, si no se especifica, clasifícalo como 'Intermedio' por defecto.

    Texto del CV:
    ---
    ${cvText}
    ---
  `;

  try {
    const response = await localAi.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });
    
    const jsonString = response.text.trim();
    if (!jsonString) {
        throw new Error("Gemini returned an empty response.");
    }
    
    const extractedData = JSON.parse(jsonString);
    return extractedData as Partial<CVData>;

  } catch (error) {
    console.error("Error calling Gemini API for CV extraction:", error);
    if (error instanceof Error && error.message.includes('json')) {
      throw new Error("La IA no pudo procesar el CV. Asegúrate de que el texto esté bien formateado e inténtalo de nuevo.");
    }
    throw new Error("No se pudo extraer la información del CV.");
  }
}

export async function generateDescription(
  listName: 'experience' | 'complementaryTraining',
  item: ExperienceEntry | ComplementaryTrainingEntry
): Promise<string> {
  const localAi = getAiClient();
  const model = "gemini-2.5-flash";
  let prompt: string;

  if (listName === 'experience') {
    const { position, company } = item as ExperienceEntry;
    prompt = `
      Actúa como un experto en redacción de currículums.
      Para un currículum vitae, genera una lista de 1 o 2 responsabilidades o contribuciones clave para el cargo de "${position}" en la empresa "${company}".

      **Instrucciones clave:**
      1. Describe las tareas principales y los aportes más significativos del puesto. Evita métricas agresivas o porcentajes exagerados.
      2. Utiliza verbos de acción al inicio de cada punto (ej: "Colaboré en...", "Gestioné...", "Desarrollé...", "Participé en...").
      3. Cada punto de la lista debe empezar en una nueva línea. No utilices viñetas como '-' o '•'.
      4. Escribe en minúsculas, usando mayúsculas solo al inicio de cada punto y para nombres propios, siguiendo las reglas gramaticales del español.
      5. El idioma debe ser español.

      **Ejemplo de una buena descripción:**
      "Colaboración en el montaje de estructuras metálicas para proyectos de edificación."
      "Gestión y supervisión de equipos en terreno para asegurar la calidad del trabajo."

      Genera únicamente la lista de responsabilidades, sin encabezados ni texto introductorio.
    `;
  } else { // complementaryTraining
    const { course, institution } = item as ComplementaryTrainingEntry;
    prompt = `
      Actúa como un experto en redacción de currículums.
      Para un currículum vitae, genera una descripción concisa (2-3 frases) para el curso "${course}" impartido por "${institution}".
      La descripción debe destacar las habilidades y conocimientos más importantes adquiridos.
      El tono debe ser profesional.
      El idioma debe ser español.
      Genera únicamente el texto de la descripción, sin encabezados ni texto introductorio.
    `;
  }

  try {
    const response = await localAi.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 1,
        topK: 32,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const newText = response.text.trim();
    if (!newText) {
      throw new Error("Gemini returned an empty description.");
    }
    return newText.split('\n').map(line => line.trim().replace(/^[-•*]\s*/, '')).filter(Boolean).join('\n');
  } catch (error) {
    console.error("Error calling Gemini API for description generation:", error);
    throw new Error("No se pudo generar la descripción desde la API de Gemini.");
  }
}

export async function improveDescription(text: string, context: 'experience' | 'complementaryTraining'): Promise<string> {
  const localAi = getAiClient();
  const model = "gemini-2.5-flash";

  if (!text.trim()) {
    return ""; // Don't call API for empty text
  }

  let prompt: string;
  if (context === 'experience') {
    prompt = `
      Actúa como un experto en redacción de currículums.
      Mejora y re-escribe la siguiente descripción de un puesto de trabajo para que sea más clara, concisa y profesional.

      **Instrucciones clave para la mejora:**
      1. Refina el texto original para describir las contribuciones y responsabilidades principales.
      2. Limita la descripción a un máximo de 2 puntos clave.
      3. Evita el uso de porcentajes o métricas de rendimiento exageradas. Enfócate en la naturaleza del trabajo realizado.
      4. Comienza cada punto con un verbo de acción (ej: "Gestioné", "Desarrollé", "Colaboré").
      5. Escribe en minúsculas, usando mayúsculas solo al inicio de cada punto y para nombres propios, siguiendo las reglas gramaticales del español.
      6. Asegúrate de que cada punto esté en una nueva línea, sin viñetas como '-' o '•'.
      7. Mantén el idioma original del texto (español).

      **Ejemplo de una buena descripción mejorada:**
      "Colaboración en el montaje de estructuras metálicas para proyectos de edificación."
      "Gestión y supervisión de equipos en terreno para asegurar la calidad del trabajo."

      Genera únicamente el texto mejorado, sin encabezados ni introducciones.

      **Texto Original a Mejorar:**
      ---
      ${text}
      ---
    `;
  } else { // complementaryTraining
    prompt = `
      Actúa como un experto en redacción de currículums.
      Mejora y re-escribe la siguiente descripción de un curso o certificación para que sea más profesional, clara y concisa.
      El objetivo es destacar las habilidades y conocimientos clave adquiridos.
      Mantén el idioma original del texto (español).
      Genera únicamente el texto mejorado, sin encabezados ni introducciones como "Aquí está el texto mejorado:".

      **Texto Original a Mejorar:**
      ---
      ${text}
      ---
    `;
  }

  try {
    const response = await localAi.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 1,
        topK: 32,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const improvedText = response.text.trim();
    if (!improvedText) {
      throw new Error("Gemini returned an empty description.");
    }
    
    if (context === 'experience') {
        return improvedText.split('\n').map(line => line.trim().replace(/^[-•*]\s*/, '')).filter(Boolean).join('\n');
    }
    
    return improvedText;
  } catch (error) {
    console.error("Error calling Gemini API for description improvement:", error);
    throw new Error("No se pudo mejorar la descripción desde la API de Gemini.");
  }
}

export async function generateCoverLetter(cvData: CVData, promptData: CoverLetterPromptData): Promise<string> {
  const localAi = getAiClient();
  const model = "gemini-2.5-flash";
  const { personal, summary, experience, skills } = cvData;
  const { jobTitle, isGeneralApplication, companyName, isCompanyUnknown, recipientName, isRecipientUnknown } = promptData;

  const fullPhoneNumber = [personal.phoneCountryCode, personal.phoneNumber].filter(Boolean).join(' ');
  const experienceText = experience.map(exp => `- ${exp.position} en ${exp.company}.`).join('\n');
  const skillsText = skills.map(s => s.skill).join(', ');
  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  const recipient = !isRecipientUnknown && recipientName ? `Estimado/a ${recipientName}:` : 'Estimados/as señores/as:';
  const isSpecific = !isGeneralApplication && jobTitle;

  const openingParagraphPrompt = isSpecific
    ? `- Comienza presentándote y expresando tu gran interés en la vacante de "${jobTitle}" ${!isCompanyUnknown && companyName ? `en ${companyName}` : ''}. Basa la introducción en tu perfil y cómo encaja con el puesto.`
    : `- Comienza presentándote e indicando tu interés en formar parte de su organización. Basa la introducción en el "Resumen Profesional del CV".`;

  const prompt = `
    Actúa como un experto en redacción de cartas de presentación. Tu tarea es generar una carta de presentación profesional para ${personal.name || 'el candidato'}, basándote en los datos de su CV y la información de la postulación.
    
    **Datos de la Postulación:**
    - Cargo: ${isSpecific ? jobTitle : 'General'}
    - Empresa: ${!isCompanyUnknown && companyName ? companyName : 'No especificada'}
    - Reclutador: ${!isRecipientUnknown && recipientName ? recipientName : 'No especificado'}

    **Datos del CV:**
    - Nombre: ${personal.name}
    - Email: ${personal.email}
    - Teléfono: ${fullPhoneNumber}
    - Ciudad y País: ${personal.cityAndCountry}
    - Resumen Profesional del CV: ${summary}
    - Experiencia Laboral (resumida): ${experienceText || 'No especificada.'}
    - Habilidades Clave: ${skillsText || 'No especificadas.'}

    **Formato y Estructura OBLIGATORIOS:**
    La carta debe seguir esta estructura exacta. Usa markdown para el formato: **texto en negrita** para los nombres, y guiones (-) para las listas.

    1. **Encabezado (Alineado a la izquierda):**
    **${personal.name}**
    ${personal.email} | ${fullPhoneNumber}
    ${personal.cityAndCountry.split(',')[0]}, ${formattedDate}

    2. **Saludo (Después de dos saltos de línea):**
    ${recipient}

    3. **Párrafo Inicial - Presentación y Motivación (Después de un salto de línea):**
    ${openingParagraphPrompt}
    - Destaca tu actitud profesional usando palabras como proactividad, responsabilidad y capacidad de adaptación.

    4. **Cuerpo Párrafo 1 - Trayectoria (Después de un salto de línea):**
    - Resume tu trayectoria de forma amplia, mencionando las áreas generales donde has trabajado (basado en la "Experiencia Laboral"). Si la postulación es específica, intenta conectar sutilmente tu experiencia con los posibles requerimientos del cargo de "${jobTitle}". No nombres empresas específicas.

    5. **Cuerpo Párrafo 2 - Fortalezas (Después de un salto de línea):**
    - Empieza con la frase "Fortalezas destacadas:".
    - Debajo, crea una lista corta (3 puntos) con guiones (-). Cada punto debe destacar una fortaleza. Combina habilidades del CV con habilidades blandas. Usa negrita para las palabras clave de cada fortaleza. Si la postulación es específica, adapta las fortalezas para que sean relevantes para el cargo.

    6. **Párrafo de Cierre - Disponibilidad y Agradecimiento (Después de un salto de línea):**
    - Manifiesta tu interés en integrarte a la institución para contribuir y desarrollarte.
    - Agradece la consideración y muestra disponibilidad para una entrevista.

    7. **Despedida (Después de dos saltos de línea):**
    Atentamente,

    8. **Firma (Después de un salto de línea):**
    **${personal.name}**

    **Reglas Finales:**
    - El texto de los párrafos debe ser fluido para que se vea bien justificado.
    - La extensión debe ser de máximo 1 página (3-4 párrafos principales).
    - Idioma: Español.
    - Genera únicamente el texto de la carta, sin ningún comentario o encabezado adicional.
  `;
  
  try {
    const response = await localAi.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.6,
        topP: 1,
        topK: 32,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const letter = response.text.trim();
    if (!letter) {
      throw new Error("Gemini returned an empty cover letter.");
    }
    return letter;
  } catch (error) {
    console.error("Error calling Gemini API for cover letter:", error);
    throw new Error("Failed to generate cover letter from Gemini API.");
  }
}
