import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { ASSIGNMENT_INFO } from "../constants/assignment";

export function watchAuthState(onChange) {
  return onAuthStateChanged(auth, onChange);
}

export async function registerWithProfile({ name, email, password, role, staffId, studentId, faculty }) {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const isStaffRole = role !== "student";
  const chosenFaculty = String(faculty || ASSIGNMENT_INFO.department);
  const profile = {
    uid: cred.user.uid,
    name: name.trim(),
    email: email.trim(),
    role,
    staffId: isStaffRole ? String(staffId || "").trim() : "",
    studentId: role === "student" ? String(studentId || "").trim() : "",
    faculty: chosenFaculty,
    department: chosenFaculty,
    stream: ASSIGNMENT_INFO.courseName,
    semester: ASSIGNMENT_INFO.semester,
    createdAt: new Date().toISOString(),
  };
  await setDoc(doc(db, "users", cred.user.uid), profile);
  return { user: cred.user, profile };
}

export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function logout() {
  return signOut(auth);
}

export async function fetchOrCreateProfile(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data();

  const fallback = {
    uid: user.uid,
    email: user.email,
    name: user.email?.split("@")[0] || "User",
    role: "student",
    staffId: "",
    studentId: "",
    faculty: ASSIGNMENT_INFO.department,
    department: ASSIGNMENT_INFO.department,
    stream: ASSIGNMENT_INFO.courseName,
    semester: ASSIGNMENT_INFO.semester,
    createdAt: new Date().toISOString(),
  };
  await setDoc(ref, fallback);
  return fallback;
}
