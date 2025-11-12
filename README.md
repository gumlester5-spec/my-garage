# Mi Garage

Una aplicación para gestionar el mantenimiento de tus motocicletas. Registra servicios, establece recordatorios y guarda datos técnicos importantes para mantener tus motos en perfecto estado.

## Tecnologías Utilizadas

- **React** con **TypeScript**
- **Firebase** (Firestore, Authentication, Storage)
- **Tailwind CSS** para el diseño
- **Vite** como empaquetador

## Cómo Ejecutar Localmente

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Crea un archivo `.env` en la raíz del proyecto y añade tus credenciales de Firebase con el siguiente formato:
   ```
   VITE_FIREBASE_API_KEY="TU_API_KEY"
   VITE_FIREBASE_AUTH_DOMAIN="TU_AUTH_DOMAIN"
   VITE_FIREBASE_PROJECT_ID="TU_PROJECT_ID"
   VITE_FIREBASE_STORAGE_BUCKET="TU_STORAGE_BUCKET"
   VITE_FIREBASE_MESSAGING_SENDER_ID="TU_MESSAGING_SENDER_ID"
   VITE_FIREBASE_APP_ID="TU_APP_ID"
   ```
3. Inicia el servidor de desarrollo:
   `npm run dev`

## Despliegue en Netlify

Para que la aplicación funcione correctamente en Netlify, necesitas configurar las variables de entorno de Firebase en el panel de tu sitio.

1.  Ve a **Site settings > Build & deploy > Environment**.
2.  Haz clic en **"Edit variables"** y añade las mismas claves y valores que usaste en tu archivo `.env` local.

    Asegúrate de que cada clave comience con el prefijo `VITE_`, ya que es requerido por Vite para exponer las variables a la aplicación del lado del cliente.

    Por ejemplo:
    -   **Key**: `VITE_FIREBASE_API_KEY`
    -   **Value**: `TU_API_KEY`
