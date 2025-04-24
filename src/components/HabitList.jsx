import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle, XCircle, Trash2, Flame, Plus, Loader2 } from 'lucide-react';
import {
    fetchHabits,
    updateHabitInFirebase,
    deleteHabitFromFirebase
} from '../store/habitSlice';

export function HabitList() {
    const { habits, loading } = useSelector((state) => state.habits);
    const { currentUser } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [loadingHabitIds, setLoadingHabitIds] = useState([]);

    useEffect(() => {
        if (currentUser) {
            dispatch(fetchHabits(currentUser.uid));
        }
    }, [dispatch, currentUser]);

    const isCompletedToday = (completedDates) => {
        const today = new Date().toISOString().split('T')[0];
        return completedDates.includes(today);
    };

    const canIncrementStreak = (lastIncrementTime) => {
        if (!lastIncrementTime) return true;

        const now = new Date().getTime();
        const last = new Date(lastIncrementTime).getTime();
        const hoursSinceLastIncrement = (now - last) / (1000 * 60 * 60);
        const hoursRemaining = Math.max(0, 24 - hoursSinceLastIncrement);

        return hoursSinceLastIncrement >= 24;
    };

    const getTimeUntilNextIncrement = (lastIncrementTime) => {
        if (!lastIncrementTime) return null;

        const now = new Date().getTime();
        const last = new Date(lastIncrementTime).getTime();
        const hoursSinceLastIncrement = (now - last) / (1000 * 60 * 60);
        const hoursRemaining = Math.max(0, 24 - hoursSinceLastIncrement);

        return Math.ceil(hoursRemaining);
    };

    const handleToggleHabit = async (habit) => {
        try {
            setLoadingHabitIds(prev => [...prev, habit.id]);

            const today = new Date().toISOString().split('T')[0];
            const hasCompletedToday = habit.completedDates.includes(today);

            let updatedCompletedDates;
            if (hasCompletedToday) {
                updatedCompletedDates = habit.completedDates.filter(date => date !== today);
            } else {
                updatedCompletedDates = [...habit.completedDates, today];
            }

            const calculateStreak = (dates) => {
                if (!dates.length) return 0;

                const sortedDates = [...dates].sort();
                const today = new Date().toISOString().split('T')[0];
                const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

                if (!dates.includes(today) && !dates.includes(yesterday)) {
                    return 0;
                }

                let currentStreak = 1;
                let date = new Date(sortedDates[sortedDates.length - 1]);

                while (currentStreak < sortedDates.length) {
                    const previousDate = new Date(date.getTime() - 86400000).toISOString().split('T')[0];
                    if (!dates.includes(previousDate)) break;
                    currentStreak++;
                    date = new Date(previousDate);
                }

                return currentStreak;
            };

            const updatedStreak = calculateStreak(updatedCompletedDates);
            const updatedBestStreak = Math.max(habit.bestStreak, updatedStreak);

            await dispatch(updateHabitInFirebase({
                ...habit,
                completedDates: updatedCompletedDates,
                streak: updatedStreak,
                bestStreak: updatedBestStreak
            })).unwrap();
        } catch (error) {
            console.error('Error toggling habit:', error);
        } finally {
            setLoadingHabitIds(prev => prev.filter(id => id !== habit.id));
        }
    };

    const handleIncrementStreak = async (habit) => {
        if (!canIncrementStreak(habit.lastIncrementTime)) return;

        try {
            setLoadingHabitIds(prev => [...prev, habit.id]);

            const today = new Date().toISOString().split('T')[0];
            const updatedCompletedDates = habit.completedDates.includes(today)
                ? habit.completedDates
                : [...habit.completedDates, today];

            const updatedStreak = habit.streak + 1;
            const updatedBestStreak = Math.max(habit.bestStreak, updatedStreak);

            await dispatch(updateHabitInFirebase({
                ...habit,
                streak: updatedStreak,
                bestStreak: updatedBestStreak,
                lastIncrementTime: new Date().toISOString(),
                completedDates: updatedCompletedDates
            })).unwrap();
        } catch (error) {
            console.error('Error incrementing streak:', error);
        } finally {
            setLoadingHabitIds(prev => prev.filter(id => id !== habit.id));
        }
    };

    const handleDeleteHabit = async (id) => {
        try {
            setLoadingHabitIds(prev => [...prev, id]);
            await dispatch(deleteHabitFromFirebase(id)).unwrap();
        } catch (error) {
            console.error('Error deleting habit:', error);
        } finally {
            setLoadingHabitIds(prev => prev.filter(habitId => habitId !== id));
        }
    };

    if (loading && habits.length === 0) {
        return (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="w-8 h-8 text-lime-500 animate-spin" />
                <span className="ml-2 text-gray-600">Loading habits...</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {habits.map((habit) => (
                <div
                    key={habit.id}
                    className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handleToggleHabit(habit)}
                            className="focus:outline-none"
                            disabled={loadingHabitIds.includes(habit.id)}
                        >
                            {loadingHabitIds.includes(habit.id) ? (
                                <Loader2 className="w-6 h-6 text-lime-500 animate-spin" />
                            ) : isCompletedToday(habit.completedDates) ? (
                                <CheckCircle className="w-6 h-6 text-green-500" />
                            ) : (
                                <XCircle className="w-6 h-6 text-gray-400" />
                            )}
                        </button>
                        <div>
                            <h3 className="font-medium">{habit.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Flame className={`w-4 h-4 ${habit.streak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
                                    <span>Current streak: {habit.streak} days</span>
                                    <button
                                        onClick={() => handleIncrementStreak(habit)}
                                        disabled={
                                            !canIncrementStreak(habit.lastIncrementTime) ||
                                            loadingHabitIds.includes(habit.id)
                                        }
                                        className={`ml-2 p-1 rounded-full ${canIncrementStreak(habit.lastIncrementTime) && !loadingHabitIds.includes(habit.id)
                                                ? 'bg-lime-500 hover:bg-lime-600 text-white'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                        title={
                                            canIncrementStreak(habit.lastIncrementTime)
                                                ? 'Increment streak'
                                                : `Available in ${getTimeUntilNextIncrement(habit.lastIncrementTime)} hours`
                                        }
                                    >
                                        {loadingHabitIds.includes(habit.id) ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                            <Plus className="w-3 h-3" />
                                        )}
                                    </button>
                                </div>
                                {habit.bestStreak > 0 && (
                                    <span className="text-gray-400">
                                        • Best: {habit.bestStreak} days
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => handleDeleteHabit(habit.id)}
                        className="text-red-500 hover:text-red-600 focus:outline-none"
                        disabled={loadingHabitIds.includes(habit.id)}
                    >
                        {loadingHabitIds.includes(habit.id) ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Trash2 className="w-5 h-5" />
                        )}
                    </button>
                </div>
            ))}
            {habits.length === 0 && !loading && (
                <p className="text-center text-gray-500">No habits added yet. Start by adding a new habit!</p>
            )}
        </div>
    );
}