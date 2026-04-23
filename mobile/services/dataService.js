import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export function scoreAverage(items) {
  if (!items.length) return "0";
  const total = items.reduce((sum, item) => sum + Number(item.rating || 0), 0);
  return (total / items.length).toFixed(1);
}

export function buildClassProfileId(report) {
  const norm = (v) => String(v || "").trim().toLowerCase().replace(/\s+/g, "-");
  return [report.facultyName, report.className, report.courseCode].map(norm).join("__");
}

export async function listCollection(name) {
  const snap = await getDocs(collection(db, name));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function submitLecturerReport(userId, report) {
  const profileId = buildClassProfileId(report);
  await setDoc(
    doc(db, "classProfiles", profileId),
    {
      profileId,
      facultyName: report.facultyName,
      className: report.className,
      courseCode: report.courseCode,
      courseName: report.courseName,
      totalRegistered: Number(report.totalRegistered),
      venue: report.venue,
      scheduledTime: report.scheduledTime,
      assignedLecturerName: report.lecturerName || "",
      updatedBy: userId,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  await addDoc(collection(db, "lectureReports"), {
    ...report,
    actualPresent: Number(report.actualPresent),
    totalRegistered: Number(report.totalRegistered),
    reportedBy: userId,
    createdAt: serverTimestamp(),
  });
}

export async function findClassProfile(report) {
  const profileId = buildClassProfileId(report);
  const snap = await getDoc(doc(db, "classProfiles", profileId));
  if (!snap.exists()) return null;
  return snap.data();
}

export async function markAttendance({ report, studentId }) {
  await setDoc(doc(db, "attendance", `${report.id}_${studentId}`), {
    lectureReportId: report.id,
    studentId,
    className: report.className,
    courseCode: report.courseCode,
    status: "present",
    createdAt: serverTimestamp(),
  });
}

export async function saveRating(payload) {
  await addDoc(collection(db, "ratings"), {
    ...payload,
    createdAt: serverTimestamp(),
  });
}

export async function savePRLFeedback(reportId, feedback, userId) {
  await setDoc(doc(db, "prlFeedback", reportId), {
    reportId,
    feedback,
    providedBy: userId,
    createdAt: serverTimestamp(),
  });
}

export async function saveCourse(form, userId) {
  const payload = {
    ...form,
    totalRegistered: Number(form.totalRegistered || 0),
    createdBy: userId,
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, "courses"), payload);

  if (form.facultyName && form.className && form.courseCode) {
    const profileId = buildClassProfileId(form);
    await setDoc(
      doc(db, "classProfiles", profileId),
      {
        profileId,
        facultyName: form.facultyName,
        className: form.className,
        courseCode: form.courseCode,
        courseName: form.courseName,
        totalRegistered: Number(form.totalRegistered || 0),
        venue: form.venue || "",
        scheduledTime: form.scheduledTime || "",
        assignedLecturerName: form.assignedLecturerName || "",
        assignedLecturerId: form.assignedLecturerId || "",
        updatedBy: userId,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
}
