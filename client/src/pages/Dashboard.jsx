import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mr-4">
                                <span className="text-3xl font-bold text-gray-700">{getInitials(user?.name)}</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bine ai venit, {user?.name}!</h2>
                            </div>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-300">
                            <div className="flex items-center">
                                <span className="material-icons-outlined mr-3 text-lg text-gray-400 dark:text-gray-500">email</span>
                                <span>{user?.email}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="material-icons-outlined mr-3 text-lg text-gray-400 dark:text-gray-500">badge</span>
                                <span>{getRoleName(user?.role)}</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
