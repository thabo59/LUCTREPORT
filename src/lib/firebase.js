import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: "AIzaSyDcBkutzH4SueSAo1q0ZTBnrb_aWT4eONs",
  authDomain: "luct-report.firebaseapp.com",
  projectId: "luct-report",
  storageBucket: "luct-report.firebasestorage.app",
  messagingSenderId: "64541784225",
  appId: "1:64541784225:web:bf0374c0bf2be9d26c18e0",
  measurementId: "G-YKRWD48YQC"
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
