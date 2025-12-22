import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const BugList = () => {
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchBugs = async () => {
            try {
                const response = await api.get('/bugs');
                setBugs(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Eroare la încărcarea bug-urilor');
            } finally {
                setLoading(false);
            }
        };
        fetchBugs();
    }, []);

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'Critical': return 'bg-red-500 text-white';
            case 'High': return 'bg-orange-500 text-white';
            case 'Medium': return 'bg-yellow-500 text-gray-900';
            case 'Low': return 'bg-green-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'In Progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'Resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="text-gray-600 dark:text-gray-400">Se încarcă...</div>
            </div>
        );
    }

    return (
        <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
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
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lista Bug-uri</h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                {user?.role === 'TST' ? 'Bug-urile raportate de tine' : 'Bug-uri din proiectele tale'}
                            </p>
                        </div>
                        {user?.role === 'TST' && (
                            <Link
                                to="/report-bug"
                                className="px-4 py-2 bg-primary text-gray-900 font-bold rounded-lg hover:opacity-90 transition-opacity"
                            >
                                + Raportează Bug
                            </Link>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {bugs.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
                            <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">bug_report</span>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Niciun bug găsit</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {user?.role === 'TST' ? 'Nu ai raportat încă niciun bug.' : 'Nu există bug-uri în proiectele tale.'}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Titlu</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Proiect</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Severitate</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Prioritate</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Raportat de</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                        {bugs.map((bug) => (
                                            <tr key={bug._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{bug.title}</div>
                                                    {bug.description && (
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{bug.description}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 dark:text-white">{bug.project?.name || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(bug.severity)}`}>
                                                        {bug.severity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(bug.priority)}`}>
                                                        {bug.priority}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bug.status)}`}>
                                                        {bug.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 dark:text-white">{bug.reportedBy?.name || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(bug.createdAt).toLocaleDateString('ro-RO')}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default BugList;
