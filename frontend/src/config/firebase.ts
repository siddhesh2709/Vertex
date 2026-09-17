import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBZfTeo7qZeQiL-1VWXdchC6Gtf3ho-7TI",
    // These are Firebase infrastructure identifiers, not product branding.
    // They must match the project the apiKey belongs to - renaming them to
    // "Vertex" breaks authentication outright.
    authDomain: "agrolyft.firebaseapp.com",
    projectId: "agrolyft",
    storageBucket: "agrolyft.firebasestorage.app",
    messagingSenderId: "504889344388",
    appId: "1:504889344388:web:cac7df17ab76f0fbd09dd1",
    measurementId: "G-PEMK08NEJC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
