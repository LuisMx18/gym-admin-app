import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, Button, Menu, Divider } from 'react-native-paper';
import { useActiveBranch } from '../context/BranchContext';
import { useAuth } from '../context/AuthContext';
import { getTodayCheckins } from '../services/checkinService';
import { getClientsByBranch } from '../services/clientService';
import { getMembershipStatus } from '../utils/membershipStatus';

export default function DashboardScreen({ navigation }) {
  const { activeBranch, branches, setActiveBranch } = useActiveBranch();
  const { logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    todayCheckins: 0,
    activeMembers: 0,
    expiringMembers: 0,
    expiredMembers: 0,
  });

  const loadStats = async () => {
    const checkinsResult = await getTodayCheckins(activeBranch.id);
    const clientsResult = await getClientsByBranch(activeBranch.id);

    if (clientsResult.success) {
      const clients = clientsResult.clients;
      const active = clients.filter(c => getMembershipStatus(c.membershipEnd).status === 'active').length;
      const expiring = clients.filter(c => getMembershipStatus(c.membershipEnd).status === 'expiring').length;
      const expired = clients.filter(c => getMembershipStatus(c.membershipEnd).status === 'expired').length;

      setStats({
        todayCheckins: checkinsResult.success ? checkinsResult.checkins.length : 0,
        activeMembers: active,
        expiringMembers: expiring,
        expiredMembers: expired,
      });
    }
  };

  useEffect(() => {
    loadStats();
  }, [activeBranch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text variant="headlineSmall">Dashboard</Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="text"
                onPress={() => setMenuVisible(true)}
                icon="map-marker"
              >
                {activeBranch.name}
              </Button>
            }
          >
            {branches.map((branch) => (
              <Menu.Item
                key={branch.id}
                onPress={() => {
                  setActiveBranch(branch);
                  setMenuVisible(false);
                }}
                title={branch.name}
                leadingIcon={branch.id === activeBranch.id ? 'check' : undefined}
              />
            ))}
          </Menu>
        </View>
        <Button mode="text" onPress={handleLogout} icon="logout">
          Salir
        </Button>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Asistencia Hoy</Text>
            <Text variant="displayMedium" style={styles.statNumber}>
              {stats.todayCheckins}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>check-ins registrados</Text>
          </Card.Content>
        </Card>

        <View style={styles.row}>
          <Card style={[styles.card, styles.halfCard]}>
            <Card.Content>
              <Text variant="titleSmall">Activas</Text>
              <Text variant="displaySmall" style={[styles.statNumber, { color: '#4caf50' }]}>
                {stats.activeMembers}
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.card, styles.halfCard]}>
            <Card.Content>
              <Text variant="titleSmall">Por Vencer</Text>
              <Text variant="displaySmall" style={[styles.statNumber, { color: '#ff9800' }]}>
                {stats.expiringMembers}
              </Text>
            </Card.Content>
          </Card>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Membresías Vencidas</Text>
            <Text variant="displayMedium" style={[styles.statNumber, { color: '#f44336' }]}>
              {stats.expiredMembers}
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.actions}>
          <Button
            mode="contained"
            icon="account-plus"
            style={styles.actionButton}
            onPress={() => navigation.navigate('Clients')}
          >
            Ver Clientes
          </Button>

          <Button
            mode="contained"
            icon="check-circle"
            style={styles.actionButton}
            onPress={() => navigation.navigate('Checkin')}
          >
            Registrar Check-in
          </Button>

          <Button
            mode="outlined"
            icon="chart-bar"
            style={styles.actionButton}
            onPress={() => navigation.navigate('Reports')}
          >
            Ver Reportes
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  halfCard: {
    flex: 1,
  },
  statNumber: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#666',
  },
  actions: {
    marginTop: 8,
  },
  actionButton: {
    marginBottom: 12,
  },
});
