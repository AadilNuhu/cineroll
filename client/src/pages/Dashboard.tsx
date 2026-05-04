import { useState } from 'react';
import KanbanBoard from '../components/KanbanBoard';
import { useMovies } from '../contexts/MovieContext';

const Dashboard = () => {
    const { addMovie } = useMovies();
    const [showAdd, setShowAdd] = useState(false);
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [posterUrl, setPosterUrl] = useState('');
    const [rating, setRating] = useState<number | null>(null);
    const [notes, setNotes] = useState('');
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPosterUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        addMovie({
            title,
            year: parseInt(year) || new Date().getFullYear(),
            poster_url: posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster',
            status: 'not_watched',
            rating: rating,
            notes: notes
        });

        setTitle('');
        setYear('');
        setPosterUrl('');
        setRating(null);
        setNotes('');
        setShowAdd(false);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center bg-slate-800/40 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400 mb-2">My Movie Journey</h1>
                    <p className="text-slate-400 text-sm">Track, rate, and organize your cinematic experiences.</p>
                </div>
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all border border-white/10 font-bold"
                >
                    {showAdd ? 'Cancel' : '+ Add Movie'}
                </button>
            </div>

            {showAdd && (
                <form onSubmit={handleAdd} className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex flex-col gap-4 w-full xl:w-auto xl:flex-1">
                        <input
                            type="text" required placeholder="Movie Title"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 outline-none focus:border-pink-500"
                            value={title} onChange={(e) => setTitle(e.target.value)}
                        />
                        <div className="flex gap-4">
                            <input
                                type="number" placeholder="Year"
                                className="w-1/2 bg-slate-900/50 border border-slate-700 rounded-lg p-3 outline-none focus:border-pink-500"
                                value={year} onChange={(e) => setYear(e.target.value)}
                            />
                            <select
                                value={rating || ''}
                                onChange={(e) => setRating(e.target.value ? parseInt(e.target.value) : null)}
                                className="w-1/2 bg-slate-900/50 border border-slate-700 rounded-lg p-3 outline-none focus:border-pink-500 text-slate-300"
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
                            placeholder="Add notes about this movie..."
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 outline-none focus:border-pink-500 resize-none h-20"
                            value={notes} onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                    <div className="w-full xl:w-auto relative flex flex-col gap-2 shrink-0">
                        <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Upload Poster</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full xl:w-48 bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500/20 file:text-pink-400 hover:file:bg-pink-500/30"
                        />
                    </div>
                    {posterUrl && <img src={posterUrl} alt="preview" className="h-24 w-16 object-cover rounded shadow-md shrink-0" />}
                    <button type="submit" className="w-full xl:w-auto shrink-0 bg-gradient-to-r from-pink-600 to-purple-600 px-8 py-3 rounded-lg font-bold shadow-lg shadow-pink-500/20 hover:scale-105 transition-transform">
                        Save
                    </button>
                </form>
            )}

            <KanbanBoard />
        </div>
    );
};

export default Dashboard;
