import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function ContactModal({ visible, companyName, onClose, onWhatsApp, onEmail }: any) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Hubungi {companyName}</Text>
          <TouchableOpacity style={styles.btn} onPress={onWhatsApp}>
            <Ionicons name="logo-whatsapp" size={24} color="#fff" />
            <Text style={styles.btnText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#1A73E8' }]} onPress={onEmail}>
            <Ionicons name="mail" size={24} color="#fff" />
            <Text style={styles.btnText}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Batal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  btn: { flexDirection: 'row', backgroundColor: '#25D366', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  closeBtn: { padding: 16, alignItems: 'center' },
  closeText: { color: '#5F6368', fontSize: 16, fontWeight: 'bold' }
});
