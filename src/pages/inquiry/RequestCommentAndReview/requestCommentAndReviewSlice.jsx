import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listData: [],
    listStar: [
      {value: 0, label: "0 Star"},
      {value: 1, label: "1 Star"},
      {value: 2, label: "2 Stars"},
      {value: 3, label: "3 Stars"},
      {value: 4, label: "4 Stars"},
      {value: 5, label: "5 Stars"},
    ],
};

const requestCommentAndReviewSlice = createSlice({
    name: 'requestCommentAndReview',
    initialState,
    reducers:{
        setResetRequestCommentAndReviewSlicetState: () => initialState,
        setListData(state, action){
            state.listData = action.payload
        },
    }
})

export const { setResetRequestCommentAndReviewSlicetState, setListData } = requestCommentAndReviewSlice.actions;

export default requestCommentAndReviewSlice.reducer;