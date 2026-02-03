import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BranchContext = createContext();

export const useActiveBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useActiveBranch must be used within BranchProvider');
  }
  return context;
};

const BRANCHES = [
  { 
    id: 'h7-life-fit',
    name: "H'7 Gym LIFE FIT",
    address: 'Col. Fovissste, calle Barreta 1297, Linares, N.L.',
    prices: {
      diaria: 35,
      semanal: 150,
      quincenal: 250,
      mensual: 420
    }
  },
  { 
    id: 'balanx-h7',
    name: 'BalanX H7 Gym',
    address: 'Col. San Gerardo La Petaca, Calle José San Martín #2074',
    prices: {
      diaria: 35,
      semanal: 130,
      quincenal: 240,
      mensual: 350
    }
  },
];

export const BranchProvider = ({ children }) => {
  const [activeBranch, setActiveBranchState] = useState(BRANCHES[0]);

  const setActiveBranch = async (branch) => {
    setActiveBranchState(branch);
    await AsyncStorage.setItem('activeBranch', JSON.stringify(branch));
  };

  const loadActiveBranch = async () => {
    try {
      const stored = await AsyncStorage.getItem('activeBranch');
      if (stored) {
        setActiveBranchState(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading active branch:', error);
    }
  };

  const value = {
    activeBranch,
    setActiveBranch,
    branches: BRANCHES,
    loadActiveBranch,
  };

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
};
