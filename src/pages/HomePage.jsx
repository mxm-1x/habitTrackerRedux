import React from 'react';
import { HabitForm } from '../components/HabitForm';
import { HabitList } from '../components/HabitList';
import { CheckCheck } from 'lucide-react';

export const HomePage = () => {
    return (
        <div className="pb-20 md:pb-0 md:pt-20 animate-fadeIn">
            <div className="flex flex-col items-center justify-center gap-6 mb-8">
                <div className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-500 p-3 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <CheckCheck className="w-8 h-8 text-white" />
                    <h1 className="text-3xl font-bold text-white">Habit Tracker</h1>
                </div>
            </div>

            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-700 transition-all duration-300 hover:shadow-green-900/20">
                <HabitForm />
                <div className="mt-2 border-t border-gray-700 pt-6">
                    <HabitList />
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
            `}</style>
        </div>
    );
}; 