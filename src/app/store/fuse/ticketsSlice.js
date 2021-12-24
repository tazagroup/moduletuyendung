import { createSlice } from '@reduxjs/toolkit';

const ticketsSlice = createSlice({
    name: 'tickets',
    initialState: {
        dataTicket: [],
        flagTicket: [],
        position: [],
        users: [],
        isLoading: true,
    },
    reducers: {
        addTicket: (state, action) => {
            const { attributes } = action.payload
            attributes['key'] = attributes.id
            attributes['id'] = state.dataTicket.length == 0 ? 0 : state.dataTicket.length
            state.dataTicket.push(attributes)
        },
        refreshTicket: (state, action) => {
            state.dataTicket = action.payload
        },
        setDataTicket: (state, action) => {
            const { data, position, users } = action.payload
            const flagArray = data.map(item => item.attributes)
            state.dataTicket = flagArray.map(({ id: key, ...item }, index) => ({
                id: index,
                key,
                ...item,
            }))
            state.flagTicket = state.dataTicket
            state.position = JSON.parse(position);
            state.users = users;
        },
        updateTicket: (state, action) => {
            const { attributes } = action.payload
            const index = state.dataTicket.findIndex(item => item.key === attributes.id)
            const flag = {
                ...state.dataTicket[`${index}`],
                ...attributes
            }
            delete flag.id
            flag.id = state.dataTicket[`${index}`].id
            state.dataTicket[`${index}`] = {
                ...flag,
                Pheduyet: attributes['Pheduyet']
            }
        }
    },
});

export const { addTicket, refreshTicket, setDataTicket, updateTicket } = ticketsSlice.actions;

export default ticketsSlice.reducer;
