import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { logout } from '../store/authSlice';
import { updateUserProfile } from '../store/userSlice';
import { User, Mail, Calendar, LogOut, Shield, Star, Edit, Save, X, Flame } from 'lucide-react';

export const ProfilePage = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.auth);
    const { habits } = useSelector((state) => state.habits);
    const { users } = useSelector((state) => state.users);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newDisplayName, setNewDisplayName] = useState('');

    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(logout());
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleEditName = () => {
        const currentUserData = users[currentUser?.uid];
        setNewDisplayName(currentUserData?.displayName || currentUser?.displayName || '');
        setIsEditingName(true);
    };

    const handleSaveName = async () => {
        if (newDisplayName.trim() && currentUser) {
            try {
                await dispatch(updateUserProfile({
                    userId: currentUser.uid,
                    displayName: newDisplayName.trim()
                })).unwrap();
                setIsEditingName(false);
            } catch (error) {
                console.error('Error updating name:', error);
            }
        }
    };

    const handleCancelEdit = () => {
        setIsEditingName(false);
        setNewDisplayName('');
    };

    const totalHabits = habits.length;
    const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.currentStreak || 0)) : 0;
    const habitWithLongestStreak = habits.find(h => (h.currentStreak || 0) === longestStreak);
    const totalStreaks = habits.reduce((sum, h) => sum + (h.currentStreak || 0), 0);
    const averageStreak = totalHabits ? (totalStreaks / totalHabits) : 0;
    const topHabits = [...habits].sort((a, b) => (b.currentStreak || 0) - (a.currentStreak || 0)).slice(0, 3);

    // Level system
    const getUserLevel = () => {
        if (longestStreak >= 15) return { level: 'Advanced', color: 'bg-purple-700 text-purple-200 border-purple-400' };
        if (longestStreak >= 4) return { level: 'Intermediate', color: 'bg-blue-700 text-blue-200 border-blue-400' };
        return { level: 'Beginner', color: 'bg-green-700 text-green-200 border-green-400' };
    };
    const level = getUserLevel();

    // Next level info
    const getNextLevelInfo = () => {
        if (longestStreak < 4) return `Next: Intermediate (${4 - longestStreak} more days)`;
        if (longestStreak < 15) return `Next: Advanced (${15 - longestStreak} more days)`;
        return 'Max level reached!';
    };

    // User join date
    const formatDate = (dateString) => {
        if (!dateString) return "Unknown";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };
    const joinedDate = currentUser?.metadata?.creationTime
        ? formatDate(currentUser.metadata.creationTime)
        : "Unknown";

    return (
        <div className="pb-20 md:pb-0 md:pt-20 animate-fadeIn">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-700">
                <div className="flex flex-col items-center mb-8">
                    <div className={`bg-gradient-to-tr from-green-600 to-emerald-400 rounded-full p-5 mb-4 shadow-lg transform hover:scale-105 transition-all duration-300 ring-4 ring-gray-700`}>
                        <User className="w-14 h-14 text-white" />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                        {isEditingName ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={newDisplayName}
                                    onChange={(e) => setNewDisplayName(e.target.value)}
                                    className="text-2xl font-bold text-white bg-gray-700 border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    autoFocus
                                />
                                <button
                                    onClick={handleSaveName}
                                    className="text-green-400 hover:text-green-300 transition-colors"
                                    title="Save name"
                                >
                                    <Save className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                    title="Cancel"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold text-white">
                                    {users[currentUser?.uid]?.displayName || currentUser?.displayName || 'User'}
                                </h2>
                                <button
                                    onClick={handleEditName}
                                    className="text-gray-400 hover:text-white transition-colors"
                                    title="Edit name"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                    <div
                        className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium mb-3 ${level.color} cursor-help`}
                        title={getNextLevelInfo()}
                    >
                        <Shield className={`w-4 h-4 mr-1`} />
                        {level.level}
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
                            {totalHabits}
                        </div>
                        <div className="text-gray-300 mt-1 font-medium">Active Habits</div>
                    </div>
                    <div className="bg-gray-700/80 p-5 rounded-xl shadow-md transform hover:scale-102 transition-all duration-300 backdrop-blur-sm border border-gray-600">
                        <div className="text-3xl font-bold text-green-400">
                            {totalStreaks}
                        </div>
                        <div className="text-gray-300 mt-1 font-medium">Total Streaks</div>
                    </div>
                    <div className="bg-gray-700/80 p-5 rounded-xl shadow-md transform hover:scale-102 transition-all duration-300 backdrop-blur-sm border border-gray-600">
                        <div className="flex items-center">
                            <div className="text-3xl font-bold text-green-400">
                                {longestStreak}
                            </div>
                            {longestStreak > 0 && (
                                <Star className="w-5 h-5 ml-1 text-yellow-400 animate-pulse" />
                            )}
                        </div>
                        <div className="text-gray-300 mt-1 font-medium">Longest Streak</div>
                    </div>
                </div>

                {/* User's Habit Streak Leaderboard */}
                <div className="bg-gray-700/80 backdrop-blur-sm rounded-xl shadow-lg p-5 mb-6 border border-gray-600">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <Flame className="w-5 h-5 mr-2 text-orange-400" />
                        Your Top Habits
                    </h3>
                    {topHabits.length > 0 ? (
                        <div className="space-y-3">
                            {topHabits.map((habit, index) => (
                                <div key={habit.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/60 border border-gray-700">
                                    <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                                            ${index === 0 ? 'bg-gradient-to-r from-yellow-500 to-yellow-300' :
                                                index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-300' :
                                                    'bg-gradient-to-r from-orange-700 to-orange-500'}`}>
                                            <span className="text-white font-bold">{index + 1}</span>
                                        </div>
                                        <span className="text-white font-medium">{habit.name}</span>
                                    </div>
                                    <div className="flex items-center text-orange-400 bg-gray-700 px-2 py-1 rounded-full">
                                        <span className="font-bold mr-1">{habit.currentStreak}</span>
                                        <Flame className="w-4 h-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-300">No active habit streaks yet.</p>
                    )}
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