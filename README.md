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
- **Privacidad:** Tu API Key se guarda únicamente en el almacenamiento local de tu navegador y nunca se envía a ningún servidor.

## 🚀 Cómo Ejecutar

Esta aplicación está diseñada para funcionar directamente en cualquier navegador web moderno y está desplegada en GitHub Pages.

### Uso en Línea

¡Simplemente visita la página de la aplicación y comienza a crear tu CV!

### Configuración de la API Key

Para utilizar las funciones de inteligencia artificial (generar resúmenes, importar CV, etc.), necesitarás una **API Key de Google Gemini**.

1.  **Obtén tu API Key:** Si aún no tienes una, puedes obtenerla gratis en [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  **Ingrésala en la Aplicación:** La primera vez que abras la aplicación, aparecerá una ventana emergente solicitando tu API Key. Pégala allí y haz clic en "Guardar".
3.  **¡Listo!** La clave se almacenará de forma segura en el `localStorage` de tu navegador, por lo que no tendrás que ingresarla nuevamente en el mismo dispositivo. Puedes cambiarla en cualquier momento haciendo clic en "Gestionar API Key".

### Ejecución Local

Si deseas ejecutar el proyecto en tu propia máquina:

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/curriculum-facil.git
    cd curriculum-facil
    ```

2.  **Abre `index.html`:**
    La forma más sencilla es abrir el archivo `index.html` directamente en tu navegador.

3.  **(Opcional) Usa un servidor local:**
    Para una mejor experiencia, puedes usar un servidor de desarrollo simple. Si tienes Node.js instalado:
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