import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, DataTable, SegmentedButtons } from 'react-native-paper';
import { useActiveBranch } from '../context/BranchContext';
import { getTodayCheckins, getCheckinsByDateRange } from '../services/checkinService';
import { getClientsByBranch } from '../services/clientService';
import { getMembershipStatus } from '../utils/membershipStatus';
import { format, subDays, startOfDay } from 'date-fns';

export default function ReportsScreen() {
  const { activeBranch } = useActiveBranch();
  const [period, setPeriod] = useState('today');
  const [stats, setStats] = useState({
    checkins: 0,
    activeMembers: 0,
    expiringMembers: 0,
    expiredMembers: 0,
    recentCheckins: [],
  });

  const loadStats = async () => {
    let checkinsResult;
    
    if (period === 'today') {
      checkinsResult = await getTodayCheckins(activeBranch.id);
    } else if (period === 'week') {
      const endDate = new Date();
      const startDate = subDays(endDate, 7);
      checkinsResult = await getCheckinsByDateRange(activeBranch.id, startDate, endDate);
    } else if (period === 'month') {
      const endDate = new Date();
      const startDate = subDays(endDate, 30);
      checkinsResult = await getCheckinsByDateRange(activeBranch.id, startDate, endDate);
    }

    const clientsResult = await getClientsByBranch(activeBranch.id);

    if (clientsResult.success) {
      const clients = clientsResult.clients;
      const active = clients.filter(c => getMembershipStatus(c.membershipEnd).status === 'active').length;
      const expiring = clients.filter(c => getMembershipStatus(c.membershipEnd).status === 'expiring').length;
      const expired = clients.filter(c => getMembershipStatus(c.membershipEnd).status === 'expired').length;

      // Últimos 5 check-ins
      const recentCheckins = checkinsResult.success 
        ? checkinsResult.checkins
            .sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds)
            .slice(0, 5)
        : [];

      setStats({
        checkins: checkinsResult.success ? checkinsResult.checkins.length : 0,
        activeMembers: active,
        expiringMembers: expiring,
        expiredMembers: expired,
        recentCheckins,
      });
    }
  };

  useEffect(() => {
    loadStats();
  }, [activeBranch, period]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate();
    return format(date, 'dd/MM HH:mm');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>Reportes</Text>

        <SegmentedButtons
          value={period}
          onValueChange={setPeriod}
          buttons={[
            { value: 'today', label: 'Hoy' },
            { value: 'week', label: '7 días' },
            { value: 'month', label: '30 días' },
          ]}
          style={styles.segmented}
        />

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Asistencia</Text>
            <Text variant="displayMedium" style={styles.statNumber}>
              {stats.checkins}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              check-ins totales
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>Estado de Membresías</Text>
            <DataTable>
              <DataTable.Row>
                <DataTable.Cell>Activas</DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={{ color: '#4caf50', fontWeight: 'bold' }}>
                    {stats.activeMembers}
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>Por Vencer (7 días)</DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={{ color: '#ff9800', fontWeight: 'bold' }}>
                    {stats.expiringMembers}
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>Vencidas</DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={{ color: '#f44336', fontWeight: 'bold' }}>
                    {stats.expiredMembers}
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>Últimos Check-ins</Text>
            {stats.recentCheckins.length === 0 ? (
              <Text style={styles.emptyText}>No hay check-ins registrados</Text>
            ) : (
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Cliente</DataTable.Title>
                  <DataTable.Title numeric>Hora</DataTable.Title>
                </DataTable.Header>

                {stats.recentCheckins.map((checkin, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell>{checkin.clientName}</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {formatTimestamp(checkin.timestamp)}
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            )}
          </Card.Content>
        </Card>
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
  title: {
    marginBottom: 16,
  },
  segmented: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 8,
  },
  statNumber: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#666',
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    paddingVertical: 16,
  },
});
