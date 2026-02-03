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
  { id: 'sucursal1', name: 'Sucursal Centro' },
  { id: 'sucursal2', name: 'Sucursal Norte' },
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
