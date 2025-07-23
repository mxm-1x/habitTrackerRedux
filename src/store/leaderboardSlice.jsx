import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    collection,
    getDocs
} from 'firebase/firestore';
import { db } from '../firebase';
import { fetchAllUsers } from './userSlice';

const initialState = {
    leaderboard: [],
    loading: false,
    error: null,
    userRank: null
};

// Fetch leaderboard data from users collection
export const fetchLeaderboard = createAsyncThunk(
    'leaderboard/fetchLeaderboard',
    async (_, { rejectWithValue }) => {
        try {
            const usersRef = collection(db, 'users');

            // Get all users without ordering (to avoid index issues)
            const querySnapshot = await getDocs(usersRef);
            const leaderboard = [];

            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                // Include all users, even those with 0 streaks
                leaderboard.push({
                    userId: doc.id,
                    displayName: userData.displayName || `User ${doc.id.slice(-6)}`,
                    longestStreak: userData.longestStreak || 0,
                    totalHabits: userData.totalHabits || 0,
                    totalCompletedToday: userData.totalCompletedToday || 0,
                    level: getLevel(userData.longestStreak || 0)
                });
            });

            // Sort by longest streak (descending), then by total completed today (descending)
            leaderboard.sort((a, b) => {
                if (b.longestStreak !== a.longestStreak) {
                    return b.longestStreak - a.longestStreak;
                }
                return b.totalCompletedToday - a.totalCompletedToday;
            });

            return leaderboard;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Helper function to determine user level
const getLevel = (longestStreak) => {
    if (longestStreak >= 15) return 'Advanced';
    if (longestStreak >= 4) return 'Intermediate';
    return 'Beginner';
};

// Fetch user's specific rank
export const fetchUserRank = createAsyncThunk(
    'leaderboard/fetchUserRank',
    async (userId, { rejectWithValue }) => {
        try {
            // Get user's data from users collection
            const usersRef = collection(db, 'users');
            const usersSnapshot = await getDocs(usersRef);

            const userStats = {};
            let userLongestStreak = 0;

            usersSnapshot.forEach((doc) => {
                const userData = doc.data();
                const longestStreak = userData.longestStreak || 0;
                
                if (doc.id === userId) {
                    userLongestStreak = longestStreak;
                }
                
                userStats[doc.id] = longestStreak;
            });

            // Count users with higher or equal streaks (including users with 0 streaks)
            const usersWithHigherStreaks = Object.values(userStats)
                .filter(streak => streak >= userLongestStreak)
                .length;

            return {
                rank: usersWithHigherStreaks,
                longestStreak: userLongestStreak
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const leaderboardSlice = createSlice({
    name: 'leaderboard',
    initialState,
    reducers: {
        clearLeaderboard: (state) => {
            state.leaderboard = [];
            state.userRank = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch leaderboard
            .addCase(fetchLeaderboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLeaderboard.fulfilled, (state, action) => {
                state.loading = false;
                state.leaderboard = action.payload;
            })
            .addCase(fetchLeaderboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch user rank
            .addCase(fetchUserRank.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserRank.fulfilled, (state, action) => {
                state.loading = false;
                state.userRank = action.payload;
            })
            .addCase(fetchUserRank.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearLeaderboard } = leaderboardSlice.actions;
export default leaderboardSlice.reducer; 