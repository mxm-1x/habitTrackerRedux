import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, ListTodo, BarChart2 } from 'lucide-react';
import { useSelector } from 'react-redux';

export const Navbar = () => {
    const { currentUser } = useSelector((state) => state.auth);

    // Don't show navbar if user is not logged in
    if (!currentUser) return null;

    return (
        <nav className="bg-gray-800/90 backdrop-blur-sm fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto shadow-xl z-50 border-t border-gray-700 md:border-t-0 md:border-b">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center justify-around h-16">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex flex-col items-center text-sm transition-all duration-200 ease-in-out transform ${isActive
                                ? 'text-green-400 translate-y-[-2px] md:translate-y-0 md:border-b-2 md:border-green-400 md:pb-1 md:pt-1'
                                : 'text-gray-300 hover:text-white hover:translate-y-[-2px] md:hover:translate-y-0 md:hover:border-b-2 md:hover:border-gray-500 md:pb-1 md:pt-1'
                            }`
                        }
                    >
                        <ListTodo className="w-6 h-6 mb-1" />
                        <span className="font-medium">Habits</span>
                    </NavLink>
                    <NavLink
                        to="/progress"
                        className={({ isActive }) =>
                            `flex flex-col items-center text-sm transition-all duration-200 ease-in-out transform ${isActive
                                ? 'text-green-400 translate-y-[-2px] md:translate-y-0 md:border-b-2 md:border-green-400 md:pb-1 md:pt-1'
                                : 'text-gray-300 hover:text-white hover:translate-y-[-2px] md:hover:translate-y-0 md:hover:border-b-2 md:hover:border-gray-500 md:pb-1 md:pt-1'
                            }`
                        }
                    >
                        <BarChart2 className="w-6 h-6 mb-1" />
                        <span className="font-medium">Progress</span>
                    </NavLink>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `flex flex-col items-center text-sm transition-all duration-200 ease-in-out transform ${isActive
                                ? 'text-green-400 translate-y-[-2px] md:translate-y-0 md:border-b-2 md:border-green-400 md:pb-1 md:pt-1'
                                : 'text-gray-300 hover:text-white hover:translate-y-[-2px] md:hover:translate-y-0 md:hover:border-b-2 md:hover:border-gray-500 md:pb-1 md:pt-1'
                            }`
                        }
                    >
                        <User className="w-6 h-6 mb-1" />
                        <span className="font-medium">Profile</span>
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}; 