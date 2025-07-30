import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listData: [],
    defaultData: {
        DELIVERY_DAYS: "3",
        DELIVERY_HOURS: "",
        MIN_ORDER: "0",
        CANCEL_ORDER_FLAG: true
    },
    showModal: false,
    needReloadPage: false
};

const oneTimeSetupSlice = createSlice({
    name: 'oneTimeSetup',
    initialState,
    reducers:{
        setResetOneTimeSetupState: () => initialState,
        setListData(state, action){
            state.listData = action.payload
        },
        setDefaultData(state, action){
            const data = action.payload
            state.defaultData = data
        },
        setShowModal(state, action){
            state.showModal = action.payload
        },
        setNeedReloadPage(state, action){
            state.needReloadPage = action.payload
        }
    }
})

export const { setResetOneTimeSetupState, setListData, setDefaultData, setShowModal, setNeedReloadPage } = oneTimeSetupSlice.actions;

export default oneTimeSetupSlice.reducer;