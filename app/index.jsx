import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from '../configs/FirebaseConfig'
import WelcomeScreen from './WelcomeScreen'
import HomeScreen from './Home'
import { useRouter } from 'expo-router';
const Stack = createStackNavigator();


export default function index() {
    const router =useRouter()    
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const checkUser = async () => {
          const storedUser = await AsyncStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          setInitializing(false);
        };
        checkUser();
    
        const subscriber = onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
            AsyncStorage.setItem('user', JSON.stringify(currentUser));
            setUser(currentUser);
          } else {
            AsyncStorage.removeItem('user');
            setUser(null);
          }
          if (initializing) setInitializing(false);
        });
    
        return subscriber;
      }, [initializing]);
      if (initializing) return null; 
  return (

      <Stack.Navigator>
        {user ? (
            <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        )}
      </Stack.Navigator>

          
        )
    }
  
