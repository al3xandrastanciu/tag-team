import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('MP');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(name, email, password, role);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Eroare la înregistrare');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-white antialiased min-h-screen">
            <div className="flex flex-col min-h-screen">
                <header className="text-center pt-8 sm:pt-16 pb-4 sm:pb-8 px-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">BugCracker</h1>
                </header>

                <main className="flex-grow px-4 sm:px-6 pb-6">
                    <div className="w-full max-w-md mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-900 dark:text-white">Înregistrare</h2>

                        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="name">Nume:</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">person</span>
                                    <input
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary text-gray-900 dark:text-white placeholder-gray-500 text-base"
                                        id="name"
                                        name="name"
                                        placeholder="e.g. Popescu Luca"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        autoComplete="name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Email:</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">mail</span>
                                    <input
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary text-gray-900 dark:text-white placeholder-gray-500 text-base"
                                        id="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">Parolă:</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">lock</span>
                                    <input
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary text-gray-900 dark:text-white placeholder-gray-500 text-base"
                                        id="password"
                                        name="password"
                                        placeholder="••••••••"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="role">Rol:</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">badge</span>
                                    <select
                                        className="w-full pl-10 pr-10 py-3 appearance-none rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary text-gray-900 dark:text-white text-base"
                                        id="role"
                                        name="role"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="MP">Membru Proiect</option>
                                        <option value="TST">Tester</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm flex items-center">
                                    <span className="material-symbols-outlined mr-2 text-lg">error</span>
                                    {error}
                                </div>
                            )}

                            <div className="pt-2 sm:pt-4">
                                <button
                                    className="w-full bg-primary text-black font-bold py-3 sm:py-4 px-4 rounded-lg shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background-light transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Se creează contul...' : 'Înregistrare'}
                                </button>
                            </div>
                        </form>

                        <p className="text-center mt-6 sm:mt-8 text-sm text-gray-600 dark:text-gray-400">
                            Ai deja cont?{' '}
                            <Link className="font-medium text-primary hover:underline" to="/login">Autentifică-te</Link>
                        </p>
                    </div>
                </main>

                <footer className="py-4 sm:py-6">
                    <div className="w-36 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto"></div>
                </footer>
            </div>
        </div>
    );
};

export default Register;
