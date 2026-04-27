import { openDB } from 'idb';

const DB_NAME = 'cineroll-db';
const DB_VERSION = 1;
const MOVIES_STORE = 'movies';
const SYNC_QUEUE = 'sync-queue'; // Queue holds operations like insert, update, delete

const initDB = async () => {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(MOVIES_STORE)) {
                db.createObjectStore(MOVIES_STORE, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(SYNC_QUEUE)) {
                db.createObjectStore(SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
            }
        },
    });
};

export const getLocalMovies = async () => {
    const db = await initDB();
    return db.getAll(MOVIES_STORE);
};

export const saveLocalMovie = async (movie: any) => {
    const db = await initDB();
    return db.put(MOVIES_STORE, movie);
};

export const deleteLocalMovie = async (id: string) => {
    const db = await initDB();
    // Instead of fully deleting, we can update it as deleted, 
    // but for simple local storage, we can delete it. 
    // Sync logic will have received a 'delete' in the queue.
    return db.delete(MOVIES_STORE, id);
};

export const clearLocalMovies = async () => {
    const db = await initDB();
    return db.clear(MOVIES_STORE);
};

export const bulkSaveLocalMovies = async (movies: any[]) => {
    const db = await initDB();
    const tx = db.transaction(MOVIES_STORE, 'readwrite');
    for (const movie of movies) {
        if (movie.is_deleted) {
            tx.store.delete(movie.id);
        } else {
            tx.store.put(movie);
        }
    }
    await tx.done;
};
