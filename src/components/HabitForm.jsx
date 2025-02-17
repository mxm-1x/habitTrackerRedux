import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addHabit } from '../store/habitSlice';

export function HabitForm() {
    const [habitName, setHabitName] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (habitName.trim()) {
            dispatch(addHabit({ name: habitName }));
            setHabitName('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 ">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                    placeholder="Enter a new habit..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-500"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-lime-500 flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Habit
                </button>
            </div>
        </form>
    );
}