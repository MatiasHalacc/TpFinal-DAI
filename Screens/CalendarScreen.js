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
      marked[d] = { marked: true, selectedColor: '#7f8c8d' }; // Color suave para las fechas con eventos
    });
    if (selectedDate) {
      marked[selectedDate] = { ...(marked[selectedDate] || {}), selected: true, selectedColor: '#3498db' }; // Color para la fecha seleccionada
    }
    return marked;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Calendario de Eventos</Text>
      <Calendar 
        onDayPress={onDayPress} 
        markedDates={getMarkedDates()} 
        style={styles.calendar} 
        theme={{
          selectedDayBackgroundColor: '#3498db',
          todayTextColor: '#e74c3c',
          arrowColor: '#3498db',
        }}
      />

      <View style={styles.eventsHeader}>
        <Text style={styles.eventsTitle}>
          {selectedDate ? `Eventos en ${selectedDate}` : 'Seleccioná una fecha'}
        </Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Añadir Evento</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={events[selectedDate] || []}
        keyExtractor={item => item.id}
        ListEmptyComponent={() => <Text style={styles.empty}>No hay eventos en esta fecha</Text>}
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
            <Text style={styles.modalTitle}>Nuevo Evento</Text>
            <TextInput
              value={newEventText}
              onChangeText={setNewEventText}
              placeholder="Descripción del evento"
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#2c3e50',
  },
  calendar: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#34495e',
  },
  addBtn: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    marginTop: 8,
  },
  empty: {
    textAlign: 'center',
    color: '#95a5a6',
    marginTop: 12,
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  eventText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  delete: {
    color: '#e74c3c',
    fontWeight: '600',
  },
  modalWrap: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
    fontSize: 16,
    color: '#34495e',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    width: '48%',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancel: {
    backgroundColor: '#95a5a6',
  },
  cancelText: {
    color: '#fff',
  },
});
