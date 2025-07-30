import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listData: [],
    listPaymentMethod: [{value: "", label: "Choose One"}],
};

const orderHistoryListSlice = createSlice({
    name: 'orderHistoryList',
    initialState,
    reducers:{
        setResetOrderHistoryListState: () => initialState,
        setListData(state, action){
            state.listData = action.payload
        },
        setListPaymentMethod(state, action){
          let data = initialState.listPaymentMethod
          if(action.payload){
            if(action.payload.length > 0){
              const listPaymentMethodData = action.payload.map((item)=>{
                return {value: item.CODE_ID, label: item.SHORT_DESC}
              })
              data = [...data, ...listPaymentMethodData]
            }
          }
          state.listPaymentMethod = data
        }
    }
})

export const { setResetOrderHistoryListState, setListData, setListPaymentMethod } = orderHistoryListSlice.actions;

export default orderHistoryListSlice.reducer;