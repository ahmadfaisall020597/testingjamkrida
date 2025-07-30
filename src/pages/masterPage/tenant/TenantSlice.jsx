import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listData: [],
    listProduct: [],
    listPackage: [],
    listUser: [],
    listRegisteredUser: [],
    listRegisteredCourier: [],
    showModal: false,
};

const tenantSlice = createSlice({
    name: 'tenant',
    initialState,
    reducers:{
        setResetTenantState: () => initialState,
        setListData(state, action){
            state.listData = action.payload
        },
        setListProduct(state, action){
            state.listProduct = action.payload
        },
        setListPackage(state, action){
            state.listPackage = action.payload
        },
        setListUser(state, action){
            state.listUser = action.payload
        },
        setListRegisteredUser(state, action){
            state.listRegisteredUser = action.payload
        },
        setListRegisteredCourier(state, action){
            state.listRegisteredCourier = action.payload
        },
        setShowModal(state, action){
            state.showModal = action.payload
        }
    }
})

export const { 
    setResetTenantState, 
    setListData, 
    setListProduct, 
    setListPackage, 
    setListUser, 
    setListRegisteredUser,
    setListRegisteredCourier,
    setShowModal 
} = tenantSlice.actions;

export default tenantSlice.reducer;