import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    getDoc,
    setDoc,
    query,
    where
} from 'firebase/firestore';
import { db } from '../firebase';

const initialState = {
    users: {},
    loading: false,
    error: null
};

// Create or update user profile with all data
export const createUserProfile = createAsyncThunk(
    'users/createUserProfile',
    async ({ userId, displayName, email }, { rejectWithValue }) => {
        try {
            console.log('Creating user profile for:', userId, displayName, email);
            const userRef = doc(db, 'users', userId);
            const userData = {
                displayName,
                email,
                habits: [],
                longestStreak: 0,
                totalHabits: 0,
                totalCompletedToday: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            await setDoc(userRef, userData, { merge: true });
            console.log('User profile created successfully');
            return { userId, ...userData };
        } catch (error) {
            console.error('Error creating user profile:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Fetch user profile with all data
export const fetchUserProfile = createAsyncThunk(
    'users/fetchUserProfile',
    async (userId, { rejectWithValue }) => {
        try {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                return { userId, ...userSnap.data() };
            } else {
                return null;
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch all users for leaderboard
export const fetchAllUsers = createAsyncThunk(
    'users/fetchAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const usersRef = collection(db, 'users');
            const usersSnapshot = await getDocs(usersRef);

            const users = {};
            usersSnapshot.forEach((doc) => {
                users[doc.id] = { userId: doc.id, ...doc.data() };
            });

            return users;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
    'users/updateUserProfile',
    async ({ userId, displayName }, { rejectWithValue }) => {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                displayName,
                updatedAt: new Date().toISOString()
            });

            return { userId, displayName };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Add habit to user
export const addHabitToUser = createAsyncThunk(
    'users/addHabitToUser',
    async ({ userId, habit }, { rejectWithValue }) => {
        try {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                const updatedHabits = [...(userData.habits || []), habit];

                await updateDoc(userRef, {
                    habits: updatedHabits,
                    totalHabits: updatedHabits.length,
                    updatedAt: new Date().toISOString()
                });

                return { userId, habits: updatedHabits, totalHabits: updatedHabits.length };
            }

            return rejectWithValue('User not found');
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update habit in user
export const updateHabitInUser = createAsyncThunk(
    'users/updateHabitInUser',
    async ({ userId, habitId, updatedHabit }, { rejectWithValue }) => {
        try {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                const updatedHabits = userData.habits.map(habit =>
                    habit.id === habitId ? { ...habit, ...updatedHabit } : habit
                );

                // Calculate longest streak
                const longestStreak = Math.max(...updatedHabits.map(h => h.bestStreak || 0), 0);

                // Calculate today's completions
                const today = new Date().toISOString().split('T')[0];
                const totalCompletedToday = updatedHabits.filter(h =>
                    h.completedDates && h.completedDates.includes(today)
                ).length;

                await updateDoc(userRef, {
                    habits: updatedHabits,
                    longestStreak,
                    totalCompletedToday,
                    updatedAt: new Date().toISOString()
                });

                return {
                    userId,
                    habits: updatedHabits,
                    longestStreak,
                    totalCompletedToday
                };
            }

            return rejectWithValue('User not found');
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete habit from user
export const deleteHabitFromUser = createAsyncThunk(
    'users/deleteHabitFromUser',
    async ({ userId, habitId }, { rejectWithValue }) => {
        try {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                const updatedHabits = userData.habits.filter(habit => habit.id !== habitId);

                // Recalculate longest streak
                const longestStreak = updatedHabits.length > 0
                    ? Math.max(...updatedHabits.map(h => h.bestStreak || 0))
                    : 0;

                // Recalculate today's completions
                const today = new Date().toISOString().split('T')[0];
                const totalCompletedToday = updatedHabits.filter(h =>
                    h.completedDates && h.completedDates.includes(today)
                ).length;

                await updateDoc(userRef, {
                    habits: updatedHabits,
                    totalHabits: updatedHabits.length,
                    longestStreak,
                    totalCompletedToday,
                    updatedAt: new Date().toISOString()
                });

                return {
                    userId,
                    habits: updatedHabits,
                    totalHabits: updatedHabits.length,
                    longestStreak,
                    totalCompletedToday
                };
            }

            return rejectWithValue('User not found');
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Migrate existing data to new structure
export const migrateToNewStructure = createAsyncThunk(
    'users/migrateToNewStructure',
    async (_, { rejectWithValue }) => {
        try {
            console.log('Starting migration to new structure...');

            // Check if migration has already been done by looking for a migration flag
            const migrationRef = doc(db, 'system', 'migration');
            const migrationSnap = await getDoc(migrationRef);

            if (migrationSnap.exists() && migrationSnap.data().completed) {
                console.log('Migration already completed, skipping');
                return {};
            }

            // Get all habits from old structure
            const habitsRef = collection(db, 'habits');
            const habitsSnapshot = await getDocs(habitsRef);
            console.log('Found habits in old structure:', habitsSnapshot.size);

            // If no habits in old structure, mark migration as complete and skip
            if (habitsSnapshot.size === 0) {
                console.log('No habits to migrate, marking migration as complete');
                await setDoc(migrationRef, { completed: true, completedAt: new Date().toISOString() });
                return {};
            }

            // Group habits by user
            const userHabits = {};
            habitsSnapshot.forEach((doc) => {
                const habit = { id: doc.id, ...doc.data() };
                const userId = habit.userId;

                if (!userHabits[userId]) {
                    userHabits[userId] = [];
                }
                userHabits[userId].push(habit);
            });

            console.log('Users with habits:', Object.keys(userHabits));

            // Create or update user documents with all their data
            const createdUsers = {};
            for (const [userId, habits] of Object.entries(userHabits)) {
                // Check if user already has habits in new structure
                const userDocRef = doc(db, 'users', userId);
                const existingUserDoc = await getDoc(userDocRef);

                if (existingUserDoc.exists() && existingUserDoc.data().habits && existingUserDoc.data().habits.length > 0) {
                    console.log(`User ${userId} already has ${existingUserDoc.data().habits.length} habits in new structure, skipping migration`);
                    createdUsers[userId] = existingUserDoc.data();
                    continue;
                }

                const longestStreak = Math.max(...habits.map(h => h.bestStreak || 0), 0);
                const today = new Date().toISOString().split('T')[0];
                const totalCompletedToday = habits.filter(h =>
                    h.completedDates && h.completedDates.includes(today)
                ).length;

                const userData = {
                    userId,
                    displayName: `User ${userId.slice(-6)}`,
                    email: '',
                    habits,
                    longestStreak,
                    totalHabits: habits.length,
                    totalCompletedToday,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                console.log('Migrating user:', userId, 'with', habits.length, 'habits');
                await setDoc(doc(db, 'users', userId), userData, { merge: true });
                createdUsers[userId] = userData;
            }

            // Also create profiles for users who don't have any habits yet
            // This ensures all registered users appear in the leaderboard
            const existingUsersRef = collection(db, 'users');
            const existingUsersSnapshot = await getDocs(existingUsersRef);

            existingUsersSnapshot.forEach((doc) => {
                if (!createdUsers[doc.id]) {
                    // This user exists but wasn't created from habits migration
                    // They will be handled by the createUserProfile function when they log in
                }
            });

            // Mark migration as completed
            await setDoc(migrationRef, {
                completed: true,
                completedAt: new Date().toISOString(),
                migratedUsers: Object.keys(createdUsers).length,
                migratedHabits: habitsSnapshot.size
            });

            console.log('Migration completed successfully. Old habits collection can be cleaned up manually.');
            return createdUsers;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearUsers: (state) => {
            state.users = {};
        }
    },
    extraReducers: (builder) => {
        builder
            // Create user profile
            .addCase(createUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.users[action.payload.userId] = action.payload;
                }
            })
            .addCase(createUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch user profile
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.users[action.payload.userId] = action.payload;
                }
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch all users
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = { ...state.users, ...action.payload };
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update user profile
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                if (state.users[action.payload.userId]) {
                    state.users[action.payload.userId].displayName = action.payload.displayName;
                }
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add habit to user
            .addCase(addHabitToUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addHabitToUser.fulfilled, (state, action) => {
                state.loading = false;
                if (state.users[action.payload.userId]) {
                    state.users[action.payload.userId].habits = action.payload.habits;
                    state.users[action.payload.userId].totalHabits = action.payload.totalHabits;
                }
            })
            .addCase(addHabitToUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update habit in user
            .addCase(updateHabitInUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateHabitInUser.fulfilled, (state, action) => {
                state.loading = false;
                if (state.users[action.payload.userId]) {
                    state.users[action.payload.userId].habits = action.payload.habits;
                    state.users[action.payload.userId].longestStreak = action.payload.longestStreak;
                    state.users[action.payload.userId].totalCompletedToday = action.payload.totalCompletedToday;
                }
            })
            .addCase(updateHabitInUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete habit from user
            .addCase(deleteHabitFromUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteHabitFromUser.fulfilled, (state, action) => {
                state.loading = false;
                if (state.users[action.payload.userId]) {
                    state.users[action.payload.userId].habits = action.payload.habits;
                    state.users[action.payload.userId].totalHabits = action.payload.totalHabits;
                    state.users[action.payload.userId].longestStreak = action.payload.longestStreak;
                    state.users[action.payload.userId].totalCompletedToday = action.payload.totalCompletedToday;
                }
            })
            .addCase(deleteHabitFromUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Migrate to new structure
            .addCase(migrateToNewStructure.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(migrateToNewStructure.fulfilled, (state, action) => {
                state.loading = false;
                state.users = { ...state.users, ...action.payload };
            })
            .addCase(migrateToNewStructure.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearUsers } = userSlice.actions;
export default userSlice.reducer; 