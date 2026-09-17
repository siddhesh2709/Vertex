import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBZfTeo7qZeQiL-1VWXdchC6Gtf3ho-7TI",
    authDomain: "Vertex.firebaseapp.com",
    projectId: "Vertex",
    storageBucket: "Vertex.firebasestorage.app",
    messagingSenderId: "504889344388",
    appId: "1:504889344388:web:cac7df17ab76f0fbd09dd1",
    measurementId: "G-PEMK08NEJC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
