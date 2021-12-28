import { createSlice } from '@reduxjs/toolkit';
import { ConvertPermissionArray } from './../../main/utils/index'
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
            console.log(action.payload)
            state.dataTicket = action.payload
        },
        setDataTicket: (state, action) => {
            const user = JSON.parse(localStorage.getItem("profile"))
            const { data, position, users } = action.payload
            const flagArray = data.map(item => item.attributes)
            state.dataTicket = flagArray.map(({ id: key, ...item }, index) => ({
                id: index,
                key,
                ...item,
            }))
            state.position = JSON.parse(position);
            state.users = users;
            //Hidden to need approve
            const firstConditionArray = state.dataTicket.filter(opt => {
                const approveArray = JSON.parse(opt.Pheduyet)
                const result = [].concat.apply([], approveArray.map(item => item.Nguoiduyet))
                return [...new Set(result)].includes(user.profile.id)
            })
            //Hidden to position
            const secondConditionArray = ConvertPermissionArray(state.dataTicket, 'Vitri')
            const flag = [].concat.apply(firstConditionArray, secondConditionArray)
            const result = [...new Map(flag.map((item, key) => [item['key'], item])).values()].map(({ id, ...item }, index) => ({
                ...item,
                id: index
            }))
            state.dataTicket = [...result]
            state.flagTicket = [...state.dataTicket]
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
