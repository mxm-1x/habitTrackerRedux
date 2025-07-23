import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const initialState = {
    habits: [],
    loading: false,
    error: null
};

export const addHabit = createAsyncThunk(
    'habits/addHabit',
    async ({ name, userId }, { rejectWithValue }) => {
        try {
            const docRef = await addDoc(collection(db, 'habits'), {
                name,
                userId,
                createdAt: new Date().toISOString(),
                currentStreak: 0,
                lastCompletedDate: null
            });
            return { id: docRef.id, name, userId, currentStreak: 0, lastCompletedDate: null };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchHabits = createAsyncThunk(
    'habits/fetchHabits',
    async (userId, { rejectWithValue }) => {
        try {
            const q = query(collection(db, 'habits'), where('userId', '==', userId));
            const querySnapshot = await getDocs(q);
            const habits = [];
            querySnapshot.forEach((doc) => {
                habits.push({ id: doc.id, ...doc.data() });
            });
            return habits;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const incrementStreak = createAsyncThunk(
    'habits/incrementStreak',
    async ({ habitId, currentStreak }, { rejectWithValue }) => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const habitRef = doc(db, 'habits', habitId);
            const newStreak = (currentStreak || 0) + 1;
            await updateDoc(habitRef, {
                currentStreak: newStreak,
                lastCompletedDate: today
            });
            return { id: habitId, currentStreak: newStreak, lastCompletedDate: today };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const habitSlice = createSlice({
    name: 'habits',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addHabit.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addHabit.fulfilled, (state, action) => {
                state.loading = false;
                state.habits.push(action.payload);
            })
            .addCase(addHabit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
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
            .addCase(incrementStreak.fulfilled, (state, action) => {
                const idx = state.habits.findIndex(h => h.id === action.payload.id);
                if (idx !== -1) {
                    state.habits[idx].currentStreak = action.payload.currentStreak;
                    state.habits[idx].lastCompletedDate = action.payload.lastCompletedDate;
                }
            });
    }
});

export default habitSlice.reducer;