import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { startOfDay, endOfDay } from 'date-fns';

const CHECKINS_COLLECTION = 'checkins';

export const recordCheckin = async (clientId, clientName, branchId) => {
  try {
    const docRef = await addDoc(collection(db, CHECKINS_COLLECTION), {
      clientId,
      clientName,
      branchId,
      timestamp: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error recording check-in:', error);
    return { success: false, error: error.message };
  }
};

export const getTodayCheckins = async (branchId) => {
  try {
    const today = new Date();
    const start = Timestamp.fromDate(startOfDay(today));
    const end = Timestamp.fromDate(endOfDay(today));
    
    const q = query(
      collection(db, CHECKINS_COLLECTION),
      where('branchId', '==', branchId),
      where('timestamp', '>=', start),
      where('timestamp', '<=', end)
    );
    
    const querySnapshot = await getDocs(q);
    const checkins = [];
    querySnapshot.forEach((doc) => {
      checkins.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, checkins };
  } catch (error) {
    console.error('Error getting today checkins:', error);
    return { success: false, error: error.message, checkins: [] };
  }
};

export const getCheckinsByDateRange = async (branchId, startDate, endDate) => {
  try {
    const start = Timestamp.fromDate(startOfDay(startDate));
    const end = Timestamp.fromDate(endOfDay(endDate));
    
    const q = query(
      collection(db, CHECKINS_COLLECTION),
      where('branchId', '==', branchId),
      where('timestamp', '>=', start),
      where('timestamp', '<=', end)
    );
    
    const querySnapshot = await getDocs(q);
    const checkins = [];
    querySnapshot.forEach((doc) => {
      checkins.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, checkins };
  } catch (error) {
    console.error('Error getting checkins by date range:', error);
    return { success: false, error: error.message, checkins: [] };
  }
};
