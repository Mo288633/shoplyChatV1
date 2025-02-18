import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  enableMultiTabIndexedDbPersistence,
  setLogLevel,
  connectFirestoreEmulator,
  enableNetwork,
  disableNetwork,
  waitForPendingWrites,
  type Firestore
} from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

// Set log level based on environment
if (process.env.NODE_ENV === 'production') {
  setLogLevel('error');
} else {
  setLogLevel('debug');
}

// Validate required environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
] as const;

for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

class FirebaseService {
  private static instance: FirebaseService;
  private app;
  private db: Firestore;
  private auth;
  private persistenceEnabled = false;
  private networkEnabled = true;
  private pendingOperations: Array<() => Promise<void>> = [];
  private retryAttempts = 0;
  private readonly MAX_RETRY_ATTEMPTS = 5;
  private readonly RETRY_DELAY = 1000;
  private readonly RETRY_BACKOFF_FACTOR = 1.5;

  private constructor() {
    try {
      this.app = initializeApp(firebaseConfig);
      this.db = getFirestore(this.app);
      this.auth = getAuth(this.app);

      // Connect to emulators in development
      if (process.env.NODE_ENV === 'development') {
        connectFirestoreEmulator(this.db, 'localhost', 8080);
        connectAuthEmulator(this.auth, 'http://localhost:9099');
      }

      this.initializePersistence();
      this.setupNetworkListeners();
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      throw error;
    }
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  private async initializePersistence(): Promise<void> {
    try {
      await enableMultiTabIndexedDbPersistence(this.db);
      this.persistenceEnabled = true;
      console.info('Firebase persistence enabled successfully');
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'failed-precondition':
            console.warn('Multiple tabs open, persistence enabled in another tab');
            break;
          case 'unimplemented':
            console.warn('Browser does not support persistence');
            break;
          default:
            console.error('Error enabling persistence:', error);
        }
      }
      // Continue without persistence
      this.persistenceEnabled = false;
    }
  }

  private setupNetworkListeners(): void {
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));

    // Initial network check
    if (navigator.onLine) {
      this.handleOnline();
    } else {
      this.handleOffline();
    }
  }

  private async handleOnline(): Promise<void> {
    if (!this.networkEnabled) {
      try {
        await this.enableNetwork();
        await this.processPendingOperations();
      } catch (error) {
        console.error('Error handling online state:', error);
        this.scheduleRetry();
      }
    }
  }

  private async handleOffline(): Promise<void> {
    try {
      await this.disableNetwork();
    } catch (error) {
      console.error('Error handling offline state:', error);
    }
  }

  private async scheduleRetry(): Promise<void> {
    if (this.retryAttempts >= this.MAX_RETRY_ATTEMPTS) {
      console.error('Max retry attempts reached');
      return;
    }

    this.retryAttempts++;
    const delay = this.RETRY_DELAY * Math.pow(this.RETRY_BACKOFF_FACTOR, this.retryAttempts - 1);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    await this.handleOnline();
  }

  private async processPendingOperations(): Promise<void> {
    while (this.pendingOperations.length > 0) {
      const operation = this.pendingOperations.shift();
      if (operation) {
        try {
          await operation();
        } catch (error) {
          console.error('Error processing pending operation:', error);
          // Re-queue failed operations
          this.pendingOperations.unshift(operation);
          break;
        }
      }
    }
  }

  public async enableNetwork(): Promise<void> {
    try {
      await enableNetwork(this.db);
      this.networkEnabled = true;
      this.retryAttempts = 0;
      console.info('Network connection enabled');
    } catch (error) {
      console.error('Error enabling network:', error);
      throw error;
    }
  }

  public async disableNetwork(): Promise<void> {
    try {
      await waitForPendingWrites(this.db);
      await disableNetwork(this.db);
      this.networkEnabled = false;
      console.info('Network connection disabled');
    } catch (error) {
      console.error('Error disabling network:', error);
      throw error;
    }
  }

  public addPendingOperation(operation: () => Promise<void>): void {
    this.pendingOperations.push(operation);
  }

  public getFirestore(): Firestore {
    return this.db;
  }

  public getAuth() {
    return this.auth;
  }

  public isPersistenceEnabled(): boolean {
    return this.persistenceEnabled;
  }

  public isNetworkEnabled(): boolean {
    return this.networkEnabled;
  }

  public getPendingOperationsCount(): number {
    return this.pendingOperations.length;
  }
}

// Initialize the singleton instance
const firebaseService = FirebaseService.getInstance();

// Export initialized instances and collection references
export const db = firebaseService.getFirestore();
export const auth = firebaseService.getAuth();
export const firebase = firebaseService;

// Collection references
export const usersCollection = 'users';
export const plansCollection = 'plans';
export const subscriptionsCollection = 'subscriptions';
export const invoicesCollection = 'invoices';
export const chatbotsCollection = 'chatbots';
export const conversationsCollection = 'conversations';
export const messagesCollection = 'messages';

// Helper function to check initialization status
export function isFirebaseInitialized(): boolean {
  return !!firebase && !!db && !!auth;
}