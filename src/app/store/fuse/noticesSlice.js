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
        updateNotice: (state, action) => {
            const index = state.dataNotice.findIndex(item => item.id == action.payload.attributes.id)
            state.dataNotice[index] = action.payload
        },
        hideNotice: (state, action) => {
            const index = state.dataNotice.findIndex(item => item.id == action.payload)
            state.dataNotice.splice(index, 1)
        }
    },
});

export const { setDataNotice, updateNotice, hideNotice } = noticesSlice.actions;

export default noticesSlice.reducer;
