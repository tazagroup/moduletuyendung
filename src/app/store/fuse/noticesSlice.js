import { createSlice } from '@reduxjs/toolkit';

const noticesSlice = createSlice({
    name: 'notices',
    initialState: {
        dataNotice: [],
    },
    reducers: {
        setDataNotice: (state, action) => {
            state.dataNotice = action.payload
        },
    },
});

export const { setDataNotice } = noticesSlice.actions;

export default noticesSlice.reducer;
