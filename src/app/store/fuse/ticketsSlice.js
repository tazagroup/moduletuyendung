import { createSlice } from '@reduxjs/toolkit';



const ticketsSlice = createSlice({
    name: 'tickets',
    initialState: {
        dataTicket: [],
        position: [],
        users:[],
        isLoading: true,
    },
    reducers: {
        setDataTicket: (state, action) => {
            const { data, position, users } = action.payload
            const flagArray = data.map(item => item.attributes)
            state.dataTicket = flagArray.map(({ id: key, ...item }, index) => ({
                id: index,
                key,
                ...item,
            })).slice(0, 1)
            state.position = JSON.parse(position);
            state.users = users;
        },
        updateTicket: (state, action) => {
            const { attributes } = action.payload
            const index = state.dataTicket.findIndex(item => item.key === attributes.id)
            state.dataTicket[`${index}`] = {
                ...state.dataTicket[`${index}`],
                Pheduyet: attributes['Pheduyet']
            }
        }
    },
});

export const { setDataTicket, updateTicket } = ticketsSlice.actions;

export default ticketsSlice.reducer;