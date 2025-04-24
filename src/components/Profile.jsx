import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { logout } from '../store/authSlice';
import { LogOut, User } from 'lucide-react';

export const Profile = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(logout());
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="bg-green-600 rounded-full p-2">
                    <User className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-medium text-white">{currentUser?.displayName || 'User'}</h3>
                    <p className="text-gray-400 text-sm">{currentUser?.email}</p>
                </div>
            </div>
            <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm"
            >
                <LogOut className="w-4 h-4" />
                Logout
            </button>
        </div>
    );
}; 