import "../styles.css";

import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider } from "@react-navigation/native";

import { useColorScheme } from "~/hooks/useColorScheme";
import { tokenCache } from "~/lib/clerk";
import { DARK_THEME, LIGHT_THEME } from "~/lib/constants";
import { TRPCProvider } from "~/utils/api";

export { ErrorBoundary } from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  useEffect(() => {
    void (async () => {
      const theme = await AsyncStorage.getItem("theme");
      const colorTheme = theme === "dark" ? "dark" : "light";

      if (!theme) {
        void AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }

      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);

        setIsColorSchemeLoaded(true);
        return;
      }

      setIsColorSchemeLoaded(true);
    })().finally(() => {
      void SplashScreen.hideAsync();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <TRPCProvider>
      <ClerkProvider
        tokenCache={tokenCache}
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        <ClerkLoaded>
          <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <SafeAreaProvider>
              <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
              <Stack
                screenOptions={{ headerShown: false }}
                initialRouteName="home"
              />
            </SafeAreaProvider>
          </ThemeProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </TRPCProvider>
  );
}
