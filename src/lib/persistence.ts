import { 
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  type Query,
  type DocumentData,
  type QueryConstraint
} from 'firebase/firestore';
import { db, firebase } from './firebase';

export class PersistenceManager {
  private static instance: PersistenceManager;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): PersistenceManager {
    if (!PersistenceManager.instance) {
      PersistenceManager.instance = new PersistenceManager();
    }
    return PersistenceManager.instance;
  }

  private getCacheKey(collectionName: string, id?: string, queryParams?: QueryConstraint[]): string {
    if (id) {
      return `${collectionName}/${id}`;
    }
    return `${collectionName}${queryParams ? JSON.stringify(queryParams) : ''}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  public async get<T>(
    collectionName: string,
    id: string,
    options: { forceFetch?: boolean; useCache?: boolean } = {}
  ): Promise<T | null> {
    const { forceFetch = false, useCache = true } = options;
    const cacheKey = this.getCacheKey(collectionName, id);

    if (!forceFetch && useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached && this.isCacheValid(cached.timestamp)) {
        return cached.data as T;
      }
    }

    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as T;
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching document ${id} from ${collectionName}:`, error);
      throw error;
    }
  }

  public async query<T>(
    collectionName: string,
    queryParams: QueryConstraint[],
    options: { forceFetch?: boolean; useCache?: boolean } = {}
  ): Promise<T[]> {
    const { forceFetch = false, useCache = true } = options;
    const cacheKey = this.getCacheKey(collectionName, undefined, queryParams);

    if (!forceFetch && useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached && this.isCacheValid(cached.timestamp)) {
        return cached.data as T[];
      }
    }

    try {
      const q = query(collection(db, collectionName), ...queryParams);
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
      
      this.cache.set(cacheKey, { data: results, timestamp: Date.now() });
      return results;
    } catch (error) {
      console.error(`Error querying collection ${collectionName}:`, error);
      throw error;
    }
  }

  public async create<T extends { id?: string }>(
    collectionName: string,
    data: T
  ): Promise<string> {
    try {
      const docRef = doc(collection(db, collectionName));
      const id = data.id || docRef.id;
      const timestamp = new Date();
      
      const documentData = {
        ...data,
        id,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      if (!firebase.isNetworkEnabled()) {
        firebase.addPendingOperation(async () => {
          await setDoc(docRef, documentData);
        });
      } else {
        await setDoc(docRef, documentData);
      }

      // Update cache
      this.cache.set(
        this.getCacheKey(collectionName, id),
        { data: documentData, timestamp: Date.now() }
      );

      return id;
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw error;
    }
  }

  public async update<T>(
    collectionName: string,
    id: string,
    data: Partial<T>
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      const updateData = {
        ...data,
        updatedAt: new Date()
      };

      if (!firebase.isNetworkEnabled()) {
        firebase.addPendingOperation(async () => {
          await updateDoc(docRef, updateData);
        });
      } else {
        await updateDoc(docRef, updateData);
      }

      // Update cache
      const existingData = await this.get(collectionName, id);
      if (existingData) {
        this.cache.set(
          this.getCacheKey(collectionName, id),
          {
            data: { ...existingData, ...updateData },
            timestamp: Date.now()
          }
        );
      }
    } catch (error) {
      console.error(`Error updating document ${id} in ${collectionName}:`, error);
      throw error;
    }
  }

  public async delete(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);

      if (!firebase.isNetworkEnabled()) {
        firebase.addPendingOperation(async () => {
          await deleteDoc(docRef);
        });
      } else {
        await deleteDoc(docRef);
      }

      // Remove from cache
      this.cache.delete(this.getCacheKey(collectionName, id));
    } catch (error) {
      console.error(`Error deleting document ${id} from ${collectionName}:`, error);
      throw error;
    }
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public invalidateCache(collectionName: string, id?: string): void {
    if (id) {
      this.cache.delete(this.getCacheKey(collectionName, id));
    } else {
      // Invalidate all entries for the collection
      for (const key of this.cache.keys()) {
        if (key.startsWith(collectionName)) {
          this.cache.delete(key);
        }
      }
    }
  }
}

// Export singleton instance
export const persistenceManager = PersistenceManager.getInstance();