import { createSlice } from '@reduxjs/toolkit';


const candidatesSlice = createSlice({
    name: 'candidates',
    initialState: {
        dataCandidate: []
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
            attributes['id'] = state.dataTicket.length + 1
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
                Profile: attributes['Profile']
            }
        }
    },
});

export const { setDataCandidate, updateCandidate, addCandidate } = candidatesSlice.actions;

export default candidatesSlice.reducer;
