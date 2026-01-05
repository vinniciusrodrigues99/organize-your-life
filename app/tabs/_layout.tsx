import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        tabBarActiveTintColor: "#ffffffff",
        headerShadowVisible: false,
        headerTintColor: "#ffffffff",
        headerStyle: {
          backgroundColor: "#000000ff",
          borderBottomWidth: 0.5,
          borderBottomColor: "#424040ff",
        },
        headerTitleStyle: {
          fontWeight: "900",
          fontSize: 18,
          letterSpacing: 0.5,
        },
        tabBarStyle: {
          backgroundColor: "#000000ff",
          borderColor: "#424040ff",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="financas"
        options={{
          title: "Finanças",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused ? "information-circle" : "information-circle-outline"
              }
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
