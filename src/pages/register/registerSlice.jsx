import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listData: []
};

const registerSlice = createSlice({
    name: 'register',
    initialState,
    reducers:{
        setResetRegisterState: () => initialState,
        setListData(state, action){
            state.listData = action.payload
        },
    
    }
})

export const { setResetRegisterState, setListData } = registerSlice.actions;

export default registerSlice.reducer;