import { useState } from 'react';
import { useMovies } from '../contexts/MovieContext';
import type { Movie } from '../contexts/MovieContext';
import { FiTrash2, FiEdit2, FiCheck } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const MovieCard = ({ movie }: { movie: Movie }) => {
    const { updateMovie, removeMovie } = useMovies();
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(movie.title);
    const [year, setYear] = useState(movie.year.toString());
    const [rating, setRating] = useState<number | null>(movie.rating);
    const [notes, setNotes] = useState(movie.notes || '');

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('movieId', movie.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateMovie(movie.id, { status: e.target.value as Movie['status'] });
    };

    const handleSave = () => {
        updateMovie(movie.id, { 
            title, 
            year: parseInt(year) || movie.year,
            rating,
            notes 
        });
        setIsEditing(false);
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            className="group relative flex items-start gap-4 p-3 bg-slate-900/60 rounded-xl border border-white/5 hover:border-pink-500/50 hover:bg-slate-800/80 transition-all cursor-grab active:cursor-grabbing shadow-lg"
        >
            <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-16 h-24 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform shrink-0"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x225?text=No+Poster';
                }}
            />
            <div className="flex-1 py-1 min-w-0">
                {isEditing ? (
                    <div className="flex flex-col gap-2 mb-2 pr-8">
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-slate-800 border border-slate-600 rounded p-1 text-sm text-white w-full"
                        />
                        <div className="flex gap-2">
                            <input
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="bg-slate-800 border border-slate-600 rounded p-1 text-sm text-white w-1/3"
                            />
                            <select
                                value={rating || ''}
                                onChange={(e) => setRating(e.target.value ? parseInt(e.target.value) : null)}
                                className="bg-slate-800 border border-slate-600 rounded p-1 text-sm text-white w-2/3"
                            >
                                <option value="">No Rating</option>
                                <option value="1">1 Star</option>
                                <option value="2">2 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="5">5 Stars</option>
                            </select>
                        </div>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="bg-slate-800 border border-slate-600 rounded p-1 text-sm text-white w-full resize-none h-16"
                            placeholder="Add notes..."
                        />
                    </div>
                ) : (
                    <div className="mb-2 pr-8">
                        <h3 className="font-bold text-slate-200 line-clamp-1">{movie.title}</h3>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-slate-400">{movie.year}</p>
                            {movie.rating && (
                                <div className="flex text-yellow-400 text-xs">
                                    {[...Array(movie.rating)].map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                </div>
                            )}
                        </div>
                        {movie.notes && (
                            <p className="text-xs text-slate-500 line-clamp-2 mt-1 italic">
                                "{movie.notes}"
                            </p>
                        )}
                    </div>
                )}

                <select
                    value={movie.status}
                    onChange={handleStatusChange}
                    onClick={e => e.stopPropagation()} // prevent drag conflicts
                    className="md:hidden mt-2 bg-slate-800 text-xs text-white p-1 rounded border border-slate-600 w-full"
                >
                    <option value="not_watched">Not Watched</option>
                    <option value="watching">Watching</option>
                    <option value="watched">Have Watched</option>
                </select>

                <div className="absolute top-2 right-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    {isEditing ? (
                        <button
                            onClick={handleSave}
                            className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-500/20"
                            title="Save"
                        >
                            <FiCheck size={14} />
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-colors border border-blue-500/20"
                            title="Edit"
                        >
                            <FiEdit2 size={14} />
                        </button>
                    )}
                    <button
                        onClick={() => removeMovie(movie.id)}
                        className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
                        title="Delete"
                    >
                        <FiTrash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
