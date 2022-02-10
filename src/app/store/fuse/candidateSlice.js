import { createSlice } from '@reduxjs/toolkit';

const candidatesSlice = createSlice({
    name: 'candidates',
    initialState: {
        dataCandidate: [],
        flagDataCandidate: [],
        dashboardCandidate: [],
        flagCandidate: {},
    },
    reducers: {
        setDataCandidate: (state, action) => {
            const { main, dashboard } = action.payload
            state.dataCandidate = main.sort((a, b) => new Date(b.Ngaytao) - new Date(a.Ngaytao)).map(({ id: key, ...item }, index) => ({
                id: index,
                key,
                ...item,
            }))
            state.dashboardCandidate = dashboard.map(({ id: key, ...item }, index) => ({
                id: index,
                key,
                ...item,
            }))
            state.flagDataCandidate = [...state.dataCandidate].sort((a, b) => new Date(b.Ngaytao) - new Date(a.Ngaytao))
        },
        addCandidate: (state, action) => {
            const { attributes } = action.payload
            const flagDashboard = { ...attributes }
            attributes['key'] = attributes.id
            attributes['id'] = state.dataCandidate.length == 0 ? 0 : state.dataCandidate.length
            state.dataCandidate.unshift(attributes)
            state.dataCandidate = state.dataCandidate.map((item, index) => {
                delete item.id
                return {
                    id: index,
                    ...item
                }
            })
            state.flagDataCandidate = [...state.dataCandidate].sort((a, b) => new Date(b.Ngaytao) - new Date(a.Ngaytao))
            flagDashboard['key'] = attributes.id
            flagDashboard['id'] = state.dashboardCandidate.length == 0 ? 0 : state.dashboardCandidate.length
            state.dashboardCandidate.push(flagDashboard)
        },
        updateCandidate: (state, action) => {
            const { attributes } = action.payload
            const index = state.dataCandidate.findIndex(item => item.key === attributes.id)
            const flag = {
                ...state.dataCandidate[`${index}`],
                ...attributes
            }
            delete flag.id
            flag.id = state.dataCandidate[`${index}`].id
            state.dataCandidate[`${index}`] = {
                ...flag,
                Profile: attributes['Profile'],
                XacnhanHS: attributes['XacnhanHS'],
                Trangthai: attributes['Trangthai']
            }
        },
        updateFlagCandidate: (state, action) => {
            state.flagCandidate = {
                ...action.payload,
            };
        },
        removeCandidate: (state, action) => {
            const flag = state.dataCandidate.map(item => item.key)
            const flag2 = state.dashboardCandidate.map(item => item.key)
            const index = flag.indexOf(action.payload.id)
            const index2 = flag2.indexOf(action.payload.id)
            //REMOVE
            state.dataCandidate.splice(index, 1)
            state.dataCandidate = state.dataCandidate.map((item, index) => {
                delete item.id
                return {
                    id: index,
                    ...item,
                }
            })
            //REMOVE FROM DASHBOARD
            state.dashboardCandidate.splice(index2, 1)
        },
        refreshDataCandidate: (state, action) => {
            state.dataCandidate = action.payload
        }
    },
});

export const { setDataCandidate, updateCandidate, updateFlagCandidate, addCandidate, refreshDataCandidate, removeCandidate } = candidatesSlice.actions;

export default candidatesSlice.reducer;
