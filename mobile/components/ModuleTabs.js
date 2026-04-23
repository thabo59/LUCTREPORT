import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { colors } from "../constants/theme";

export default function ModuleTabs({ modules, activeModule, onSelect }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {modules.map((moduleName) => {
        const active = activeModule === moduleName;
        return (
          <Pressable
            key={moduleName}
            style={[styles.chip, active && styles.activeChip]}
            onPress={() => onSelect(moduleName)}
          >
            <Text style={[styles.chipText, active && styles.activeText]}>{moduleName}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingVertical: 2 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#1b1b1b",
  },
  activeChip: { backgroundColor: colors.successLight, borderColor: colors.successLight },
  chipText: { color: colors.textMuted, fontSize: 12, fontWeight: "600" },
  activeText: { color: colors.dark },
});
