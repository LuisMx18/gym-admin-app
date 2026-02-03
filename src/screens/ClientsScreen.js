import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Searchbar, List, FAB, Chip, Text } from 'react-native-paper';
import { useActiveBranch } from '../context/BranchContext';
import { getClientsByBranch, searchClients } from '../services/clientService';
import { getMembershipStatus, formatDate } from '../utils/membershipStatus';

export default function ClientsScreen({ navigation }) {
  const { activeBranch } = useActiveBranch();
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadClients = async () => {
    setLoading(true);
    const result = await getClientsByBranch(activeBranch.id);
    if (result.success) {
      setClients(result.clients);
      setFilteredClients(result.clients);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadClients();
  }, [activeBranch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClients();
    setRefreshing(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredClients(clients);
    } else {
      const result = await searchClients(query, activeBranch.id);
      if (result.success) {
        setFilteredClients(result.clients);
      }
    }
  };

  const renderClient = ({ item }) => {
    const status = getMembershipStatus(item.membershipEnd);
    
    return (
      <List.Item
        title={item.name}
        description={`${item.phone || 'Sin teléfono'} • ${item.membershipType || 'Sin plan'}`}
        left={props => <List.Icon {...props} icon="account" />}
        right={() => (
          <View style={styles.statusContainer}>
            <Chip
              mode="flat"
              textStyle={{ color: status.color, fontSize: 12 }}
              style={{ backgroundColor: `${status.color}20` }}
            >
              {status.text}
            </Chip>
          </View>
        )}
        onPress={() => navigation.navigate('ClientDetail', { client: item })}
        style={styles.listItem}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar cliente..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
      />

      {filteredClients.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium" style={styles.emptyText}>
            {searchQuery ? 'No se encontraron clientes' : 'No hay clientes registrados'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredClients}
          renderItem={renderClient}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddClient')}
      />
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
  statusContainer: {
    justifyContent: 'center',
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
