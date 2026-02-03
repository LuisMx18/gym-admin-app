import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

const CLIENTS_COLLECTION = 'clients';

export const addClient = async (clientData, branchId) => {
  try {
    const docRef = await addDoc(collection(db, CLIENTS_COLLECTION), {
      ...clientData,
      branchId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding client:', error);
    return { success: false, error: error.message };
  }
};

export const updateClient = async (clientId, clientData) => {
  try {
    const clientRef = doc(db, CLIENTS_COLLECTION, clientId);
    await updateDoc(clientRef, {
      ...clientData,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating client:', error);
    return { success: false, error: error.message };
  }
};

export const getClientsByBranch = async (branchId) => {
  try {
    const q = query(
      collection(db, CLIENTS_COLLECTION),
      where('branchId', '==', branchId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const clients = [];
    querySnapshot.forEach((doc) => {
      clients.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, clients };
  } catch (error) {
    console.error('Error getting clients:', error);
    return { success: false, error: error.message, clients: [] };
  }
};

export const searchClients = async (searchTerm, branchId) => {
  try {
    // Por simplicidad, obtenemos todos y filtramos localmente
    // En producción, considera usar Algolia o similar para búsqueda más eficiente
    const result = await getClientsByBranch(branchId);
    if (!result.success) return result;
    
    const filtered = result.clients.filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.phone && client.phone.includes(searchTerm))
    );
    
    return { success: true, clients: filtered };
  } catch (error) {
    console.error('Error searching clients:', error);
    return { success: false, error: error.message, clients: [] };
  }
};
