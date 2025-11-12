import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// 1. Obtén las variables de entorno de Vite
const {
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID
} = import.meta.env;

// 2. Valida que todas las variables de entorno necesarias estén presentes.
// Esto previene errores en tiempo de ejecución si falta alguna configuración.
if (!VITE_FIREBASE_API_KEY || !VITE_FIREBASE_AUTH_DOMAIN || !VITE_FIREBASE_PROJECT_ID || !VITE_FIREBASE_STORAGE_BUCKET || !VITE_FIREBASE_MESSAGING_SENDER_ID || !VITE_FIREBASE_APP_ID) {
  throw new Error("Faltan variables de entorno de Firebase. Asegúrate de que tu archivo .env esté completo y correcto.");
}

// 3. Usa las variables validadas para la configuración
const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: VITE_FIREBASE_AUTH_DOMAIN,
  projectId: VITE_FIREBASE_PROJECT_ID,
  storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: VITE_FIREBASE_APP_ID
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta los servicios de Firebase que necesitarás en tu aplicación
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);