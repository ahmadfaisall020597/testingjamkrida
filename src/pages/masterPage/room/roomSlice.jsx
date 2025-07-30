import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listData: [],
    typeRoom: [],
};

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers:{
        setResetRoomState: () => initialState,
        setListData(state, action){
            state.listData = action.payload
        },
        setTypeRoom(state, action){
            let data = []
            if(action.payload){
                if(action.payload.length > 0){
                    data = action.payload.map((item)=>{
                        return {value: item.CODE_ID, label: item.SHORT_DESC}
                    })
                }
            }
            state.typeRoom = data
        }
    }
})

export const { setResetRoomState, setListData, setTypeRoom } = roomSlice.actions;

export default roomSlice.reducer;