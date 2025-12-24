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

    const getInitials = (name) => {
        if (!name) return '??';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const getRoleName = (role) => {
        return role === 'MP' ? 'Membru Proiect' : 'Tester';
    };

    return (
        <div className="font-display bg-background-light dark:bg-background-dark">
            <div className="min-h-screen flex flex-col p-4 sm:p-6">
                <header className="mb-6 sm:mb-8 flex justify-between items-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">BugCracker</h1>
                    <button
                        onClick={handleLogout}
                        className="px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base font-medium rounded-lg transition-colors duration-200"
                    >
                        Logout
                    </button>
                </header>

                <main className="flex-grow">
                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md mb-6">
                        <div className="flex items-center mb-4 sm:mb-6">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary flex items-center justify-center mr-3 sm:mr-4 shrink-0">
                                <span className="text-xl sm:text-3xl font-bold text-gray-700">{getInitials(user?.name)}</span>
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                                    Bine ai venit, {user?.name}!
                                </h2>
                                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">{getRoleName(user?.role)}</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-gray-600 dark:text-gray-300">
                            <div className="flex items-center text-sm sm:text-base">
                                <span className="material-symbols-outlined mr-2 sm:mr-3 text-base sm:text-lg text-gray-400">email</span>
                                <span className="truncate">{user?.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">Acțiuni Rapide</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            <Link
                                to="/bugs"
                                className="flex items-center p-3 sm:p-4 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors duration-200 active:scale-[0.98]"
                            >
                                <span className="material-symbols-outlined text-blue-500 text-2xl sm:text-3xl mr-3 sm:mr-4">bug_report</span>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">Vezi Bug-uri</h4>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Lista completă de bug-uri</p>
                                </div>
                            </Link>

                            <Link
                                to="/projects"
                                className="flex items-center p-3 sm:p-4 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-colors duration-200 active:scale-[0.98]"
                            >
                                <span className="material-symbols-outlined text-purple-500 text-2xl sm:text-3xl mr-3 sm:mr-4">folder</span>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">Proiecte</h4>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Gestionează proiectele</p>
                                </div>
                            </Link>

                            {user?.role === 'TST' && (
                                <Link
                                    to="/report-bug"
                                    className="flex items-center p-3 sm:p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors duration-200 active:scale-[0.98]"
                                >
                                    <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl mr-3 sm:mr-4">add_circle</span>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">Raportează Bug</h4>
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Creează un nou raport</p>
                                    </div>
                                </Link>
                            )}

                            {user?.role === 'TST' && (
                                <Link
                                    to="/join-project"
                                    className="flex items-center p-3 sm:p-4 bg-orange-500/10 hover:bg-orange-500/20 rounded-lg transition-colors duration-200 active:scale-[0.98]"
                                >
                                    <span className="material-symbols-outlined text-orange-500 text-2xl sm:text-3xl mr-3 sm:mr-4">group_add</span>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">Alătură-te la Proiect</h4>
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Înscrie-te ca tester</p>
                                    </div>
                                </Link>
                            )}

                            {user?.role === 'MP' && (
                                <Link
                                    to="/create-project"
                                    className="flex items-center p-3 sm:p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors duration-200 active:scale-[0.98]"
                                >
                                    <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl mr-3 sm:mr-4">create_new_folder</span>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">Creează Proiect</h4>
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Înregistrează proiect nou</p>
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
