import React, { useState } from 'react';
import { Login } from './Login';
import { Register } from './Register';
import { CheckCheck } from 'lucide-react';

export const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-500 p-3 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 mb-8">
                <CheckCheck className="w-8 h-8 text-white" />
                <h1 className="text-3xl font-bold text-white">Habit Tracker</h1>
            </div>

            <div className="w-full max-w-md transition-all duration-500 ease-in-out transform animate-float">
                {isLogin ? (
                    <Login onToggleForm={toggleForm} />
                ) : (
                    <Register onToggleForm={toggleForm} />
                )}
            </div>

            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(10px); }
                    50% { transform: translateY(-5px); }
                    100% { transform: translateY(10px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}; 