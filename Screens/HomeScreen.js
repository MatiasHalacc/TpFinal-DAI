import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a EventHub</Text>
      <Text style={styles.subtitle}>Tu plataforma para gestionar eventos fácilmente.</Text>

      <View style={styles.content}>
        <Text style={styles.description}>
          Usa la pestaña "Mapa" para ver tu ubicación y explorar eventos cercanos.
        </Text>
        
        {/* Botón con interacción */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Explorar eventos</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>¡Disfruta de la experiencia!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  content: {
    alignItems: 'center',
    marginBottom: 40,
  },
  description: {
    fontSize: 16,
    color: '#34495e',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 30,
  },
});
