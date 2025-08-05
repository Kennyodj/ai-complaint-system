import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth"; // ✅ import needed functions
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHaJUgShd2gMrsl6R_taLjYdTxCqFn96E",
  authDomain: "ai-complaint-system-91773.firebaseapp.com",
  projectId: "ai-complaint-system-91773",
  storageBucket: "ai-complaint-system-91773.appspot.com", // fixed typo
  messagingSenderId: "591174238315",
  appId: "1:591174238315:web:598c854176cd09ff96312e"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// ✅ Enable persistent login across page reloads
setPersistence(auth, browserLocalPersistence);

const db = getFirestore(app);

export { auth, db };
