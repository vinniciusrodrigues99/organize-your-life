import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../../src/store";

export default function TabLayout() {
  return (
    <Provider store={store}>
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
            headerTitleStyle: {
              fontSize: 20,
              fontFamily: "arial",
              fontFeatureSettings: "'ss01' on, 'ss02' on",
              fontVariant: ["small-caps"],
              fontWeight: "700",
              letterSpacing: 1.0,
              textShadowColor: "#000000ff",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            },
            headerShown: true,
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
            title: "Controle",
            headerTitle: "Controle Financeiro",
            headerTitleStyle: {
              fontSize: 20,
              fontFamily: "arial",
              fontFeatureSettings: "'ss01' on, 'ss02' on",
              fontVariant: ["small-caps"],
              fontWeight: "700",
              letterSpacing: 1.0,
              textShadowColor: "#000000ff",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            },
            headerShown: true,
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
        <Tabs.Screen
          name="resumoFinanceiro"
          options={{
            title: "Resumo",
            headerTitle: "Resumo Financeiro",
            headerTitleStyle: {
              fontSize: 20,
              fontFamily: "arial",
              fontFeatureSettings: "'ss01' on, 'ss02' on",
              fontVariant: ["small-caps"],
              fontWeight: "700",
              letterSpacing: 1.0,
              textShadowColor: "#000000ff",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            },
            headerShown: true,
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
    </Provider>
  );
}
