import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'
export const fetchTickets = createAsyncThunk(
    'tickets/fetchTickets',
    async (data, thunkAPI) => {
        const response = await axios.get("https://6195d82474c1bd00176c6ede.mockapi.io/Tickets")
        return response.data
    }
)

const ticketsSlice = createSlice({
    name: 'tickets',
    initialState: {
        dataTicket: [],
        isLoading: false,
    },
    reducers: {
        setDataTicket: (state, action) => {
            state.dataTicket = action.payload
        }
    },
    extraReducers: {
        [fetchTickets.pending]: (state) => {
            state.isLoading = true
        },
        [fetchTickets.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.dataTicket = action.payload.map(({ id: key, ...item }, index) => ({
                id: index,
                key,
                ...item,
            }))
        },
    }
});

export const { setDataTicket } = ticketsSlice.actions;

export default ticketsSlice.reducer;
