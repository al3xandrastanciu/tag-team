import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const ReportBug = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [severity, setSeverity] = useState('Medium');
    const [priority, setPriority] = useState('Medium');
    const [commitUrl, setCommitUrl] = useState('');
    const [projectId, setProjectId] = useState('');
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Fetch available projects on mount
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/projects/available');
                setProjects(response.data);
                if (response.data.length > 0) {
                    setProjectId(response.data[0]._id);
                }
            } catch (err) {
                console.error('Error fetching projects:', err);
            }
        };
        fetchProjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const bugData = {
                title,
                description,
                severity,
                priority,
                project: projectId
            };

            if (commitUrl.trim()) {
                bugData.commitUrl = commitUrl;
            }

            await api.post('/bugs', bugData);
            setSuccess('Bug raportat cu succes!');

            // Reset form
            setTitle('');
            setDescription('');
            setSeverity('Medium');
            setPriority('Medium');
            setCommitUrl('');

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Eroare la raportarea bug-ului');
        } finally {
            setLoading(false);
        }
    };

    // Check if user is TST
    if (user?.role !== 'TST') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-6">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center max-w-md">
                    <span className="material-symbols-outlined text-6xl text-red-500 mb-4">block</span>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Acces Restricționat</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Doar utilizatorii cu rol de <strong>Tester (TST)</strong> pot raporta bug-uri.
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
            <div className="flex flex-col min-h-screen p-6">
                <header className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">BugCracker</h1>
                    <Link
                        to="/dashboard"
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                        Înapoi
                    </Link>
                </header>

                <main className="flex-grow">
                    <div className="w-full max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Raportează Bug</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">Completează formularul pentru a raporta un bug nou.</p>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Titlu */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="title">
                                    Titlu *
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">bug_report</span>
                                    <input
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary text-gray-900 dark:text-white placeholder-gray-500"
                                        id="title"
                                        type="text"
                                        placeholder="ex: Butonul de submit nu funcționează"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Descriere */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="description">
                                    Descriere
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary text-gray-900 dark:text-white placeholder-gray-500 min-h-[120px]"
                                    id="description"
                                    placeholder="Descrie bug-ul în detaliu..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            {/* Proiect */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="project">
                                    Proiect *
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">folder</span>
                                    <select
                                        className="w-full pl-10 pr-10 py-3 appearance-none rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                                        id="project"
                                        value={projectId}
                                        onChange={(e) => setProjectId(e.target.value)}
                                        required
                                    >
                                        {projects.length === 0 ? (
                                            <option value="">Nu există proiecte disponibile</option>
                                        ) : (
                                            projects.map((project) => (
                                                <option key={project._id} value={project._id}>
                                                    {project.name}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
                                </div>
                            </div>

                            {/* Severity & Priority Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Severity */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="severity">
                                        Severitate *
                                    </label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">warning</span>
                                        <select
                                            className="w-full pl-10 pr-10 py-3 appearance-none rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                                            id="severity"
                                            value={severity}
                                            onChange={(e) => setSeverity(e.target.value)}
                                            required
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                            <option value="Critical">Critical</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
                                    </div>
                                </div>

                                {/* Priority */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="priority">
                                        Prioritate *
                                    </label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">flag</span>
                                        <select
                                            className="w-full pl-10 pr-10 py-3 appearance-none rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                                            id="priority"
                                            value={priority}
                                            onChange={(e) => setPriority(e.target.value)}
                                            required
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            {/* Commit URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="commitUrl">
                                    Link Commit (opțional)
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">link</span>
                                    <input
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary text-gray-900 dark:text-white placeholder-gray-500"
                                        id="commitUrl"
                                        type="url"
                                        placeholder="https://github.com/user/repo/commit/..."
                                        value={commitUrl}
                                        onChange={(e) => setCommitUrl(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Error/Success Messages */}
                            {error && (
                                <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg flex items-center">
                                    <span className="material-symbols-outlined mr-2">error</span>
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-lg flex items-center">
                                    <span className="material-symbols-outlined mr-2">check_circle</span>
                                    {success}
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    className="w-full bg-primary text-gray-900 font-bold py-4 px-4 rounded-lg shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    type="submit"
                                    disabled={loading || projects.length === 0}
                                >
                                    {loading ? 'Se trimite...' : 'Raportează Bug'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ReportBug;
