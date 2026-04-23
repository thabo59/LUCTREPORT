import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ASSIGNMENT_INFO } from "../constants/assignment";
import { colors } from "../constants/theme";

export default function RoleShell({ profile, onLogout }) {
  return (
    <View style={styles.card}>
      <Text style={styles.brand}>{ASSIGNMENT_INFO.projectTitle}</Text>
      <Text style={styles.subtitle}>
        {profile.name} | {String(profile.role).toUpperCase()}
      </Text>
      {profile.staffId ? <Text style={styles.caption}>Staff ID: {profile.staffId}</Text> : null}
      {profile.studentId ? <Text style={styles.caption}>Student ID: {profile.studentId}</Text> : null}
      <Text style={styles.caption}>Faculty: {profile.faculty || ASSIGNMENT_INFO.department}</Text>
      <Text style={styles.caption}>
        Course: {ASSIGNMENT_INFO.courseName} | Semester: {ASSIGNMENT_INFO.semester}
      </Text>
      <Pressable style={styles.logoutBtn} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 14,
    gap: 4,
  },
  brand: { color: colors.text, fontSize: 24, fontWeight: "700" },
  subtitle: { color: colors.textMuted, fontSize: 13 },
  caption: { color: colors.textDim, fontSize: 11 },
  logoutBtn: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  logoutText: { color: colors.textMuted, fontSize: 12, fontWeight: "600" },
});
