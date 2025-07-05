import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#111",
        tabBarInactiveTintColor: "#888",
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderColor: "#eee",
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName: any;
          let size: any = 22;

          if (route.name === "home")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "upload")
            iconName = focused ? "cloud-upload" : "cloud-upload-outline";
          else if (route.name === "profile")
            iconName = focused ? "person" : "person-outline";
          else if (route.name === "settings")
            iconName = focused ? "settings" : "settings-outline";
          else if (route.name === "history")
            iconName = focused ? "book" : "book-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="history" options={{ title: "History" }} />
      <Tabs.Screen name="upload" options={{ title: "Upload" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
