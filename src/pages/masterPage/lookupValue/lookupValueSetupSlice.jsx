import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listData: [],
    listAllLookupValue: [],
};

const lookupValueSetupSlice = createSlice({
    name: 'lookupValueSetup',
    initialState,
    reducers:{
        setResetLookupValueSetupState: () => initialState,
        setListData(state, action){
            state.listData = action.payload
        },
        setListAllLookupValue(state, action){
            state.listAllLookupValue = action.payload
        }
    }
})

export const { setResetLookupValueSetupState, setListData, setListAllLookupValue } = lookupValueSetupSlice.actions;

export default lookupValueSetupSlice.reducer;