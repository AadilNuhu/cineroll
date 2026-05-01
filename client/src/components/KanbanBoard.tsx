import { useMovies } from '../contexts/MovieContext';
import type { Movie } from '../contexts/MovieContext';
import MovieCard from './MovieCard';

const KanbanBoard = () => {
    const { movies, updateMovie } = useMovies();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    const handleDrop = (e: React.DragEvent, status: Movie['status']) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('movieId');
        if (id) {
            updateMovie(id, { status });
        }
    };

    const columns: { id: Movie['status']; title: string; color: string }[] = [
        { id: 'not_watched', title: 'Not Watched', color: 'border-slate-500 bg-slate-900/40' },
        { id: 'watching', title: 'Currently Watching', color: 'border-pink-500 bg-pink-950/20' },
        { id: 'watched', title: 'Have Watched', color: 'border-purple-500 bg-purple-950/20' }
    ];

    return (
        <div className="mobile-kanban-container md:flex md:flex-row gap-6 items-start h-full">
            {columns.map((col, index) => {
                const columnMovies = movies.filter(m => m.status === col.id);

                return (
                    <div
                        key={col.id}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, col.id)}
                        className={`mobile-kanban-column flex-1 min-h-[500px] border-t-4 ${col.color} rounded-xl glass-panel p-4 flex flex-col gap-4 animate-fade-in`}
                        style={{ animationDelay: `${index * 0.15}s` }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-bold text-lg">{col.title}</h2>
                            <span className="bg-white/10 text-xs px-2 py-1 rounded-full font-bold">{columnMovies.length}</span>
                        </div>

                        <div className="flex flex-col gap-4">
                            {columnMovies.map(movie => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                            {columnMovies.length === 0 && (
                                <div className="text-center p-8 text-slate-500 text-sm border border-dashed border-slate-700 rounded-lg">
                                    Drop movies here
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default KanbanBoard;
