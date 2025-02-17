import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    habits: [],
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

export const habitSlice = createSlice({
    name: 'habits',
    initialState,
    reducers: {
        addHabit: (state, action) => {
            const newHabit = {
                id: crypto.randomUUID(),
                name: action.payload.name,
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
});

export const { addHabit, toggleHabit, deleteHabit, incrementStreak } = habitSlice.actions;
export default habitSlice.reducer;