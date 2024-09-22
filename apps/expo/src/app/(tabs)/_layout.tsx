import { View } from "react-native";
import { Tabs } from "expo-router";
import { Home, Plus, User } from "lucide-react-native";

import { cn } from "~/lib/utils";

export default function TabLayout() {
  const links = [
    { name: "index", Icon: Home },
    { name: "new-group", Icon: Plus },
    { name: "profile", Icon: User },
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 70,
          borderTopStartRadius: 40,
          borderTopEndRadius: 40,
          paddingHorizontal: 0,
          backgroundColor: "white",
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          borderTopWidth: 0,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      {links.map(({ Icon, name }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color, focused }) => (
              <View
                className={cn(
                  "flex flex-col items-center",
                  focused && "aspect-square rounded-full bg-primary p-4",
                )}
              >
                <Icon size={28} color={color} />
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
