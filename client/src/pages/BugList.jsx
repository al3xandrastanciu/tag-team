import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const BugList = () => {
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState('');
    const [showResolveModal, setShowResolveModal] = useState(false);
    const [selectedBugId, setSelectedBugId] = useState(null);
    const [resolveCommitUrl, setResolveCommitUrl] = useState('');
    const { user } = useContext(AuthContext);

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

    useEffect(() => {
        fetchBugs();
    }, []);

    const handleAssign = async (bugId) => {
        setActionError('');
        try {
            await api.patch(`/bugs/${bugId}/assign`);
            fetchBugs();
        } catch (err) {
            setActionError(err.response?.data?.message || 'Eroare la alocare');
        }
    };

    const openResolveModal = (bugId) => {
        setSelectedBugId(bugId);
        setResolveCommitUrl('');
        setShowResolveModal(true);
    };

    const handleResolve = async () => {
        if (!selectedBugId) return;
        setActionError('');
        try {
            await api.patch(`/bugs/${selectedBugId}/resolve`, {
                resolveCommitUrl: resolveCommitUrl || undefined
            });
            setShowResolveModal(false);
            setSelectedBugId(null);
            setResolveCommitUrl('');
            fetchBugs();
        } catch (err) {
            setActionError(err.response?.data?.message || 'Eroare la rezolvare');
        }
    };

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

    const canAssign = (bug) => {
        return user?.role === 'MP' && !bug.assignedTo && bug.status !== 'Resolved';
    };

    const canResolve = (bug) => {
        return user?.role === 'MP' &&
            bug.assignedTo?._id === user?.id &&
            bug.status !== 'Resolved';
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
            <div className="flex flex-col min-h-screen p-4 sm:p-6">
                {/* Header - Responsive */}
                <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">BugCracker</h1>
                    <Link
                        to="/dashboard"
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 text-center sm:w-auto"
                    >
                        Înapoi
                    </Link>
                </header>

                <main className="flex-grow">
                    {/* Title Section - Responsive */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Lista Bug-uri</h2>
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                                {user?.role === 'TST' ? 'Bug-urile raportate de tine' : 'Bug-uri din proiectele tale'}
                            </p>
                        </div>
                        {user?.role === 'TST' && (
                            <Link
                                to="/report-bug"
                                className="px-4 py-2 bg-primary text-gray-900 font-bold rounded-lg hover:opacity-90 transition-opacity text-center"
                            >
                                + Raportează Bug
                            </Link>
                        )}
                    </div>

                    {/* Errors */}
                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6 text-sm sm:text-base">
                            {error}
                        </div>
                    )}

                    {actionError && (
                        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6 flex items-center text-sm sm:text-base">
                            <span className="material-symbols-outlined mr-2 text-lg">error</span>
                            <span className="flex-1">{actionError}</span>
                            <button
                                onClick={() => setActionError('')}
                                className="ml-2 text-red-700 dark:text-red-400 hover:opacity-70 p-1"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    )}

                    {bugs.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md text-center">
                            <span className="material-symbols-outlined text-5xl sm:text-6xl text-gray-400 mb-4">bug_report</span>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Niciun bug găsit</h3>
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                                {user?.role === 'TST' ? 'Nu ai raportat încă niciun bug.' : 'Nu există bug-uri în proiectele tale.'}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Titlu</th>
                                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Proiect</th>
                                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Severitate</th>
                                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Prioritate</th>
                                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Alocat</th>
                                                {user?.role === 'MP' && (
                                                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acțiuni</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                            {bugs.map((bug) => (
                                                <tr key={bug._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <td className="px-4 lg:px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{bug.title}</div>
                                                        {bug.description && (
                                                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{bug.description}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-4 lg:px-6 py-4">
                                                        <div className="text-sm text-gray-900 dark:text-white">{bug.project?.name || 'N/A'}</div>
                                                    </td>
                                                    <td className="px-4 lg:px-6 py-4">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(bug.severity)}`}>
                                                            {bug.severity}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 lg:px-6 py-4">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(bug.priority)}`}>
                                                            {bug.priority}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 lg:px-6 py-4">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bug.status)}`}>
                                                            {bug.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 lg:px-6 py-4">
                                                        <div className="text-sm text-gray-900 dark:text-white">
                                                            {bug.assignedTo?.name || '-'}
                                                        </div>
                                                    </td>
                                                    {user?.role === 'MP' && (
                                                        <td className="px-4 lg:px-6 py-4">
                                                            <div className="flex gap-2">
                                                                {canAssign(bug) && (
                                                                    <button
                                                                        onClick={() => handleAssign(bug._id)}
                                                                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors"
                                                                    >
                                                                        Alocă-ți
                                                                    </button>
                                                                )}
                                                                {canResolve(bug) && (
                                                                    <button
                                                                        onClick={() => openResolveModal(bug._id)}
                                                                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg transition-colors"
                                                                    >
                                                                        Rezolvă
                                                                    </button>
                                                                )}
                                                                {bug.status === 'Resolved' && (
                                                                    <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                                                                        <span className="material-symbols-outlined text-sm mr-1">check_circle</span>
                                                                        Rezolvat
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-4">
                                {bugs.map((bug) => (
                                    <div key={bug._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-base font-bold text-gray-900 dark:text-white flex-1 pr-2">{bug.title}</h3>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full shrink-0 ${getStatusColor(bug.status)}`}>
                                                {bug.status}
                                            </span>
                                        </div>

                                        {bug.description && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{bug.description}</p>
                                        )}

                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(bug.severity)}`}>
                                                {bug.severity}
                                            </span>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(bug.priority)}`}>
                                                {bug.priority}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            <div className="flex items-center">
                                                <span className="material-symbols-outlined text-sm mr-2">folder</span>
                                                <span>{bug.project?.name || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="material-symbols-outlined text-sm mr-2">person</span>
                                                <span>Alocat: {bug.assignedTo?.name || 'Nealocat'}</span>
                                            </div>
                                        </div>

                                        {user?.role === 'MP' && (
                                            <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                {canAssign(bug) && (
                                                    <button
                                                        onClick={() => handleAssign(bug._id)}
                                                        className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                                                    >
                                                        Alocă-ți
                                                    </button>
                                                )}
                                                {canResolve(bug) && (
                                                    <button
                                                        onClick={() => openResolveModal(bug._id)}
                                                        className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                                                    >
                                                        Rezolvă
                                                    </button>
                                                )}
                                                {bug.status === 'Resolved' && (
                                                    <div className="flex-1 flex items-center justify-center text-sm text-green-600 dark:text-green-400">
                                                        <span className="material-symbols-outlined text-sm mr-1">check_circle</span>
                                                        Rezolvat
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </main>
            </div>

            {/* Resolve Modal - Responsive */}
            {showResolveModal && (
                <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-lg shadow-xl p-6 w-full sm:max-w-md safe-bottom">
                        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4 sm:hidden"></div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Marchează ca Rezolvat
                        </h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Link Commit Rezolvare (opțional)
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">link</span>
                                <input
                                    type="url"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary text-gray-900 dark:text-white text-base"
                                    placeholder="https://github.com/.../commit/..."
                                    value={resolveCommitUrl}
                                    onChange={(e) => setResolveCommitUrl(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col-reverse sm:flex-row gap-3">
                            <button
                                onClick={() => {
                                    setShowResolveModal(false);
                                    setSelectedBugId(null);
                                }}
                                className="flex-1 px-4 py-3 sm:py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
                            >
                                Anulează
                            </button>
                            <button
                                onClick={handleResolve}
                                className="flex-1 px-4 py-3 sm:py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                            >
                                Confirmă
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BugList;
