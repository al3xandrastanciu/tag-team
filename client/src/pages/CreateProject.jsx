import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const CreateProject = () => {
    const [name, setName] = useState('');
    const [repoUrl, setRepoUrl] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await api.post('/projects', {
                name,
                repoUrl,
                description
            });

            setSuccess('Proiect creat cu succes!');
            setName('');
            setRepoUrl('');
            setDescription('');

            setTimeout(() => {
                navigate('/projects');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Eroare la crearea proiectului');
        } finally {
            setLoading(false);
        }
    };

    if (user?.role !== 'MP') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 sm:p-6">
                <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md text-center max-w-md w-full">
                    <span className="material-symbols-outlined text-5xl sm:text-6xl text-red-500 mb-4">block</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">Acces Restricționat</h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                        Doar utilizatorii cu rol de <strong>Membru Proiect (MP)</strong> pot crea proiecte.
                    </p>
                    <Link
                        to="/dashboard"
                        className="inline-block bg-primary text-gray-900 font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Înapoi la Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display min-h-screen">
            <div className="flex flex-col min-h-screen p-4 sm:p-6">
                <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">BugCracker</h1>
                    <Link
                        to="/dashboard"
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 text-center"
                    >
                        Înapoi
                    </Link>
                </header>

                <main className="flex-grow">
                    <div className="w-full max-w-2xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900 dark:text-white">Creează Proiect</h2>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-8">Înregistrează un nou proiect software pentru monitorizare.</p>

                        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="name">
                                    Nume Proiect *
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">folder</span>
                                    <input
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary text-gray-900 dark:text-white placeholder-gray-500 text-base"
                                        id="name"
                                        type="text"
                                        placeholder="ex: BugCracker App"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="repoUrl">
                                    Repository URL *
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">link</span>
                                    <input
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary text-gray-900 dark:text-white placeholder-gray-500 text-base"
                                        id="repoUrl"
                                        type="url"
                                        placeholder="https://github.com/user/repository"
                                        value={repoUrl}
                                        onChange={(e) => setRepoUrl(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="description">
                                    Descriere
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary text-gray-900 dark:text-white placeholder-gray-500 min-h-[100px] sm:min-h-[120px] text-base resize-y"
                                    id="description"
                                    placeholder="Descrie proiectul pe scurt..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            {error && (
                                <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 sm:p-4 rounded-lg flex items-center text-sm sm:text-base">
                                    <span className="material-symbols-outlined mr-2 text-lg">error</span>
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-3 sm:p-4 rounded-lg flex items-center text-sm sm:text-base">
                                    <span className="material-symbols-outlined mr-2 text-lg">check_circle</span>
                                    {success}
                                </div>
                            )}

                            <div className="pt-2 sm:pt-4">
                                <button
                                    className="w-full bg-primary text-gray-900 font-bold py-3 sm:py-4 px-4 rounded-lg shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Se creează...' : 'Creează Proiect'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CreateProject;
