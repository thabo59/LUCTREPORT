import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../constants/theme";

export function Card({ title, children }) {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
      {children}
    </View>
  );
}

export function AppInput({ label, multiline, ...props }) {
  return (
    <View style={styles.inputWrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textDim}
        {...props}
        multiline={multiline}
        style={[styles.input, multiline && styles.textArea, props.style]}
      />
    </View>
  );
}

export function PrimaryButton({ label, style, ...props }) {
  return (
    <Pressable {...props} style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed, style]}>
      <Text style={styles.primaryBtnText}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, style, ...props }) {
  return (
    <Pressable {...props} style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed, style]}>
      <Text style={styles.secondaryBtnText}>{label}</Text>
    </Pressable>
  );
}

export function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export function RowItem({ title, subtitle, children }) {
  return (
    <View style={styles.rowCard}>
      <Text style={styles.rowTitle}>{title}</Text>
      {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: "700", marginBottom: 2 },
  inputWrap: { gap: 5 },
  label: { color: colors.textMuted, fontSize: 12, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: "#131313",
    color: colors.text,
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 13,
  },
  textArea: { minHeight: 72, textAlignVertical: "top" },
  primaryBtn: {
    backgroundColor: colors.success,
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 11,
    marginTop: 4,
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: colors.successLight,
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 8,
    marginTop: 6,
  },
  secondaryBtnText: { color: colors.successLight, fontWeight: "700", fontSize: 12 },
  pressed: { opacity: 0.8 },
  infoRow: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#191919",
  },
  infoLabel: { color: colors.textMuted, fontSize: 12 },
  infoValue: { color: colors.successLight, fontSize: 15, fontWeight: "700" },
  rowCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    backgroundColor: colors.cardAlt,
    gap: 2,
  },
  rowTitle: { color: colors.text, fontSize: 13, fontWeight: "700" },
  rowSub: { color: colors.textMuted, fontSize: 11 },
});
