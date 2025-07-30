import { createSlice } from "@reduxjs/toolkit";
import resetPasswordSlice from "../resetPassword/resetPasswordSlice";

const initialState = {
    listData: [],
    //typeRoom: [],
};

const resendEmailforResetPasswordMitraSlice = createSlice({
    name: 'resend-email',
    initialState,
    reducers:{
        setResendEmailPasswordState: () => initialState,
        setListData(state, action){
            state.listData = action.payload
        },        
    }
})

export const { setResendEmailPasswordState, setListData } = resendEmailforResetPasswordMitraSlice.actions;

export default resetPasswordSlice.reducer;