import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen w-screen flex items-center justify-center text-white text-2xl">Loading...</div>;

  return (
    <BrowserRouter>
      <Navbar />
      <main className="container mx-auto p-4 md:p-8">
        <Routes>
          {/* Guest users see Home at /, logged in users are redirected to /dashboard */}
          <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
