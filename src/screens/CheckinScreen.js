import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Searchbar, List, Text, Chip, Button } from 'react-native-paper';
import { useActiveBranch } from '../context/BranchContext';
import { getClientsByBranch } from '../services/clientService';
import { recordCheckin } from '../services/checkinService';
import { getMembershipStatus } from '../utils/membershipStatus';

export default function CheckinScreen({ navigation }) {
  const { activeBranch } = useActiveBranch();
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadClients = async () => {
    const result = await getClientsByBranch(activeBranch.id);
    if (result.success) {
      // Ordenar por membresías activas primero
      const sorted = result.clients.sort((a, b) => {
        const statusA = getMembershipStatus(a.membershipEnd).status;
        const statusB = getMembershipStatus(b.membershipEnd).status;
        if (statusA === 'active' && statusB !== 'active') return -1;
        if (statusA !== 'active' && statusB === 'active') return 1;
        return 0;
      });
      setClients(sorted);
      setFilteredClients([]);
    }
  };

  useEffect(() => {
    loadClients();
  }, [activeBranch]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredClients([]);
    } else {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(query.toLowerCase()) ||
        (client.phone && client.phone.includes(query))
      );
      setFilteredClients(filtered);
    }
  };

  const handleCheckin = async (client) => {
    const status = getMembershipStatus(client.membershipEnd);
    
    if (status.status === 'expired') {
      Alert.alert(
        'Membresía Vencida',
        `La membresía de ${client.name} está vencida. ¿Deseas registrar el check-in de todas formas?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Registrar', onPress: () => doCheckin(client) }
        ]
      );
    } else {
      doCheckin(client);
    }
  };

  const doCheckin = async (client) => {
    setLoading(true);
    const result = await recordCheckin(client.id, client.name, activeBranch.id);
    setLoading(false);

    if (result.success) {
      Alert.alert('✓ Check-in Exitoso', `${client.name} registrado`, [
        { text: 'OK', onPress: () => setSearchQuery('') }
      ]);
      setFilteredClients([]);
    } else {
      Alert.alert('Error', 'No se pudo registrar el check-in');
    }
  };

  const renderClient = ({ item }) => {
    const status = getMembershipStatus(item.membershipEnd);
    
    return (
      <List.Item
        title={item.name}
        description={item.membershipType || 'Sin plan'}
        left={props => <List.Icon {...props} icon="account" />}
        right={() => (
          <View style={styles.rightContainer}>
            <Chip
              mode="flat"
              textStyle={{ color: status.color, fontSize: 11 }}
              style={{ backgroundColor: `${status.color}20`, marginRight: 8 }}
            >
              {status.text}
            </Chip>
            <Button
              mode="contained"
              onPress={() => handleCheckin(item)}
              disabled={loading}
              compact
            >
              Check-in
            </Button>
          </View>
        )}
        style={styles.listItem}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar cliente por nombre o teléfono..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
        autoFocus
      />

      {searchQuery.trim() === '' ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium" style={styles.emptyText}>
            Escribe para buscar un cliente
          </Text>
        </View>
      ) : filteredClients.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium" style={styles.emptyText}>
            No se encontraron clientes
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredClients}
          renderItem={renderClient}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  listItem: {
    backgroundColor: 'white',
    marginBottom: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
  },
});
