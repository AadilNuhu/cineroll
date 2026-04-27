import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { FiFilm, FiLogOut, FiUser, FiWifiOff, FiWifi } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                <FiFilm className="text-pink-500" />
                CineRoll
            </Link>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm">
                    {isOnline ? (
                        <span className="flex items-center gap-1 text-green-400" title="Online & Syncing">
                            <FiWifi /> <span className="hidden md:inline">Online</span>
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-yellow-400" title="Offline - Changes saved locally">
                            <FiWifiOff /> <span className="hidden md:inline">Offline</span>
                        </span>
                    )}
                </div>

                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-2 text-slate-300">
                            <FiUser /> {user.name}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-300"
                            title="Logout"
                        >
                            <FiLogOut />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-400">Guest Mode</span>
                        <Link to="/login" className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all font-medium">
                            Login
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
