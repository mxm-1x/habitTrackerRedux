import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addHabit, fetchHabits } from '../store/habitSlice';

export function HabitForm() {
    const [habitName, setHabitName] = useState('');
    const [touched, setTouched] = useState(false);
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched(true);
        if (habitName.trim() && currentUser) {
            await dispatch(addHabit({ name: habitName, userId: currentUser.uid })).unwrap();
            await dispatch(fetchHabits(currentUser.uid)).unwrap();
            setHabitName('');
            setTouched(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-gray-900 rounded-xl shadow-md p-6 mb-6 border border-gray-800">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label htmlFor="habitName" className="font-semibold text-gray-200">New Habit</label>
                <input
                    id="habitName"
                    type="text"
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                    onBlur={() => setTouched(true)}
                    placeholder="Enter a new habit (e.g. Drink water)"
                    className="px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 transition placeholder-gray-400"
                />
                {touched && !habitName.trim() && (
                    <span className="text-red-400 text-sm">Please enter a habit name.</span>
                )}
                <button
                    type="submit"
                    disabled={!habitName.trim()}
                    className="bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-2 rounded-lg shadow hover:from-green-700 hover:to-emerald-600 transition disabled:opacity-50"
                >
                    Add Habit
                </button>
            </form>
        </div>
    );
}