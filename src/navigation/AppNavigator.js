import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoadingScreen from '../screens/LoadingScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';

import SessionScreen from '../screens/SessionScreen';
import HistoryScreen from '../screens/HistoryScreen';
import WellbeingScreen from '../screens/WellbeingScreen';
import GoalsScreen from '../screens/GoalsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CatalogScreen from '../screens/CatalogScreen';
import MiniGameScreen from '../screens/MiniGameScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: true, title: 'Recuperar contraseña' }} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Loading" component={LoadingScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Session" component={SessionScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Wellbeing" component={WellbeingScreen} />
        <Stack.Screen name="Goals" component={GoalsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Catalog" component={CatalogScreen} />
        
        {/* Minijuego a pantalla completa SIN header */}
        <Stack.Screen 
          name="MiniGame" 
          component={MiniGameScreen} 
          options={{ 
            headerShown: false,
            animation: 'fade'
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}