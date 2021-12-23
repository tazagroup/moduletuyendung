import { createSlice } from '@reduxjs/toolkit';


const candidatesSlice = createSlice({
    name: 'candidates',
    initialState: {
        dataCandidate: [],
        flagCandidate: {},
    },
    reducers: {
        setDataCandidate: (state, action) => {
            const { data } = action.payload
            const flagArray = data.map(item => item.attributes)
            state.dataCandidate = flagArray.map(({ id: key, ...item }, index) => ({
                id: index,
                key,
                ...item,
            }))
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
        }
    },
});

export const { setDataCandidate, updateCandidate, updateFlagCandidate, addCandidate } = candidatesSlice.actions;

export default candidatesSlice.reducer;
