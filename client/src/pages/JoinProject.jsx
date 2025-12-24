import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const JoinProject = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [joiningId, setJoiningId] = useState(null);
    const { user } = useContext(AuthContext);

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects/joinable');
            setProjects(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Eroare la încărcarea proiectelor');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleJoin = async (projectId, projectName) => {
        setError('');
        setSuccess('');
        setJoiningId(projectId);

        try {
            await api.patch(`/projects/${projectId}/join`);
            setSuccess(`Te-ai alăturat proiectului "${projectName}" ca tester!`);
            fetchProjects();
        } catch (err) {
            setError(err.response?.data?.message || 'Eroare la alăturare');
        } finally {
            setJoiningId(null);
        }
    };

    if (user?.role !== 'TST') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 sm:p-6">
                <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md text-center max-w-md w-full">
                    <span className="material-symbols-outlined text-5xl sm:text-6xl text-red-500 mb-4">block</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">Acces Restricționat</h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                        Doar utilizatorii cu rol de <strong>Tester (TST)</strong> pot accesa această pagină.
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="text-gray-600 dark:text-gray-400">Se încarcă...</div>
            </div>
        );
    }

    return (
        <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
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
                    <div className="mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Alătură-te unui Proiect</h2>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Selectează un proiect pentru a te alătura ca tester</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6 flex items-center text-sm sm:text-base">
                            <span className="material-symbols-outlined mr-2 text-lg">error</span>
                            <span className="flex-1">{error}</span>
                            <button onClick={() => setError('')} className="ml-2 hover:opacity-70">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-lg mb-6 flex items-center text-sm sm:text-base">
                            <span className="material-symbols-outlined mr-2 text-lg">check_circle</span>
                            <span className="flex-1">{success}</span>
                            <button onClick={() => setSuccess('')} className="ml-2 hover:opacity-70">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    )}

                    {projects.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md text-center">
                            <span className="material-symbols-outlined text-5xl sm:text-6xl text-gray-400 mb-4">check_circle</span>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Niciun proiect disponibil</h3>
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Ești deja tester în toate proiectele existente.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {projects.map((project) => (
                                <div key={project._id} className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3 sm:mb-4">
                                        <span className="material-symbols-outlined text-purple-500 text-xl sm:text-2xl">folder</span>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">{project.name}</h3>
                                    {project.description && (
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{project.description}</p>
                                    )}
                                    <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3">
                                        <span className="material-symbols-outlined text-sm mr-1">link</span>
                                        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary truncate">
                                            {project.repoUrl}
                                        </a>
                                    </div>
                                    <div className="flex items-center justify-between text-xs sm:text-sm mb-4">
                                        <span className="text-gray-500 dark:text-gray-400">{project.members?.length || 0} membri</span>
                                        <span className="text-gray-500 dark:text-gray-400">{project.testers?.length || 0} testeri</span>
                                    </div>
                                    <button
                                        onClick={() => handleJoin(project._id, project.name)}
                                        disabled={joiningId === project._id}
                                        className="w-full py-2 sm:py-3 bg-primary text-gray-900 font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                                    >
                                        {joiningId === project._id ? 'Se procesează...' : 'Alătură-te ca Tester'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default JoinProject;
