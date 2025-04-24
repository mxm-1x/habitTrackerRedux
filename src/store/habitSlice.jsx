import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where
} from 'firebase/firestore';
import { db } from '../firebase';

const initialState = {
    habits: [],
    loading: false,
    error: null
};

const calculateStreak = (completedDates) => {
    if (!completedDates.length) return 0;

    const sortedDates = [...completedDates].sort();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // If not completed today or yesterday, streak is 0
    if (!completedDates.includes(today) && !completedDates.includes(yesterday)) {
        return 0;
    }

    let currentStreak = 1;
    let date = new Date(sortedDates[sortedDates.length - 1]);

    // Count backwards from the last completion
    while (currentStreak < sortedDates.length) {
        const previousDate = new Date(date.getTime() - 86400000).toISOString().split('T')[0];
        if (!completedDates.includes(previousDate)) break;
        currentStreak++;
        date = new Date(previousDate);
    }

    return currentStreak;
};

const canIncrementStreak = (lastIncrementTime) => {
    if (!lastIncrementTime) return true;

    const now = new Date().getTime();
    const last = new Date(lastIncrementTime).getTime();
    const hoursSinceLastIncrement = (now - last) / (1000 * 60 * 60);

    return hoursSinceLastIncrement >= 24;
};

// Thunks for async operations with Firebase
export const fetchHabits = createAsyncThunk(
    'habits/fetchHabits',
    async (userId, { rejectWithValue }) => {
        try {
            const habitsRef = collection(db, 'habits');
            const q = query(habitsRef, where('userId', '==', userId));
            const querySnapshot = await getDocs(q);

            const habits = [];
            querySnapshot.forEach((doc) => {
                habits.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return habits;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addHabitToFirebase = createAsyncThunk(
    'habits/addHabitToFirebase',
    async ({ name, userId }, { rejectWithValue }) => {
        try {
            const newHabit = {
                name,
                userId,
                streak: 0,
                completedDates: [],
                createdAt: new Date().toISOString(),
                bestStreak: 0,
                lastIncrementTime: null,
            };

            const docRef = await addDoc(collection(db, 'habits'), newHabit);
            return {
                id: docRef.id,
                ...newHabit
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateHabitInFirebase = createAsyncThunk(
    'habits/updateHabitInFirebase',
    async (habit, { rejectWithValue }) => {
        try {
            const habitRef = doc(db, 'habits', habit.id);
            const { id, ...habitData } = habit;
            await updateDoc(habitRef, habitData);
            return habit;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteHabitFromFirebase = createAsyncThunk(
    'habits/deleteHabitFromFirebase',
    async (id, { rejectWithValue }) => {
        try {
            await deleteDoc(doc(db, 'habits', id));
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const habitSlice = createSlice({
    name: 'habits',
    initialState,
    reducers: {
        // Local reducers kept for compatibility
        addHabit: (state, action) => {
            const newHabit = {
                id: crypto.randomUUID(),
                name: action.payload.name,
                userId: action.payload.userId,
                streak: 0,
                completedDates: [],
                createdAt: new Date().toISOString(),
                bestStreak: 0,
                lastIncrementTime: null,
            };
            state.habits.push(newHabit);
        },
        toggleHabit: (state, action) => {
            const habit = state.habits.find(h => h.id === action.payload.id);
            if (habit) {
                const today = new Date().toISOString().split('T')[0];
                const hasCompletedToday = habit.completedDates.includes(today);

                if (hasCompletedToday) {
                    habit.completedDates = habit.completedDates.filter(date => date !== today);
                } else {
                    habit.completedDates.push(today);
                }

                habit.streak = calculateStreak(habit.completedDates);
                habit.bestStreak = Math.max(habit.bestStreak, habit.streak);
            }
        },
        incrementStreak: (state, action) => {
            const habit = state.habits.find(h => h.id === action.payload.id);
            if (habit && canIncrementStreak(habit.lastIncrementTime)) {
                habit.streak += 1;
                habit.bestStreak = Math.max(habit.bestStreak, habit.streak);
                habit.lastIncrementTime = new Date().toISOString();

                // Add today's date to completed dates if not already present
                const today = new Date().toISOString().split('T')[0];
                if (!habit.completedDates.includes(today)) {
                    habit.completedDates.push(today);
                }
            }
        },
        deleteHabit: (state, action) => {
            state.habits = state.habits.filter(habit => habit.id !== action.payload.id);
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch habits
            .addCase(fetchHabits.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHabits.fulfilled, (state, action) => {
                state.loading = false;
                state.habits = action.payload;
            })
            .addCase(fetchHabits.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add habit
            .addCase(addHabitToFirebase.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addHabitToFirebase.fulfilled, (state, action) => {
                state.loading = false;
                state.habits.push(action.payload);
            })
            .addCase(addHabitToFirebase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update habit
            .addCase(updateHabitInFirebase.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateHabitInFirebase.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.habits.findIndex(h => h.id === action.payload.id);
                if (index !== -1) {
                    state.habits[index] = action.payload;
                }
            })
            .addCase(updateHabitInFirebase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete habit
            .addCase(deleteHabitFromFirebase.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteHabitFromFirebase.fulfilled, (state, action) => {
                state.loading = false;
                state.habits = state.habits.filter(habit => habit.id !== action.payload);
            })
            .addCase(deleteHabitFromFirebase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { addHabit, toggleHabit, deleteHabit, incrementStreak } = habitSlice.actions;
export default habitSlice.reducer;