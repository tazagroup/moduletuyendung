import { createSlice } from '@reduxjs/toolkit';

const candidatesSlice = createSlice({
    name: 'candidates',
    initialState: {
        dataCandidate: [],
        flagDataCandidate: [],
        dashboardCandidate: [],
        flagCandidate: {},
        reason: [
            { id: 1, Thuoctinh: "Kĩ năng không tốt" },
            { id: 2, Thuoctinh: "Thái độ không tốt" },
            { id: 3, Thuoctinh: "Hình thức không tốt" },
            { id: 4, Thuoctinh: "Không liên lạc được" },
        ],
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
            state.dataCandidate.push(attributes)
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
            const index = flag.indexOf(action.payload.key)
            const index2 = flag2.indexOf(action.payload.key)
            //REMOVE
            state.dataCandidate.splice(index, 1)
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
