import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, SafeAreaView, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [events, setEvents] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newEventText, setNewEventText] = useState('');

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('calendarEvents');
      if (stored) setEvents(JSON.parse(stored));
    })();
  }, []);

  const saveEvents = async (next) => {
    await AsyncStorage.setItem('calendarEvents', JSON.stringify(next));
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const addEvent = () => {
    if (!selectedDate) return Alert.alert('Seleccioná una fecha');
    if (!newEventText.trim()) return Alert.alert('Escribí algo');

    const newEv = { id: Date.now().toString(), text: newEventText.trim() };
    const updated = {
      ...events,
      [selectedDate]: events[selectedDate] ? [...events[selectedDate], newEv] : [newEv],
    };
    setEvents(updated);
    saveEvents(updated);
    setNewEventText('');
    setModalVisible(false);
  };

  const removeEvent = (date, id) => {
    const filtered = (events[date] || []).filter(e => e.id !== id);
    const next = { ...events, [date]: filtered };
    if (filtered.length === 0) delete next[date];
    setEvents(next);
    saveEvents(next);
  };

  const getMarkedDates = () => {
    const marked = {};
    Object.keys(events).forEach(d => {
      marked[d] = { marked: true };
    });
    if (selectedDate) {
      marked[selectedDate] = { ...(marked[selectedDate] || {}), selected: true, selectedColor: '#70d7c7' };
    }
    return marked;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Calendario</Text>
      <Calendar onDayPress={onDayPress} markedDates={getMarkedDates()} />

      <View style={styles.eventsHeader}>
        <Text style={styles.eventsTitle}>
          {selectedDate ? `Eventos en ${selectedDate}` : 'Seleccioná una fecha'}
        </Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Añadir</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={events[selectedDate] || []}
        keyExtractor={item => item.id}
        ListEmptyComponent={() => <Text style={styles.empty}>No hay eventos</Text>}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventText}>{item.text}</Text>
            <TouchableOpacity onPress={() => removeEvent(selectedDate, item.id)}>
              <Text style={styles.delete}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
        style={styles.list}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalWrap}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Nuevo evento</Text>
            <TextInput
              value={newEventText}
              onChangeText={setNewEventText}
              placeholder="Descripción"
              style={styles.input}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btn} onPress={addEvent}>
                <Text style={styles.btnText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={() => setModalVisible(false)}>
                <Text style={[styles.btnText, styles.cancelText]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  eventsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  eventsTitle: { fontSize: 16 },
  addBtn: { backgroundColor: '#0a84ff', padding: 8, borderRadius: 6 },
  addBtnText: { color: '#fff', fontWeight: '600' },
  list: { marginTop: 8 },
  empty: { textAlign: 'center', color: '#666', marginTop: 12 },
  eventItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderColor: '#eee' },
  eventText: { flex: 1 },
  delete: { color: '#ff3b30', marginLeft: 12 },
  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modal: { width: '90%', backgroundColor: '#fff', padding: 16, borderRadius: 8 },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, marginBottom: 12 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { backgroundColor: '#0a84ff', padding: 10, borderRadius: 6, width: '48%', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600' },
  cancel: { backgroundColor: '#eee' },
  cancelText: { color: '#333' }
});
