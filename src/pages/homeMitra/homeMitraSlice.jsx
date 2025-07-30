import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listData: []
};

const defaultSlice = createSlice({
    name: 'default',
    initialState,
    reducers:{
        setResetDefaultState: () => initialState,
        setListData(state, action){
            state.listData = action.payload
        },
    }
})

export const { setResetDefaultState, setListData } = defaultSlice.actions;

export default defaultSlice.reducer;