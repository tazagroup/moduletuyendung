import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'
export const fetchCandidates = createAsyncThunk(
    'candidates/fetchCandidates',
    async (data, thunkAPI) => {
        const response = await axios.get("https://6195d82474c1bd00176c6ede.mockapi.io/Candidate")
        return response.data
    }
)

const candidatesSlice = createSlice({
    name: 'candidates',
    initialState: {
        loading: false,
        dataCandidate: []
    },
    reducers: {
        setDataCandidate: (state, action) => {
            state.dataCandidate = action.payload
        },
        updateCandidate: (state, action) => {
            const { key: id } = action.payload
            const index = state.dataCandidate.findIndex(item => item.key === id)
            state.dataCandidate[index] = action.payload
        }
    },
    extraReducers: {
        [fetchCandidates.pending]: (state) => {
            state.loading = true;
        },
        [fetchCandidates.fulfilled]: (state, action) => {
            state.loading = false;
            state.dataCandidate = action.payload.map(({ id: key, ...item }, index) => ({
                id: index,
                key,
                ...item,
            }))
        },
    }
});

export const { setDataCandidate, updateCandidate } = candidatesSlice.actions;

export default candidatesSlice.reducer;
