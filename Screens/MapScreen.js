import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function MapScreen() {
  const [region, setRegion] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const mapRef = useRef(null);

  // Marcadores fijos
  const markers = [
    { id: 1, title: "Movistar Arena", coords: { latitude: -34.594167, longitude: -58.448056 } },
    { id: 2, title: "Escuela", coords: { latitude: -34.6090, longitude: -58.3800 } },
    { id: 3, title: "Casa de Amigos", coords: { latitude: -34.6010, longitude: -58.3850 } },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }
      setHasPermission(true);

      let location = await Location.getCurrentPositionAsync({});
      const initialRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(initialRegion);

      // Seguimiento en tiempo real
      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10 },
        (loc) => {
          const updatedRegion = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setRegion(updatedRegion);
          if (mapRef.current) {
            mapRef.current.animateToRegion(updatedRegion);
          }
        }
      );
    })();
  }, []);

  if (!hasPermission) {
    return <View style={styles.center}><ActivityIndicator size="large" color="blue" /></View>;
  }

  return (
    <View style={styles.container}>
      {region ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
        >
          {markers.map((m) => (
            <Marker key={m.id} coordinate={m.coords} title={m.title} />
          ))}
        </MapView>
      ) : (
        <View style={styles.center}><ActivityIndicator size="large" color="blue" /></View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: 
  { 
    flex: 1,
    justifyContent: "center",   // centra en altura
    alignItems: "center",  
  },
  map: 
  { 
    width: 300,
    height: 300,
    alignSelf: "center",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});





