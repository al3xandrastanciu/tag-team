import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/projects');
                setProjects(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Eroare la încărcarea proiectelor');
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

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
                {/* Header - Responsive */}
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
                    {/* Title - Responsive */}
                    <div className="mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Proiectele Mele</h2>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                            {user?.role === 'MP' ? 'Proiecte în care ești membru' : 'Proiecte în care ești tester'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6 text-sm sm:text-base">
                            {error}
                        </div>
                    )}

                    {projects.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md text-center">
                            <span className="material-symbols-outlined text-5xl sm:text-6xl text-gray-400 mb-4">folder_off</span>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Niciun proiect găsit</h3>
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                                Nu faci parte din niciun proiect momentan.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {projects.map((project) => (
                                <div key={project._id} className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">folder</span>
                                        </div>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">{project.name}</h3>
                                    {project.description && (
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2">{project.description}</p>
                                    )}
                                    <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
                                        <span className="material-symbols-outlined text-sm mr-1">link</span>
                                        <a
                                            href={project.repoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-primary truncate"
                                        >
                                            {project.repoUrl}
                                        </a>
                                    </div>
                                    <div className="flex items-center justify-between text-xs sm:text-sm">
                                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                                            <span className="material-symbols-outlined text-sm mr-1">group</span>
                                            <span>{project.members?.length || 0} membri</span>
                                        </div>
                                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                                            <span className="material-symbols-outlined text-sm mr-1">bug_report</span>
                                            <span>{project.testers?.length || 0} testeri</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProjectList;
