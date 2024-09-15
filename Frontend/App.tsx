import { ActivityIndicator, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { NavigationContainer } from "@react-navigation/native";
import AuthProvider from "./src/contexts/AuthContext";
import ThemeProvider from "./src/contexts/ThemeContext";
import useAuth from "./src/hooks/useAuth";
import TabNavigator from "./src/components/TabNavigator";
import StackNavigator from "./src/components/StackNavigator";
import React from "react";

function Routes() {
  const { user } = useAuth()

  if (user === undefined)
    return (
      <View style={
        { flex: 1, justifyContent: 'center', alignItems: 'center' }
      }>
        <ActivityIndicator size='large' color='#E94057' />
      </View>
    )

  if (user === null)
    return (
      <StackNavigator />
    )

  return (
    <TabNavigator />
  )

}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Routes />
          <Toast />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  )

}

export default App;
