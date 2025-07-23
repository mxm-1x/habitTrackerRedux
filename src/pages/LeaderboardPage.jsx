import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Trophy,
    Crown,
    Medal,
    Star,
    Flame,
    Target,
    TrendingUp,
    Users,
    Award,
    RefreshCw,
    Loader2,
    Info
} from 'lucide-react';
import { fetchLeaderboard, fetchUserRank } from '../store/leaderboardSlice';

export const LeaderboardPage = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.auth);
    const { leaderboard, userRank, loading } = useSelector((state) => state.leaderboard);
    const { users } = useSelector((state) => state.users);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (currentUser) {
            dispatch(fetchLeaderboard());
            dispatch(fetchUserRank(currentUser.uid));
        }
    }, [dispatch, currentUser]);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                dispatch(fetchLeaderboard()).unwrap(),
                dispatch(fetchUserRank(currentUser.uid)).unwrap()
            ]);
        } catch (error) {
            console.error('Error refreshing leaderboard:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return <Crown className="w-6 h-6 text-yellow-400" />;
            case 2:
                return <Medal className="w-6 h-6 text-gray-400" />;
            case 3:
                return <Medal className="w-6 h-6 text-orange-600" />;
            default:
                return <Star className="w-5 h-5 text-gray-500" />;
        }
    };

    const getRankColor = (rank) => {
        switch (rank) {
            case 1:
                return 'bg-gradient-to-r from-yellow-500 to-yellow-300';
            case 2:
                return 'bg-gradient-to-r from-gray-400 to-gray-300';
            case 3:
                return 'bg-gradient-to-r from-orange-700 to-orange-500';
            default:
                return 'bg-gradient-to-r from-gray-600 to-gray-500';
        }
    };

    const getUserLevel = (streak) => {
        if (streak >= 15) return { level: 'Advanced', color: 'bg-purple-700 text-purple-200 border-purple-400' };
        if (streak >= 4) return { level: 'Intermediate', color: 'bg-blue-700 text-blue-200 border-blue-400' };
        return { level: 'Beginner', color: 'bg-green-700 text-green-200 border-green-400' };
    };

    const formatUserDisplayName = (userId) => {
        // Get user from the users state
        const user = users[userId];
        if (user && user.displayName) {
            return user.displayName;
        }
        // Fallback to shortened user ID if no display name
        return `User ${userId.slice(-6)}`;
    };

    // Add a function to check if users are loaded
    const isUsersLoaded = () => {
        return Object.keys(users).length > 0;
    };

    if (loading && leaderboard.length === 0) {
        return (
            <div className="pb-20 md:pb-0 md:pt-20 animate-fadeIn">
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-700">
                    <div className="flex justify-center items-center p-8">
                        <Loader2 className="w-8 h-8 text-lime-500 animate-spin" />
                        <span className="ml-2 text-gray-300">Loading leaderboard...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-20 md:pb-0 md:pt-20 animate-fadeIn">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-700">
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg shadow-md mb-4">
                        <Trophy className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Leaderboard</h2>
                    <p className="text-gray-300 text-center mb-4">
                        Top performers ranked by their longest habit streaks
                    </p>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50"
                    >
                        {refreshing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <RefreshCw className="w-4 h-4" />
                        )}
                        Refresh
                    </button>
                </div>

                {/* Level Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-700 border border-green-400 inline-block"></span>
                        <span className="text-green-200 text-sm">Beginner (0-3)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-700 border border-blue-400 inline-block"></span>
                        <span className="text-blue-200 text-sm">Intermediate (4-14)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-purple-700 border border-purple-400 inline-block"></span>
                        <span className="text-purple-200 text-sm">Advanced (15+)</span>
                    </div>
                </div>

                {/* User's Current Rank */}
                {userRank && userRank.rank && (
                    <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-500 rounded-full p-2">
                                    <Target className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">Your Ranking</h3>
                                    <p className="text-green-400 text-sm">
                                        #{userRank.rank} out of {leaderboard.length} users
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white">{userRank.longestStreak}</div>
                                <div className="text-green-400 text-sm">days streak</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Leaderboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-700/80 p-4 rounded-xl border border-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="w-5 h-5 text-blue-400" />
                            <span className="text-gray-300 text-sm">Total Participants</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{leaderboard.length}</div>
                    </div>
                    <div className="bg-gray-700/80 p-4 rounded-xl border border-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                            <Flame className="w-5 h-5 text-orange-400" />
                            <span className="text-gray-300 text-sm">Highest Streak</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                            {leaderboard.length > 0 ? leaderboard[0].longestStreak : 0}
                        </div>
                    </div>
                    <div className="bg-gray-700/80 p-4 rounded-xl border border-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            <span className="text-gray-300 text-sm">Average Streak</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                            {leaderboard.length > 0
                                ? Math.round(leaderboard.reduce((sum, user) => sum + user.longestStreak, 0) / leaderboard.length)
                                : 0
                            }
                        </div>
                    </div>
                </div>

                {/* Leaderboard List */}
                <div className="space-y-3">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-yellow-400" />
                        Top Performers
                    </h3>

                    {leaderboard.length > 0 ? (
                        leaderboard.map((user, index) => {
                            const level = getUserLevel(user.longestStreak);
                            return (
                                <div
                                    key={user.userId}
                                    className={`p-4 rounded-xl border transition-all duration-300 hover:scale-102 ${user.userId === currentUser?.uid
                                        ? 'bg-green-600/20 border-green-500/50 ring-2 ring-green-500/30'
                                        : 'bg-gray-700/80 border-gray-600'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankColor(index + 1)}`}>
                                                {getRankIcon(index + 1)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium text-white">
                                                        {user.displayName}
                                                    </h4>
                                                    {user.userId === currentUser?.uid && (
                                                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                                                            You
                                                        </span>
                                                    )}
                                                    {/* Level badge */}
                                                    <span className={`ml-2 px-2 py-1 rounded-full border text-xs font-semibold ${level.color}`}>{level.level}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-gray-400 text-xs">
                                                        {user.totalHabits} habits
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1">
                                                <Flame className="w-5 h-5 text-orange-400" />
                                                <span className="text-2xl font-bold text-white">
                                                    {user.longestStreak}
                                                </span>
                                            </div>
                                            <div className="text-gray-400 text-sm">days</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8">
                            <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400">
                                No leaderboard data available yet.
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                Start building habits to appear on the leaderboard!
                            </p>
                        </div>
                    )}
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