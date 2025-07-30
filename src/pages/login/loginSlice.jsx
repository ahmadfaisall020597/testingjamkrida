import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	listData: [],
	//typeRoom: [],
	maxFailedLogin: null,
	failedLoginSuspended: null,
    resentOTP: null
};

const loginSlice = createSlice({
	name: "login",
	initialState,
	reducers: {
		setResetLoginState: () => initialState,
		setListData(state, action) {
			state.listData = action.payload;
		},
		setListGeneralSettings(state, action) {
            const { maxFailedLogin, failedLoginSuspended } = action.payload
			state.maxFailedLogin = maxFailedLogin
			state.failedLoginSuspended = failedLoginSuspended
		},
        setResentLoginOTPState: (state,action) => {
            state.resentOTP = action.payload
        },
		resetResentLoginOTPState: (state) => {
			state.resentOTP = null;
		},
	}
});

export const { setResetLoginState, setListData, setListGeneralSettings,setResentLoginOTPState,resetResentLoginOTPState } = loginSlice.actions;

export default loginSlice.reducer;
