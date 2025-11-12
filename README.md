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
