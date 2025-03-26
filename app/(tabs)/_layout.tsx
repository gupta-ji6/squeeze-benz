import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Entypo, Feather, Ionicons, Foundation } from "@expo/vector-icons";
import OrderIcon from "../../assets/images/OrderIcon";
import HomeFilledIcon from "../../assets/images/HomeFilledIcon";
import ProductIcon from "../../assets/images/ProductIcon";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#fff", // Explicit white background
          ...(Platform.OS === "ios"
            ? {
                position: "absolute",
              }
            : {}),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <HomeFilledIcon />,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="bag"
        options={{
          tabBarIcon: ({ color }) => <OrderIcon width={28} height={28} />,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color }) => <ProductIcon />,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="dots"
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="dots-three-horizontal" size={24} color={color} />
          ),
          tabBarShowLabel: false,
        }}
      />
    </Tabs>
  );
}
