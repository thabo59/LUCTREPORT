import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ASSIGNMENT_INFO, LIMKOKWING_LESOTHO_FACULTIES, ROLE_MODULES } from "../constants/assignment";
import { colors } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { AppInput, Card, PrimaryButton } from "../components/ui";

export default function AuthScreen() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [staffId, setStaffId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [faculty, setFaculty] = useState(LIMKOKWING_LESOTHO_FACULTIES[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const requiresStaffId = isRegister && role !== "student";
    const requiresStudentId = isRegister && role === "student";
    if (
      !email ||
      !password ||
      (isRegister && !faculty) ||
      (isRegister && !name) ||
      (requiresStaffId && !staffId.trim()) ||
      (requiresStudentId && !studentId.trim())
    ) {
      setError("Please complete all required fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (isRegister) {
        await register({ name, email, password, role, staffId, studentId, faculty });
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.brand}>{ASSIGNMENT_INFO.projectTitle}</Text>
      <Text style={styles.subtitle}>{ASSIGNMENT_INFO.subtitle}</Text>
      <Card title={isRegister ? "Register" : "Login"}>
        {isRegister ? <AppInput label="Full Name" value={name} onChangeText={setName} placeholder="Thabo Monamane" /> : null}
        <AppInput label="Email" value={email} onChangeText={setEmail} placeholder="name@luct.ls" autoCapitalize="none" />
        <AppInput label="Password" value={password} onChangeText={setPassword} placeholder="********" secureTextEntry />
        {isRegister ? (
          <View style={styles.roles}>
            <Text style={styles.label}>Faculty (Limkokwing Lesotho)</Text>
            <View style={styles.row}>
              {LIMKOKWING_LESOTHO_FACULTIES.map((item) => {
                const active = faculty === item;
                return (
                  <Text key={item} style={[styles.role, active && styles.roleActive]} onPress={() => setFaculty(item)}>
                    {item.replace("Faculty of ", "")}
                  </Text>
                );
              })}
            </View>
          </View>
        ) : null}
        {isRegister ? (
          <View style={styles.roles}>
            <Text style={styles.label}>Role</Text>
            <View style={styles.row}>
              {Object.keys(ROLE_MODULES).map((value) => {
                const active = role === value;
                return (
                  <Text key={value} style={[styles.role, active && styles.roleActive]} onPress={() => setRole(value)}>
                    {value.toUpperCase()}
                  </Text>
                );
              })}
            </View>
          </View>
        ) : null}
        {isRegister && role !== "student" ? (
          <AppInput
            label="Staff ID"
            value={staffId}
            onChangeText={setStaffId}
            placeholder="Enter staff ID"
            autoCapitalize="characters"
          />
        ) : null}
        {isRegister && role === "student" ? (
          <AppInput
            label="Student ID"
            value={studentId}
            onChangeText={setStudentId}
            placeholder="Enter student ID"
            autoCapitalize="characters"
          />
        ) : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton label={loading ? "Please wait..." : isRegister ? "Create Account" : "Login"} onPress={submit} />
        <Text style={styles.switch} onPress={() => setIsRegister((prev) => !prev)}>
          {isRegister ? "Have an account? Login" : "New user? Register"}
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, gap: 12 },
  brand: { color: colors.text, fontSize: 24, fontWeight: "700" },
  subtitle: { color: colors.textMuted, fontSize: 13 },
  roles: { gap: 6 },
  label: { color: colors.textMuted, fontSize: 12, fontWeight: "600" },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  role: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    backgroundColor: "#131313",
  },
  roleActive: { backgroundColor: colors.successLight, borderColor: colors.successLight, color: colors.dark },
  error: { color: colors.danger, fontSize: 12 },
  switch: { color: colors.successLight, textAlign: "center", marginTop: 8, fontSize: 12 },
});
