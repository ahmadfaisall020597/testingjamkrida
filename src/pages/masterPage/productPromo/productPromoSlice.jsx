import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listData: []
};

const productPromoSlice = createSlice({
    name: 'productPromo',
    initialState,
    reducers:{
        setResetProductPromoState: () => initialState,
        setListData(state, action){
            state.listData = action.payload
        },
    }
})

export const { setResetProductPromoState, setListData } = productPromoSlice.actions;

export default productPromoSlice.reducer;