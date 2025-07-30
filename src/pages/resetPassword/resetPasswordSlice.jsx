import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listData: [],
    //typeRoom: [],
};

const resetPasswordMitraSlice = createSlice({
    name: 'reset-password',
    initialState,
    reducers:{
        setResetPasswordState: () => initialState,
        setListData(state, action){
            state.listData = action.payload
        },
        
    }
})

export const { setResetPasswordState, setListData } = resetPasswordMitraSlice.actions;

export default userMitraSlice.reducer;