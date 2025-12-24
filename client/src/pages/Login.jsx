import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Eroare la autentificare');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen items-center justify-center p-4 sm:p-6 bg-background-light dark:bg-background-dark font-display">
            <main className="w-full max-w-md">
                {/* Logo/Brand - Responsive */}
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">BugCracker</h1>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2">Track bugs with ease.</p>
                </div>

                {/* Login Header */}
                <div className="text-left mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Login</h2>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">Welcome back! Please enter your details.</p>
                </div>

                {/* Form */}
                <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Email</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xl">
                                mail
                            </span>
                            <input
                                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 text-base"
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

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">Password</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xl">
                                lock
                            </span>
                            <input
                                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 text-base"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm flex items-center">
                            <span className="material-symbols-outlined mr-2 text-lg">error</span>
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2 sm:pt-4">
                        <button
                            className="w-full bg-primary text-gray-900 font-bold py-3 sm:py-3 px-4 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Se conectează...' : 'Login'}
                        </button>
                    </div>
                </form>

                {/* Register Link */}
                <div className="text-center mt-6 sm:mt-8">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link className="font-medium text-primary hover:underline" to="/register">Register</Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Login;
