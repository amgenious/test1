import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'; 

const TabLayout = () => {
  return (
   <Tabs screenOptions={{
    headerShown:false,
    tabBarActiveTintColor:'#3D8ABE'
  }}>
    <Tabs.Screen 
    name='home'
    options={{tabBarLabel:'Home',
        tabBarIcon:({color}) =><Ionicons name="home" size={24} color={color} />
        }}
    />
    <Tabs.Screen 
    name='Profile'
    options={{tabBarLabel:'Profile',
        tabBarIcon:({color}) =><Ionicons name="people" size={24} color={color} />
        }}
    />
    <Tabs.Screen 
    name='Trips'
    options={{tabBarLabel:'Trips',
        tabBarIcon:({color}) =><Ionicons name="car" size={24} color={color} />
        }}
    />
    <Tabs.Screen 
    name='Credit'
    options={{tabBarLabel:'Credit',
        tabBarIcon:({color}) =><Ionicons name="cash" size={24} color={color} />
        }}
    />
   </Tabs>
  )
}

export default TabLayout

const styles = StyleSheet.create({})