import { createSlice } from '@reduxjs/toolkit';



const ticketsSlice = createSlice({
    name: 'tickets',
    initialState: {
        dataTicket: [],
        position: [],
        isLoading: true,
    },
    reducers: {
        setDataTicket: (state, action) => {
            const { data, position } = action.payload
            const flagArray = data.map(item => item.attributes)
            state.dataTicket = flagArray.map(({ id: key, ...item }, index) => ({
                id: index,
                key,
                ...item,
            })).slice(19, 21)
            state.position = position;
        },
        updateTicket: (state, action) => {
            const { attributes } = action.payload
            const index = state.dataTicket.findIndex(item => item.key === attributes.id)
            console.log(index)
            state.dataTicket[`${index}`] = {
                ...state.dataTicket[`${index}`],
                Pheduyet: attributes['Pheduyet']
            }
        }
    },
});

export const { setDataTicket, updateTicket } = ticketsSlice.actions;

export default ticketsSlice.reducer;
