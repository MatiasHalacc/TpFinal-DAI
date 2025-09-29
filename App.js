
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import BottomTabs from './Navigation/BottomTabs.js';
import { StyleSheet } from 'react-native';


// mejora rendimiento de navegación nativa
enableScreens();

export default function App() {
  return (
    <SafeAreaView  style={styles.container}>
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 2, // <- deja espacio para que el BottomTab no tape el contenido
  },
});