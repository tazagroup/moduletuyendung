import { createSlice } from '@reduxjs/toolkit';

const guidesSlice = createSlice({
    name: 'guides',
    initialState: {
        dataGuide: [],
        dataSetting: [],
        dataType: [],
        dataReason: []
    },
    reducers: {
        setDataGuide: (state, action) => {
            const flagArray = action.payload.map(item => item.attributes)
            state.dataGuide = [...flagArray]
        },
        setDataReason: (state, action) => {
            state.dataReason = action.payload
        },
        addDataGuide: (state, action) => {
            const flag = [...state.dataGuide]
            flag.push(action.payload)
            state.dataGuide = [...flag]
        },
        updateDataGuide: (state, action) => {
            const item = action.payload
            const index = state.dataGuide.map(item => item.id).indexOf(item.id)
            state.dataGuide[index] = action.payload
        },
        removeDataGuide: (state, action) => {
            const item = action.payload;
            const index = state.dataGuide.map(item => item.id).indexOf(item)
            state.dataGuide.splice(index, 1)
        },
        setDataSetting: (state, action) => {
            state.dataSetting = action.payload
        },
        setDataType: (state, action) => {
            state.dataType = action.payload
        }
    },
});

export const { setDataGuide, setDataSetting, setDataType, addDataGuide, updateDataGuide, removeDataGuide,setDataReason } = guidesSlice.actions;

export default guidesSlice.reducer;
