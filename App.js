import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { BranchProvider, useActiveBranch } from './src/context/BranchContext';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ClientsScreen from './src/screens/ClientsScreen';
import AddClientScreen from './src/screens/AddClientScreen';
import ClientDetailScreen from './src/screens/ClientDetailScreen';
import CheckinScreen from './src/screens/CheckinScreen';
import ReportsScreen from './src/screens/ReportsScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, loading } = useAuth();
  const { loadActiveBranch } = useActiveBranch();

  useEffect(() => {
    if (user) {
      loadActiveBranch();
    }
  }, [user]);

  if (loading) {
    return null; // O un splash screen
  }

  return (
    <NavigationContainer>
      {!user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Clients" 
            component={ClientsScreen}
            options={{ title: 'Clientes' }}
          />
          <Stack.Screen 
            name="AddClient" 
            component={AddClientScreen}
            options={{ title: 'Nuevo Cliente' }}
          />
          <Stack.Screen 
            name="ClientDetail" 
            component={ClientDetailScreen}
            options={{ title: 'Detalle de Cliente' }}
          />
          <Stack.Screen 
            name="Checkin" 
            component={CheckinScreen}
            options={{ title: 'Check-in' }}
          />
          <Stack.Screen 
            name="Reports" 
            component={ReportsScreen}
            options={{ title: 'Reportes' }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <BranchProvider>
          <AppNavigator />
        </BranchProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
