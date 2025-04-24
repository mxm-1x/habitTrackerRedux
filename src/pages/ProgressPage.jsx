import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { BarChart2, Trophy, Calendar, TrendingUp, Award, Target, Zap } from 'lucide-react';

export const ProgressPage = () => {
    const { habits } = useSelector((state) => state.habits);

    const today = new Date().toISOString().split('T')[0];

    // Generate weekly stats
    const generateWeeklyStats = (habits) => {
        const days = 7;
        const result = [];

        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
            const completed = habits.filter(h => h.completedDates.includes(dateStr)).length;
            const percentage = habits.length ? Math.round((completed / habits.length) * 100) : 0;

            result.unshift({
                date: dateStr,
                day: dayName,
                completed,
                total: habits.length,
                percentage
            });
        }

        return result;
    };

    // Generate statistics for habits
    const stats = useMemo(() => {
        if (!habits || habits.length === 0) return null;

        const totalHabits = habits.length;
        const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
        const completionRate = Math.round((completedToday / totalHabits) * 100) || 0;

        // Sort habits by streak (descending)
        const topHabits = [...habits]
            .sort((a, b) => b.streak - a.streak)
            .slice(0, 3);

        // Calculate streak data
        let totalStreaks = 0;
        habits.forEach(habit => {
            totalStreaks += habit.streak || 0;
        });
        const averageStreak = totalStreaks / totalHabits || 0;

        // Find the habit with the longest all-time streak
        const bestStreaks = habits.map(h => h.bestStreak || 0);
        const longestStreak = bestStreaks.length > 0 ? Math.max(...bestStreaks) : 0;
        const habitWithLongestStreak = habits.find(h => h.bestStreak === longestStreak);

        // Generate weekly completion stats
        const weeklyStats = generateWeeklyStats(habits);

        return {
            totalHabits,
            completedToday,
            completionRate,
            topHabits,
            averageStreak: Math.round(averageStreak * 10) / 10,
            longestStreak,
            habitWithLongestStreak,
            weeklyStats
        };
    }, [habits, today]);

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

                {/* Today's Progress */}
                <div className="bg-gray-700/80 backdrop-blur-sm rounded-xl shadow-lg p-5 mb-6 border border-gray-600">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-green-400" />
                        Today's Progress
                    </h3>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <p className="text-gray-300 font-medium">Completed</p>
                            <p className="text-2xl font-bold text-white">{stats.completedToday} / {stats.totalHabits}</p>
                        </div>
                        <div className="relative">
                            <svg className="w-32 h-32" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#374151"
                                    strokeWidth="3"
                                    strokeDasharray="100, 100"
                                />
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="3"
                                    strokeDasharray={`${stats.completionRate}, 100`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                <div className="text-2xl font-bold text-white">{stats.completionRate}%</div>
                                <div className="text-xs text-gray-300">Complete</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weekly Progress */}
                <div className="bg-gray-700/80 backdrop-blur-sm rounded-xl shadow-lg p-5 mb-6 border border-gray-600">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-green-400" />
                        Weekly Progress
                    </h3>
                    <div className="flex items-end justify-between h-40 gap-1">
                        {stats.weeklyStats.map((day) => (
                            <div key={day.date} className="flex flex-col items-center flex-1">
                                <div
                                    className="w-full bg-gray-600 rounded-t-lg"
                                    style={{
                                        height: `${day.percentage}%`,
                                        backgroundColor: day.date === today ? '#10b981' : '#374151',
                                        opacity: day.date === today ? 1 : 0.7
                                    }}
                                ></div>
                                <div className={`text-xs mt-2 font-medium ${day.date === today ? 'text-white' : 'text-gray-400'}`}>
                                    {day.day}
                                </div>
                                <div className={`text-xs ${day.date === today ? 'text-green-400' : 'text-gray-500'}`}>
                                    {day.completed}/{day.total}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Performing Habits */}
                <div className="bg-gray-700/80 backdrop-blur-sm rounded-xl shadow-lg p-5 mb-6 border border-gray-600">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <Trophy className="w-5 h-5 mr-2 text-green-400" />
                        Top Performing Habits
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
                                        <span className="font-bold mr-1">{habit.streak}</span>
                                        <Zap className="w-4 h-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-300">No active habit streaks yet.</p>
                    )}
                </div>

                {/* Summary Stats */}
                <div className="bg-gray-700/80 backdrop-blur-sm rounded-xl shadow-lg p-5 border border-gray-600">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-green-400" />
                        Achievements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700">
                            <p className="text-gray-300 text-sm font-medium">Average Streak</p>
                            <p className="text-xl font-bold text-white">{stats.averageStreak} days</p>
                            <div className="h-2 w-full bg-gray-700 rounded-full mt-2">
                                <div
                                    className="h-2 bg-green-500 rounded-full"
                                    style={{ width: `${Math.min(stats.averageStreak * 3.33, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700">
                            <p className="text-gray-300 text-sm font-medium">Longest Streak</p>
                            <div>
                                <p className="text-xl font-bold text-white">{stats.longestStreak} days</p>
                                {stats.habitWithLongestStreak && (
                                    <p className="text-green-400 text-sm">{stats.habitWithLongestStreak.name}</p>
                                )}
                            </div>
                            <div className="h-2 w-full bg-gray-700 rounded-full mt-2">
                                <div
                                    className="h-2 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                                    style={{ width: `${Math.min(stats.longestStreak * 3.33, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 