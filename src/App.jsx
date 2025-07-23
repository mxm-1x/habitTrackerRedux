import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store/store';
import { Auth } from './components/Auth';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { ProgressPage } from './pages/ProgressPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { loginSuccess, logout } from './store/authSlice';
import { fetchHabits } from './store/habitSlice';
import { fetchAllUsers, migrateToNewStructure, createUserProfile } from './store/userSlice';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.auth);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

const AppContent = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  // Run migration once when app starts
  useEffect(() => {
    const runMigration = async () => {
      try {
        console.log('Running migration on app start...');
        await dispatch(migrateToNewStructure()).unwrap();
      } catch (error) {
        console.error('Migration error:', error);
      }
    };
    
    runMigration();
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(loginSuccess(user));
        
        try {
          // Ensure user has a profile first (for existing users who might not have one)
          await dispatch(createUserProfile({
            userId: user.uid,
            displayName: user.displayName || `User ${user.uid.slice(-6)}`,
            email: user.email || ''
          })).unwrap();
          
          await dispatch(fetchAllUsers()).unwrap();
          
          // Fetch habits after ensuring user profile exists
          dispatch(fetchHabits(user.uid));
        } catch (error) {
          console.error('Error during user initialization:', error);
          // Still try to fetch habits even if other operations fail
          dispatch(fetchHabits(user.uid));
        }
      } else {
        dispatch(logout());
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden z-0">
          <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-900/30 animate-slow-spin"></div>
          <div className="absolute -bottom-[30%] -right-[30%] w-[60%] h-[60%] bg-gradient-to-tl from-green-800/20 via-emerald-800/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -top-[20%] -left-[10%] w-[40%] h-[40%] bg-gradient-to-br from-green-800/10 via-green-700/5 to-transparent rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
            {currentUser ? (
              <>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <HomePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/progress"
                    element={
                      <ProtectedRoute>
                        <ProgressPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/leaderboard"
                    element={
                      <ProtectedRoute>
                        <LeaderboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <Navbar />
              </>
            ) : (
              <div className="animate-fadeIn">
                <Routes>
                  <Route path="/login" element={<Auth />} />
                  <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global styles */}
      <style jsx global>{`
        @keyframes slow-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slow-spin {
          animation: slow-spin 60s linear infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1f2937;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </BrowserRouter>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;