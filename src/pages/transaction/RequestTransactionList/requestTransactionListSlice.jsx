import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: {},
    formData: {}
}

const requestTransactionListSlice = createSlice({
    name: 'requestTransactionList',
    initialState,
    reducers:{
        setResetRequestTransactionListState: () => initialState,
        setData(state, action){
            state.data = action.payload
        },
        setFormData(state, action){
            state.formData = {...state.formData, [action.payload.key]: action.payload.value}
        }
    }
})

export const { setResetRequestTransactionListState, setData, setFormData } = requestTransactionListSlice.actions;

export default requestTransactionListSlice.reducer;