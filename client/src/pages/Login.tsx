import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/users/login', { email, password });
            login(res.data.data.user, res.data.data.token);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 glass-panel rounded-2xl">
            <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">Welcome Back</h2>
            {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 outline-none focus:border-pink-500 transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 outline-none focus:border-pink-500 transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="p-3 mt-2 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 transition-all font-bold shadow-lg shadow-pink-500/30">
                    Login
                </button>
            </form>
            <p className="mt-6 text-center text-slate-400">
                Don't have an account? <Link to="/register" className="text-pink-400 hover:underline">Register</Link>
            </p>
            <p className="mt-4 text-center text-sm text-slate-500">
                You can also continue in <Link to="/" className="text-purple-400 hover:underline">Guest Mode</Link>
            </p>
        </div>
    );
};

export default Login;
