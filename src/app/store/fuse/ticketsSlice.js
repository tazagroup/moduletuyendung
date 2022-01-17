import { createSlice } from '@reduxjs/toolkit';
import { ConvertPermissionArray } from './../../main/utils/index'
const ticketsSlice = createSlice({
    name: 'tickets',
    initialState: {
        dashboardTicket: [],
        dataTicket: [],
        flagTicket: [],
        position: [],
        source: [],
        users: [],
        isLoading: true,
    },
    reducers: {
        addTicket: (state, action) => {
            const { attributes } = action.payload
            attributes['key'] = attributes.id
            state.dataTicket.unshift(attributes)
            state.dataTicket = state.dataTicket.map((item, index) => {
                delete item.id
                return {
                    id: index,
                    ...item
                }
            })
        },
        refreshTicket: (state, action) => {
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
            state.dashboardTicket = state.dataTicket
            state.position = JSON.parse(position);
            state.users = users;
            //Hidden to need approve
            const firstConditionArray = state.dataTicket.filter(opt => {
                const approveArray = JSON.parse(opt.Pheduyet)
                const result = [].concat.apply([], approveArray.map(item => item.Nguoiduyet))
                return [...new Set(result)].includes(user.profile.id) || opt.idTao == user.profile.id
            })
            //Hidden to position
            const secondConditionArray = ConvertPermissionArray(state.dataTicket, 'Vitri')
            const flag = [].concat.apply(firstConditionArray, secondConditionArray)
            let result = [...new Map(flag.map((item, key) => [item['key'], item])).values()].sort((a, b) => new Date(b['Ngaytao']) - new Date(a['Ngaytao']))
            result = result.map((item, index) => {
                delete item.id
                return {
                    id: index,
                    ...item,
                }
            })
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
        },
        removeTicket: (state, action) => {
            const flag = state.dataTicket.map(item => item.key)
            const flag2 = state.dashboardTicket.map(item => item.key)
            const index = flag.indexOf(action.payload.key)
            const index2 = flag2.indexOf(action.payload.key)
            //REMOVE
            state.dataTicket.splice(index, 1)
            state.dataTicket = state.dataTicket.map((item, index) => {
                delete item.id
                return {
                    id: index,
                    ...item
                }
            })
            state.flagTicket = [...state.dataTicket]
            //REMOVE FROM DASHBOARD
            state.dashboardTicket.splice(index2, 1)
        },
        setSource: (state, action) => {
            const { attributes } = action.payload
            state.source = JSON.parse(attributes.Dulieu)
        }
    },
});

export const { addTicket, refreshTicket, setDataTicket, updateTicket, setSource, removeTicket } = ticketsSlice.actions;

export default ticketsSlice.reducer;
