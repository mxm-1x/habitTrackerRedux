import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { logout } from '../store/authSlice';
import { User, Mail, Calendar, LogOut, Shield, Star } from 'lucide-react';

export const ProfilePage = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.auth);
    const { habits } = useSelector((state) => state.habits);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(logout());
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const calculateTotalActiveHabits = () => {
        return habits.length;
    };

    const calculateTotalCompletedToday = () => {
        const today = new Date().toISOString().split('T')[0];
        return habits.filter(habit => habit.completedDates.includes(today)).length;
    };

    const calculateLongestStreak = () => {
        if (habits.length === 0) return 0;
        return Math.max(...habits.map(habit => habit.bestStreak));
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Unknown";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    // Calculate when the user joined from the user's metadata
    const joinedDate = currentUser?.metadata?.creationTime
        ? formatDate(currentUser.metadata.creationTime)
        : "Unknown";

    // Determine user level based on longest streak
    const getUserLevel = () => {
        const streak = calculateLongestStreak();
        if (streak >= 30) return 'Master';
        if (streak >= 14) return 'Expert';
        if (streak >= 7) return 'Intermediate';
        return 'Beginner';
    };

    const level = getUserLevel();
    const levelColor = {
        'Beginner': 'blue-400',
        'Intermediate': 'yellow-400',
        'Expert': 'purple-400',
        'Master': 'pink-400'
    }[level];

    return (
        <div className="pb-20 md:pb-0 md:pt-20 animate-fadeIn">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-700">
                <div className="flex flex-col items-center mb-8">
                    <div className={`bg-gradient-to-tr from-green-600 to-emerald-400 rounded-full p-5 mb-4 shadow-lg transform hover:scale-105 transition-all duration-300 ring-4 ring-gray-700`}>
                        <User className="w-14 h-14 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                        {currentUser?.displayName || 'User'}
                    </h2>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gray-700 text-${levelColor} text-sm font-medium mb-3`}>
                        <Shield className={`w-4 h-4 mr-1 text-${levelColor}`} />
                        {level}
                    </div>
                    <div className="flex items-center mt-1 text-gray-300">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>{currentUser?.email}</span>
                    </div>
                    <div className="flex items-center mt-1 text-gray-300">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Joined {joinedDate}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-700/80 p-5 rounded-xl shadow-md transform hover:scale-102 transition-all duration-300 backdrop-blur-sm border border-gray-600">
                        <div className="text-3xl font-bold text-green-400">
                            {calculateTotalActiveHabits()}
                        </div>
                        <div className="text-gray-300 mt-1 font-medium">Active Habits</div>
                    </div>
                    <div className="bg-gray-700/80 p-5 rounded-xl shadow-md transform hover:scale-102 transition-all duration-300 backdrop-blur-sm border border-gray-600">
                        <div className="text-3xl font-bold text-green-400">
                            {calculateTotalCompletedToday()}
                        </div>
                        <div className="text-gray-300 mt-1 font-medium">Completed Today</div>
                    </div>
                    <div className="bg-gray-700/80 p-5 rounded-xl shadow-md transform hover:scale-102 transition-all duration-300 backdrop-blur-sm border border-gray-600">
                        <div className="flex items-center">
                            <div className="text-3xl font-bold text-green-400">
                                {calculateLongestStreak()}
                            </div>
                            {calculateLongestStreak() > 0 && (
                                <Star className="w-5 h-5 ml-1 text-yellow-400 animate-pulse" />
                            )}
                        </div>
                        <div className="text-gray-300 mt-1 font-medium">Longest Streak</div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                .scale-102 {
                    --tw-scale-x: 1.02;
                    --tw-scale-y: 1.02;
                }
            `}</style>
        </div>
    );
}; 