import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, SegmentedButtons, Text } from 'react-native-paper';
import { useActiveBranch } from '../context/BranchContext';
import { addClient } from '../services/clientService';
import { addMonths, format } from 'date-fns';

const MEMBERSHIP_TYPES = [
  { value: 'mensual', label: 'Mensual', months: 1 },
  { value: 'trimestral', label: 'Trimestral', months: 3 },
  { value: 'semestral', label: 'Semestral', months: 6 },
  { value: 'anual', label: 'Anual', months: 12 },
];

export default function AddClientScreen({ navigation }) {
  const { activeBranch } = useActiveBranch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    membershipType: 'mensual',
  });

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    const selectedPlan = MEMBERSHIP_TYPES.find(t => t.value === formData.membershipType);
    const membershipEnd = addMonths(new Date(), selectedPlan.months);

    setLoading(true);
    const result = await addClient(
      {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        membershipType: formData.membershipType,
        membershipStart: format(new Date(), 'yyyy-MM-dd'),
        membershipEnd: format(membershipEnd, 'yyyy-MM-dd'),
      },
      activeBranch.id
    );
    setLoading(false);

    if (result.success) {
      Alert.alert('Éxito', 'Cliente agregado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', 'No se pudo agregar el cliente');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TextInput
          label="Nombre completo *"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          mode="outlined"
          style={styles.input}
          disabled={loading}
        />

        <TextInput
          label="Teléfono"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          mode="outlined"
          style={styles.input}
          keyboardType="phone-pad"
          disabled={loading}
        />

        <TextInput
          label="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          disabled={loading}
        />

        <Text variant="titleMedium" style={styles.sectionTitle}>Tipo de Membresía</Text>
        <SegmentedButtons
          value={formData.membershipType}
          onValueChange={(value) => setFormData({ ...formData, membershipType: value })}
          buttons={MEMBERSHIP_TYPES.map(type => ({
            value: type.value,
            label: type.label,
          }))}
          style={styles.segmented}
          disabled={loading}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Guardar Cliente
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    marginTop: 8,
  },
  segmented: {
    marginBottom: 24,
  },
  button: {
    marginTop: 8,
  },
});
