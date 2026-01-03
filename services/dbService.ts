
const DB_NAME = 'NobelSpiritDB';
const STORE_NAME = 'custom_images';
const B2B_STORE = 'b2b_contacts';
const DB_VERSION = 2; // Incrementing version

/**
 * Initializes the IndexedDB instance.
 */
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      if (!db.objectStoreNames.contains(B2B_STORE)) {
        db.createObjectStore(B2B_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Saves an image data string associated with a product ID.
 */
export const saveImage = async (id: string, data: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(data, id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Retrieves all stored custom images.
 */
export const getAllImages = async (): Promise<Record<string, string>> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.openCursor();
    const results: Record<string, string> = {};

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        results[cursor.key as string] = cursor.value;
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    request.onerror = () => reject(request.error);
  });
};

/**
 * Tracking B2B Contact Outreach
 */
export const saveB2BContact = async (contact: { id: string, name: string, status: string, date: string }): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(B2B_STORE, 'readwrite');
  const store = transaction.objectStore(B2B_STORE);
  store.put(contact);
};

export const getB2BContacts = async (): Promise<any[]> => {
  const db = await openDB();
  return new Promise((resolve) => {
    const transaction = db.transaction(B2B_STORE, 'readonly');
    const store = transaction.objectStore(B2B_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
  });
};

/**
 * Clears all custom images from the database.
 * Used for the Master Protocol Reset.
 */
export const clearImages = async (): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
