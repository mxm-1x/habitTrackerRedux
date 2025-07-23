import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHabits, incrementStreak } from '../store/habitSlice';

export function HabitList() {
    const { habits, loading } = useSelector((state) => state.habits);
    const { currentUser } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentUser) {
            dispatch(fetchHabits(currentUser.uid));
        }
    }, [dispatch, currentUser]);

    if (loading) return <div className="text-center py-8 text-gray-400">Loading...</div>;

    return (
        <div className="max-w-md mx-auto space-y-4">
            {habits.length === 0 && (
                <div className="text-center text-gray-500 bg-gray-900 rounded-lg py-8 shadow-inner border border-gray-800">
                    No habits yet. Start by adding a new habit!
                </div>
            )}
            {habits.map((habit) => (
                <div
                    key={habit.id}
                    className="flex items-center justify-between bg-gray-900 rounded-lg shadow p-4 border border-gray-800 hover:shadow-lg transition"
                >
                    <span className="font-medium text-gray-100">{habit.name}</span>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-orange-400 font-semibold text-sm">
                            <span role="img" aria-label="streak">🔥</span>
                            {habit.currentStreak} day{habit.currentStreak === 1 ? '' : 's'}
                        </span>
                        <button
                            onClick={() => dispatch(incrementStreak({ habitId: habit.id, currentStreak: habit.currentStreak }))}
                            className="ml-2 bg-green-600 hover:bg-green-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            title="Increment streak"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}