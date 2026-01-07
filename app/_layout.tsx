import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#2d0054',
            borderTopWidth: 3,
            borderTopColor: '#ff00ff',
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: '#00ffff',
          tabBarInactiveTintColor: '#ffffff',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Descubrir',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? 'flame' : 'flame-outline'} 
                size={size} 
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            title: 'Cámara',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? 'camera' : 'camera-outline'} 
                size={size} 
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="gallery"
          options={{
            title: 'Galería',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? 'images' : 'images-outline'} 
                size={size} 
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}