import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listData: []
};

const productPackageSlice = createSlice({
    name: 'productPackage',
    initialState,
    reducers:{
        setResetProductPackageState: () => initialState,
        setListData(state, action){
            state.listData = action.payload
        },
    }
})

export const { setResetProductPackageState, setListData } = productPackageSlice.actions;

export default productPackageSlice.reducer;