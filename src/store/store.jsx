import { configureStore } from '@reduxjs/toolkit'
import habitReducer from './habitSlice'
import authReducer from './authSlice'
import leaderboardReducer from './leaderboardSlice'
import userReducer from './userSlice'

export const store = configureStore({
    reducer: {
        habits: habitReducer,
        auth: authReducer,
        leaderboard: leaderboardReducer,
        users: userReducer,
    },
})