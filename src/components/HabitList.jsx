import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle, XCircle, Trash2, Flame, Plus } from 'lucide-react';
import { toggleHabit, deleteHabit, incrementStreak } from '../store/habitSlice';

export function HabitList() {
    const habits = useSelector((state) => state.habits.habits);
    const dispatch = useDispatch();

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

    return (
        <div className="space-y-4">
            {habits.map((habit) => (
                <div
                    key={habit.id}
                    className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => dispatch(toggleHabit({ id: habit.id }))}
                            className="focus:outline-none"
                        >
                            {isCompletedToday(habit.completedDates) ? (
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
                                        onClick={() => dispatch(incrementStreak({ id: habit.id }))}
                                        disabled={!canIncrementStreak(habit.lastIncrementTime)}
                                        className={`ml-2 p-1 rounded-full ${canIncrementStreak(habit.lastIncrementTime)
                                                ? 'bg-lime-500 hover:bg-lime-600 text-white'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                        title={
                                            canIncrementStreak(habit.lastIncrementTime)
                                                ? 'Increment streak'
                                                : `Available in ${getTimeUntilNextIncrement(habit.lastIncrementTime)} hours`
                                        }
                                    >
                                        <Plus className="w-3 h-3" />
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
                        onClick={() => dispatch(deleteHabit({ id: habit.id }))}
                        className="text-red-500 hover:text-red-600 focus:outline-none"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            ))}
            {habits.length === 0 && (
                <p className="text-center text-gray-500">No habits added yet. Start by adding a new habit!</p>
            )}
        </div>
    );
}