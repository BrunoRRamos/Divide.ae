import "@bacons/text-decoder/install";

// import { TRPCProvider } from "~/utils/api";

import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { Fragment } from "react";

import "../styles.css";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    // <TRPCProvider>
    <Fragment>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: colorScheme == "dark" ? "#09090B" : "#FFFFFF",
          },
        }}
      />
    </Fragment>
    // </TRPCProvider>
  );
}
