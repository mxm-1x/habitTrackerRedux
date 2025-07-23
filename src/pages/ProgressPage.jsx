import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { BarChart2, Trophy, Calendar, TrendingUp, Award, Target, Zap, Flame } from 'lucide-react';

export const ProgressPage = () => {
    const { habits } = useSelector((state) => state.habits);
    const today = new Date().toISOString().split('T')[0];

    // Generate statistics for habits
    const stats = useMemo(() => {
        if (!habits || habits.length === 0) return null;

        const totalHabits = habits.length;
        const totalStreaks = habits.reduce((sum, h) => sum + (h.currentStreak || 0), 0);
        const averageStreak = totalHabits ? (totalStreaks / totalHabits) : 0;
        const longestStreak = Math.max(...habits.map(h => h.currentStreak || 0), 0);
        const habitWithLongestStreak = habits.find(h => (h.currentStreak || 0) === longestStreak);
        const topHabits = [...habits]
            .sort((a, b) => (b.currentStreak || 0) - (a.currentStreak || 0))
            .slice(0, 3);
        return {
            totalHabits,
            totalStreaks,
            averageStreak: Math.round(averageStreak * 10) / 10,
            longestStreak,
            habitWithLongestStreak,
            topHabits
        };
    }, [habits]);

    if (!stats) {
        return (
            <div className="pb-20 md:pb-0 md:pt-20">
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-700 text-center">
                    <BarChart2 className="w-14 h-14 text-green-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-4">Progress Tracking</h2>
                    <p className="text-gray-300">
                        Start adding habits to see your progress statistics here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-20 md:pb-0 md:pt-20">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-700">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-500 rounded-lg shadow-md mb-4">
                        <BarChart2 className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Progress Dashboard</h2>
                </div>

                {/* Summary Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-900/80 rounded-lg p-5 border border-gray-700 flex flex-col items-center">
                        <Flame className="w-8 h-8 text-orange-400 mb-2" />
                        <div className="text-2xl font-bold text-white">{stats.totalHabits}</div>
                        <div className="text-gray-400 text-sm">Total Habits</div>
                    </div>
                    <div className="bg-gray-900/80 rounded-lg p-5 border border-gray-700 flex flex-col items-center">
                        <Zap className="w-8 h-8 text-green-400 mb-2" />
                        <div className="text-2xl font-bold text-white">{stats.totalStreaks}</div>
                        <div className="text-gray-400 text-sm">Total Streaks</div>
                    </div>
                    <div className="bg-gray-900/80 rounded-lg p-5 border border-gray-700 flex flex-col items-center">
                        <TrendingUp className="w-8 h-8 text-emerald-400 mb-2" />
                        <div className="text-2xl font-bold text-white">{stats.averageStreak}</div>
                        <div className="text-gray-400 text-sm">Average Streak</div>
                    </div>
                </div>

                {/* Longest Streak */}
                <div className="bg-gray-700/80 backdrop-blur-sm rounded-xl shadow-lg p-5 mb-6 border border-gray-600">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                        Longest Streak
                    </h3>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold text-orange-400">{stats.longestStreak} days</span>
                            {stats.habitWithLongestStreak && (
                                <span className="text-green-400 text-lg font-semibold">{stats.habitWithLongestStreak.name}</span>
                            )}
                        </div>
                        <div className="h-2 w-full bg-gray-700 rounded-full mt-2 md:mt-0 md:w-1/2">
                            <div
                                className="h-2 bg-gradient-to-r from-orange-400 to-yellow-300 rounded-full"
                                style={{ width: `${Math.min(stats.longestStreak * 5, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Top Habits Leaderboard */}
                <div className="bg-gray-700/80 backdrop-blur-sm rounded-xl shadow-lg p-5 mb-6 border border-gray-600">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-green-400" />
                        Streak Leaderboard
                    </h3>
                    {stats.topHabits.length > 0 ? (
                        <div className="space-y-3">
                            {stats.topHabits.map((habit, index) => (
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
            </div>
        </div>
    );
}; 