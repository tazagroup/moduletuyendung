import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLogin: false,
    },
    reducers: {
        handleLogin: (state) => {
            state.isLogin = true
        }
    },
});

export const { handleLogin } = userSlice.actions;

export default userSlice.reducer;
