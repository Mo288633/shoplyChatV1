import { 
  where, 
  orderBy, 
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { persistenceManager } from '../lib/persistence';
import type { User, Plan, Subscription, Invoice } from '../types/database';
import { 
  usersCollection, 
  plansCollection, 
  subscriptionsCollection, 
  invoicesCollection 
} from '../lib/firebase';

// User Services
export async function createUser(userId: string, data: Partial<User>): Promise<void> {
  await persistenceManager.create(usersCollection, {
    ...data,
    id: userId
  });
}

export async function getUser(userId: string): Promise<User | null> {
  return persistenceManager.get<User>(usersCollection, userId);
}

export async function updateUser(userId: string, data: Partial<User>): Promise<void> {
  await persistenceManager.update(usersCollection, userId, data);
}

// Plan Services
export async function getPlans(): Promise<Plan[]> {
  return persistenceManager.query<Plan>(
    plansCollection,
    [where('isActive', '==', true), orderBy('price')]
  );
}

export async function getPlan(planId: string): Promise<Plan | null> {
  return persistenceManager.get<Plan>(plansCollection, planId);
}

// Subscription Services
export async function createSubscription(data: Partial<Subscription>): Promise<string> {
  return persistenceManager.create(subscriptionsCollection, data);
}

export async function getActiveSubscription(userId: string): Promise<Subscription | null> {
  const subscriptions = await persistenceManager.query<Subscription>(
    subscriptionsCollection,
    [
      where('userId', '==', userId),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
      limit(1)
    ]
  );
  
  return subscriptions[0] || null;
}

export async function updateSubscription(
  subscriptionId: string, 
  data: Partial<Subscription>
): Promise<void> {
  await persistenceManager.update(subscriptionsCollection, subscriptionId, data);
}

// Invoice Services
export async function createInvoice(data: Partial<Invoice>): Promise<string> {
  return persistenceManager.create(invoicesCollection, data);
}

export async function getInvoices(userId: string): Promise<Invoice[]> {
  return persistenceManager.query<Invoice>(
    invoicesCollection,
    [
      where('userId', '==', userId),
      orderBy('date', 'desc')
    ]
  );
}

export async function getInvoice(invoiceId: string): Promise<Invoice | null> {
  return persistenceManager.get<Invoice>(invoicesCollection, invoiceId);
}