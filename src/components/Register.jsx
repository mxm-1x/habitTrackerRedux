import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { createUserProfile } from '../store/userSlice';
import { Mail, Lock, User, UserPlus, ArrowRight } from 'lucide-react';

export const Register = ({ onToggleForm }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inputFocus, setInputFocus] = useState(null);
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginStart());

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Update profile with display name
            await updateProfile(userCredential.user, {
                displayName: name
            });
            
            // Create user profile in Firestore
            await dispatch(createUserProfile({
                userId: userCredential.user.uid,
                displayName: name,
                email: email
            })).unwrap();
            
            dispatch(loginSuccess(userCredential.user));
        } catch (error) {
            dispatch(loginFailure(error.message));
        }
    };

    const formatError = (errorMessage) => {
        if (errorMessage.includes('auth/email-already-in-use')) {
            return 'This email is already registered. Try logging in instead.';
        }
        if (errorMessage.includes('auth/weak-password')) {
            return 'Password should be at least 6 characters long.';
        }
        return errorMessage;
    };

    return (
        <div className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700 transition-all duration-300">
            <div className="flex justify-center mb-6">
                <div className="p-3 bg-emerald-600/90 rounded-full shadow-lg">
                    <UserPlus className="w-8 h-8 text-white" />
                </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className={`relative transition-all duration-300 ${inputFocus === 'name' ? 'scale-105' : ''}`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className={`w-5 h-5 ${inputFocus === 'name' ? 'text-green-400' : 'text-gray-400'} transition-colors duration-300`} />
                    </div>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setInputFocus('name')}
                        onBlur={() => setInputFocus(null)}
                        required
                        className="w-full pl-10 pr-3 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                        placeholder="Full name"
                    />
                </div>

                <div className={`relative transition-all duration-300 ${inputFocus === 'email' ? 'scale-105' : ''}`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className={`w-5 h-5 ${inputFocus === 'email' ? 'text-green-400' : 'text-gray-400'} transition-colors duration-300`} />
                    </div>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setInputFocus('email')}
                        onBlur={() => setInputFocus(null)}
                        required
                        className="w-full pl-10 pr-3 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                        placeholder="Email address"
                    />
                </div>

                <div className={`relative transition-all duration-300 ${inputFocus === 'password' ? 'scale-105' : ''}`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className={`w-5 h-5 ${inputFocus === 'password' ? 'text-green-400' : 'text-gray-400'} transition-colors duration-300`} />
                    </div>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setInputFocus('password')}
                        onBlur={() => setInputFocus(null)}
                        required
                        minLength={6}
                        className="w-full pl-10 pr-3 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                        placeholder="Password (min. 6 characters)"
                    />
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-lg text-sm animate-shake">
                        {formatError(error)}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg flex items-center justify-center"
                >
                    {loading ? (
                        <span className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></span>
                    ) : (
                        <>
                            <span>Create Account</span>
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button
                    onClick={onToggleForm}
                    className="text-green-400 hover:text-green-300 text-sm transition-all duration-300 hover:underline"
                >
                    Already have an account? Login
                </button>
            </div>

            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
                }
            `}</style>
        </div>
    );
}; 