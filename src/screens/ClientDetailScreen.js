import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, Chip, Divider, TextInput } from 'react-native-paper';
import { updateClient } from '../services/clientService';
import { getMembershipStatus, formatDate } from '../utils/membershipStatus';
import { addMonths, format } from 'date-fns';

export default function ClientDetailScreen({ route, navigation }) {
  const { client } = route.params;
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: client.phone || '',
    email: client.email || '',
  });

  const status = getMembershipStatus(client.membershipEnd);

  const handleUpdate = async () => {
    setLoading(true);
    const result = await updateClient(client.id, formData);
    setLoading(false);

    if (result.success) {
      Alert.alert('Éxito', 'Cliente actualizado', [
        { text: 'OK', onPress: () => {
          setEditing(false);
          navigation.goBack();
        }}
      ]);
    } else {
      Alert.alert('Error', 'No se pudo actualizar');
    }
  };

  const handleRenew = () => {
    Alert.alert(
      'Renovar Membresía',
      '¿Deseas renovar la membresía por 1 mes?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Renovar',
          onPress: async () => {
            const newEnd = addMonths(new Date(), 1);
            setLoading(true);
            const result = await updateClient(client.id, {
              membershipStart: format(new Date(), 'yyyy-MM-dd'),
              membershipEnd: format(newEnd, 'yyyy-MM-dd'),
            });
            setLoading(false);

            if (result.success) {
              Alert.alert('Éxito', 'Membresía renovada', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } else {
              Alert.alert('Error', 'No se pudo renovar');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Text variant="headlineMedium">{client.name}</Text>
              <Chip
                mode="flat"
                textStyle={{ color: status.color }}
                style={{ backgroundColor: `${status.color}20` }}
              >
                {status.text}
              </Chip>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.label}>Plan:</Text>
              <Text variant="bodyMedium">{client.membershipType || '-'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.label}>Inicio:</Text>
              <Text variant="bodyMedium">{formatDate(client.membershipStart)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.label}>Vencimiento:</Text>
              <Text variant="bodyMedium">{formatDate(client.membershipEnd)}</Text>
            </View>

            <Divider style={styles.divider} />

            {editing ? (
              <>
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

                <View style={styles.buttonRow}>
                  <Button
                    mode="outlined"
                    onPress={() => setEditing(false)}
                    style={styles.halfButton}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleUpdate}
                    style={styles.halfButton}
                    loading={loading}
                    disabled={loading}
                  >
                    Guardar
                  </Button>
                </View>
              </>
            ) : (
              <>
                <View style={styles.infoRow}>
                  <Text variant="bodyMedium" style={styles.label}>Teléfono:</Text>
                  <Text variant="bodyMedium">{client.phone || '-'}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text variant="bodyMedium" style={styles.label}>Email:</Text>
                  <Text variant="bodyMedium">{client.email || '-'}</Text>
                </View>

                <Button
                  mode="outlined"
                  onPress={() => setEditing(true)}
                  style={styles.button}
                  icon="pencil"
                >
                  Editar Información
                </Button>
              </>
            )}
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleRenew}
          style={styles.button}
          icon="refresh"
          disabled={loading}
        >
          Renovar Membresía
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
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#666',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  halfButton: {
    flex: 1,
  },
});
