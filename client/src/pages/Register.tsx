import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router';
import api from '../services/api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/users/register', { name, email, password });
            login(res.data.data.user, res.data.data.token);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 glass-panel rounded-2xl">
            <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">Join CineRoll</h2>
            {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Name"
                    className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 outline-none focus:border-pink-500 transition-colors"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                    Register
                </button>
            </form>
            <p className="mt-6 text-center text-slate-400">
                Already have an account? <Link to="/login" className="text-pink-400 hover:underline">Login</Link>
            </p>
        </div>
    );
};

export default Register;
