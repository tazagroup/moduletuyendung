import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        profile: {},
    },
    reducers: {
        handleSetInfo: (state, action) => {
            state.profile = action.payload
        }
    },
});

export const { handleSetInfo } = userSlice.actions;

export default userSlice.reducer;
