import { collection, getDocs, addDoc, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Plan, Subscription } from '../types/pricing';


export async function createSubscription(
  userId: string,
  planId: string,
  isYearly: boolean
): Promise<string> {
  const now = new Date();
  const endDate = new Date();
  endDate.setFullYear(now.getFullYear() + (isYearly ? 1 : 0));
  endDate.setMonth(now.getMonth() + (isYearly ? 0 : 1));

  const subscriptionRef = await addDoc(collection(db, 'subscriptions'), {
    userId,
    planId,
    isYearly,
    startDate: Timestamp.fromDate(now),
    endDate: Timestamp.fromDate(endDate),
    status: 'active'
  });

  return subscriptionRef.id;
}

export async function getCurrentSubscription(userId: string): Promise<Subscription | null> {
  const subscriptionsRef = collection(db, 'subscriptions');
  const q = query(
    subscriptionsRef,
    where('userId', '==', userId),
    where('status', '==', 'active')
  );
  
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return {
    ...doc.data(),
    id: doc.id,
    startDate: doc.data().startDate.toDate(),
    endDate: doc.data().endDate.toDate()
  } as Subscription;
}