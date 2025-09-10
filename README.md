# Currículum Fácil

Una aplicación web intuitiva para crear un currículum vitae formal y profesional. Rellena tus datos, obtén un resumen profesional con IA y descarga tu CV en formato PDF listo para tus futuras oportunidades laborales.

## ✨ Características

- **Asistencia con IA:** Genera y mejora resúmenes profesionales y descripciones de experiencia utilizando la API de Gemini.
- **Importación Inteligente:** Pega el texto de tu CV existente y deja que la IA rellene los campos del formulario automáticamente.
- **Múltiples Plantillas:** Elige entre plantillas profesionales: Clásica (ATS-friendly), Moderna y Creativa.
- **Personalización Visual:** Ajusta el color de acento y los tamaños de fuente para darle un toque personal a tu CV.
- **Generador de Cartas de Presentación:** Crea cartas de presentación personalizadas basadas en los datos de tu CV y la oferta de trabajo.
- **Descarga en PDF:** Exporta tu currículum finalizado en formato PDF de alta calidad con un solo clic.
- **Sin Servidor:** Funciona completamente en el navegador, sin necesidad de un backend.

## 🚀 Cómo Ejecutar Localmente

Esta es una aplicación web estática que no requiere un proceso de compilación complejo.

### Prerrequisitos

- Un navegador web moderno (Chrome, Firefox, Safari, Edge).
- Un editor de código para crear un archivo.
- Opcional: [Node.js](https://nodejs.org/) y npm para usar un servidor de desarrollo local.

### Configuración

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    cd tu-repositorio
    ```

2.  **Configura tu API Key de Gemini:**
    La aplicación necesita una API Key de Google Gemini para funcionar. Debes crear un archivo en la raíz del proyecto para almacenar tu clave.

    - Crea un nuevo archivo llamado `env.js`.
    - Añade el siguiente contenido, reemplazando `"TU_API_KEY_AQUÍ"` con tu clave real:

    ```javascript
    // env.js
    window.process = {
      env: {
        API_KEY: "TU_API_KEY_AQUÍ",
      },
    };
    ```
    > **Importante:** El archivo `env.js` está incluido en `.gitignore`, por lo que tu clave de API no se subirá accidentalmente a GitHub. **Nunca compartas tu clave de API públicamente.**

3.  **Abre la aplicación:**
    Simplemente abre el archivo `index.html` en tu navegador.

    O, para una mejor experiencia de desarrollo (evitando problemas con CORS), puedes usar un servidor local:

    ```bash
    # Instala 'serve' globalmente (si no lo tienes)
    npm install -g serve

    # Inicia el servidor en la carpeta del proyecto
    serve .
    ```
    Luego, abre la URL que aparece en la terminal (usualmente `http://localhost:3000`).

## 🛠️ Stack Tecnológico

- **React:** Biblioteca para construir la interfaz de usuario.
- **TypeScript:** Para un código más robusto y mantenible.
- **Tailwind CSS:** Para el diseño y estilos.
- **Google Gemini API:** Para las funcionalidades de inteligencia artificial.
- **Babel (Standalone):** Para transpilar JSX y TypeScript directamente en el navegador.
- **jsPDF & html2canvas:** Para la generación de archivos PDF.