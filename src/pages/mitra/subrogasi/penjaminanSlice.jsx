import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listData: [],
    typePenjaminan: [],
};

const penjaminanSlice = createSlice({
    name: 'penjaminan',
    initialState,
    reducers:{
        setResetPenjaminanState: () => initialState,
        setListData(state, action){
            state.listData = action.payload
        },
        setTypePenjaminan(state, action){
            let data = []
            if(action.payload){
                if(action.payload.length > 0){
                    data = action.payload.map((item)=>{
                        return {value: item.CODE_ID, label: item.SHORT_DESC}
                    })
                }
            }
            state.typePenjaminan = data
        }
    }
})

export const { setResetPenjaminanState, setListData, setTypeRoom } = penjaminanSlice.actions;

export default roomSlice.reducer;