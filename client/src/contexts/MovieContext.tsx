import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getLocalMovies, saveLocalMovie, deleteLocalMovie, bulkSaveLocalMovies } from '../services/db';
import api from '../services/api';
import { useAuth } from './AuthContext';

export interface Movie {
    id: string;
    title: string;
    year: number;
    poster_url: string;
    status: 'not_watched' | 'watching' | 'watched';
    rating: number | null;
    notes: string;
    is_deleted?: boolean;
}

interface MovieContextType {
    movies: Movie[];
    addMovie: (movie: Omit<Movie, 'id'>) => Promise<void>;
    updateMovie: (id: string, updates: Partial<Movie>) => Promise<void>;
    removeMovie: (id: string) => Promise<void>;
    syncWithServer: () => Promise<void>;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider = ({ children }: { children: ReactNode }) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const { token } = useAuth();

    // Load from local DB on start
    useEffect(() => {
        loadLocal();
    }, []);

    const loadLocal = async () => {
        const local = await getLocalMovies();
        setMovies(local.filter((m: Movie) => !m.is_deleted));
    };

    const syncWithServer = async () => {
        if (!token) return;
        try {
            const localMovies = await getLocalMovies();
            // Send all local state to sync to server
            const res = await api.post('/movies/sync', { movies: localMovies });
            const serverMovies = res.data.data;

            // Save server truth to local DB
            await bulkSaveLocalMovies(serverMovies);
            await loadLocal();
        } catch (error) {
            console.error('Failed to sync movies:', error);
        }
    };

    // Sync on login / token available
    useEffect(() => {
        if (token) syncWithServer();
    }, [token]);

    // Network listener
    useEffect(() => {
        const handleOnline = () => {
            syncWithServer().catch(console.error);
        };
        window.addEventListener('online', handleOnline);
        return () => window.removeEventListener('online', handleOnline);
    }, [token]);

    const addMovie = async (movieData: Omit<Movie, 'id'>) => {
        const newMovie: Movie = {
            ...movieData,
            id: crypto.randomUUID(),
        };
        await saveLocalMovie(newMovie);
        await loadLocal();
        if (navigator.onLine && token) syncWithServer();
    };

    const updateMovie = async (id: string, updates: Partial<Movie>) => {
        const existing = await getLocalMovies();
        const movie = existing.find((m: Movie) => m.id === id);
        if (!movie) return;

        const updated = { ...movie, ...updates };
        await saveLocalMovie(updated);
        await loadLocal();
        if (navigator.onLine && token) syncWithServer();
    };

    const removeMovie = async (id: string) => {
        const existing = await getLocalMovies();
        const movie = existing.find((m: Movie) => m.id === id);
        if (!movie) return;

        if (token) {
            // mark as deleted to tell server
            await saveLocalMovie({ ...movie, is_deleted: true });
        } else {
            // Guest mode - delete immediately
            await deleteLocalMovie(id);
        }
        await loadLocal();
        if (navigator.onLine && token) syncWithServer();
    };

    return (
        <MovieContext.Provider value={{ movies, addMovie, updateMovie, removeMovie, syncWithServer }}>
            {children}
        </MovieContext.Provider>
    );
};

export const useMovies = () => {
    const context = useContext(MovieContext);
    if (!context) throw new Error('useMovies must be used within MovieProvider');
    return context;
};
