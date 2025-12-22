import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Generate user initials from name
    const getInitials = (name) => {
        if (!name) return '??';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Map role codes to display names
    const getRoleName = (role) => {
        return role === 'MP' ? 'Membru Proiect' : 'Tester';
    };

    return (
        <div className="font-display bg-background-light dark:bg-background-dark">
            <div className="min-h-screen flex flex-col p-6">
                <header className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">BugCracker</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                        Logout
                    </button>
                </header>
                <main className="flex-grow">
                    {/* User Info Card */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mr-4">
                                <span className="text-3xl font-bold text-gray-700">{getInitials(user?.name)}</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bine ai venit, {user?.name}!</h2>
                                <p className="text-gray-500 dark:text-gray-400">{getRoleName(user?.role)}</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-gray-600 dark:text-gray-300">
                            <div className="flex items-center">
                                <span className="material-symbols-outlined mr-3 text-lg text-gray-400">email</span>
                                <span>{user?.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Acțiuni Rapide</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* View Bugs - For both MP and TST */}
                            <Link
                                to="/bugs"
                                className="flex items-center p-4 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors duration-200"
                            >
                                <span className="material-symbols-outlined text-blue-500 text-3xl mr-4">bug_report</span>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">Vezi Bug-uri</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Lista completă de bug-uri</p>
                                </div>
                            </Link>

                            {/* View Projects - For both MP and TST */}
                            <Link
                                to="/projects"
                                className="flex items-center p-4 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-colors duration-200"
                            >
                                <span className="material-symbols-outlined text-purple-500 text-3xl mr-4">folder</span>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">Proiecte</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Gestionează proiectele</p>
                                </div>
                            </Link>

                            {/* Report Bug - Only for TST */}
                            {user?.role === 'TST' && (
                                <Link
                                    to="/report-bug"
                                    className="flex items-center p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors duration-200"
                                >
                                    <span className="material-symbols-outlined text-primary text-3xl mr-4">add_circle</span>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">Raportează Bug</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Creează un nou raport</p>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
