import React, { useMemo, useState } from "react";
import { Alert, Text } from "react-native";
import { EMPTY_REPORT_FORM, REPORT_FIELDS } from "../constants/assignment";
import { findClassProfile, submitLecturerReport } from "../services/dataService";
import { AppInput, Card, PrimaryButton } from "./ui";
import { colors } from "../constants/theme";

const multilineKeys = new Set(["topicTaught", "learningOutcomes", "recommendations"]);

export default function LecturerReportForm({ userId, lecturerName, onSubmitted }) {
  const [form, setForm] = useState({ ...EMPTY_REPORT_FORM, lecturerName: lecturerName || "" });
  const [autoLoaded, setAutoLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const complete = useMemo(
    () => Object.values(form).every((v) => String(v).trim() !== ""),
    [form]
  );

  const patch = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const checkAutofill = async (partial) => {
    if (!partial.facultyName || !partial.className || !partial.courseCode) return;
    const profile = await findClassProfile(partial);
    if (profile) {
      setForm((prev) => ({
        ...prev,
        totalRegistered: prev.totalRegistered || String(profile.totalRegistered || ""),
        venue: prev.venue || String(profile.venue || ""),
        scheduledTime: prev.scheduledTime || String(profile.scheduledTime || ""),
      }));
      setAutoLoaded(true);
    }
  };

  const submit = async () => {
    if (!complete) {
      Alert.alert("Incomplete", "Please fill all lecturer reporting fields.");
      return;
    }
    setSubmitting(true);
    try {
      await submitLecturerReport(userId, form);
      Alert.alert("Saved", "Lecture report submitted.");
      setForm({ ...EMPTY_REPORT_FORM, lecturerName: lecturerName || "" });
      setAutoLoaded(false);
      onSubmitted?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="Data Entry (Lecturer Reporting Form)">
      {autoLoaded ? <Text style={{ color: colors.successLight, fontSize: 12 }}>Total registered students auto-loaded from previous class data.</Text> : null}
      {REPORT_FIELDS.map(([key, label]) => (
        <AppInput
          key={key}
          label={label}
          value={String(form[key] || "")}
          onChangeText={(text) => {
            const next = { ...form, [key]: text };
            patch(key, text);
            if (key === "facultyName" || key === "className" || key === "courseCode") checkAutofill(next);
          }}
          placeholder={`Enter ${label.toLowerCase()}`}
          multiline={multilineKeys.has(key)}
        />
      ))}
      <PrimaryButton label={submitting ? "Submitting..." : "Submit Lecture Report"} onPress={submit} disabled={submitting} />
    </Card>
  );
}
