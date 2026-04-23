import React, { useMemo, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import ModuleTabs from "./components/ModuleTabs";
import RoleShell from "./components/RoleShell";
import { ROLE_MODULES } from "./constants/assignment";
import { colors } from "./constants/theme";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthScreen from "./screens/AuthScreen";
import { renderRoleModule } from "./screens/roleModules";

function MainApp() {
  const { user, profile, loading, logout } = useAuth();
  const modules = useMemo(() => ROLE_MODULES[profile?.role] || ["Overview"], [profile?.role]);
  const [activeModule, setActiveModule] = useState("Overview");

  React.useEffect(() => {
    if (!modules.includes(activeModule)) setActiveModule(modules[0]);
  }, [modules, activeModule]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.successLight} size="large" />
          <Text style={styles.muted}>Loading LRS...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user || !profile) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />
        <ExpoStatusBar style="light" />
        <AuthScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ExpoStatusBar style="light" />
      <View style={styles.page}>
        <RoleShell profile={profile} onLogout={logout} />
        <ModuleTabs modules={modules} activeModule={activeModule} onSelect={setActiveModule} />
        <ScrollView contentContainerStyle={styles.contentArea}>
          {renderRoleModule({ role: profile.role, module: activeModule, userId: user.uid, profile })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default function AppRoot() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  page: { flex: 1, padding: 14, gap: 10 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  muted: { color: colors.textMuted },
  contentArea: { paddingBottom: 40 },
});
