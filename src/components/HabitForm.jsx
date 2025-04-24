import React, { useState } from 'react';
import { Plus, Sparkles, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addHabitToFirebase } from '../store/habitSlice';

export function HabitForm() {
    const [habitName, setHabitName] = useState('');
    const [inputFocus, setInputFocus] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.auth);
    const { loading } = useSelector((state) => state.habits);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (habitName.trim() && currentUser) {
            setIsSubmitting(true);
            try {
                await dispatch(addHabitToFirebase({
                    name: habitName,
                    userId: currentUser.uid
                })).unwrap();
                setHabitName('');
            } catch (error) {
                console.error('Failed to add habit:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className={`relative flex-1 transition-all duration-300 ${inputFocus ? 'transform scale-102' : ''}`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Sparkles className={`w-5 h-5 ${inputFocus ? 'text-green-400' : 'text-gray-400'} transition-colors duration-300`} />
                    </div>
                    <input
                        type="text"
                        value={habitName}
                        onChange={(e) => setHabitName(e.target.value)}
                        onFocus={() => setInputFocus(true)}
                        onBlur={() => setInputFocus(false)}
                        placeholder="Enter a new habit to track..."
                        className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-600 bg-gray-700/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white transition-all duration-300"
                        disabled={isSubmitting || loading}
                    />
                </div>
                <button
                    type="submit"
                    className="px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-400 flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px]"
                    disabled={isSubmitting || loading || !habitName.trim()}
                >
                    {isSubmitting || loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Adding...</span>
                        </>
                    ) : (
                        <>
                            <Plus className="w-5 h-5" />
                            <span>Add Habit</span>
                        </>
                    )}
                </button>
            </div>

            <style jsx>{`
                .scale-102 {
                    --tw-scale-x: 1.02;
                    --tw-scale-y: 1.02;
                }
            `}</style>
        </form>
    );
}