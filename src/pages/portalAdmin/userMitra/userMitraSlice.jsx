import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listData: [],
    //typeRoom: [],
};

const userMitraSlice = createSlice({
    name: 'user-mitra',
    initialState,
    reducers:{
        setResetUserMitraState: () => initialState,
        setListData(state, action){
            state.listData = action.payload
        },
        // setTypeRoom(state, action){
        //     let data = []
        //     if(action.payload){
        //         if(action.payload.length > 0){
        //             data = action.payload.map((item)=>{
        //                 return {value: item.CODE_ID, label: item.SHORT_DESC}
        //             })
        //         }
        //     }
        //     state.typeRoom = data
        // }
    }
})

export const { setResetUserMitraState, setListData } = userMitraSlice.actions;

export default userMitraSlice.reducer;