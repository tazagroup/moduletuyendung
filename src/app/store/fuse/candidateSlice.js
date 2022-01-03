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
            { id: 3, Thuoctinh: "Hình thức không tốt" }
        ],
    },
    reducers: {
        setDataCandidate: (state, action) => {
            const { main, dashboard } = action.payload
            state.dataCandidate = main.map(({ id: key, ...item }, index) => ({
                id: index,
                key,
                ...item,
            }))
            state.dashboardCandidate = dashboard.map(({ id: key, ...item }, index) => ({
                id: index,
                key,
                ...item,
            }))
            state.flagDataCandidate = state.dataCandidate
        },
        addCandidate: (state, action) => {
            const { attributes } = action.payload
            attributes['key'] = attributes.id
            attributes['id'] = state.dataCandidate.length == 0 ? 0 : state.dataCandidate.length
            state.dataCandidate.push(attributes)
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
        refreshDataCandidate: (state, action) => {
            state.dataCandidate = action.payload
        }
    },
});

export const { setDataCandidate, updateCandidate, updateFlagCandidate, addCandidate, refreshDataCandidate } = candidatesSlice.actions;

export default candidatesSlice.reducer;
