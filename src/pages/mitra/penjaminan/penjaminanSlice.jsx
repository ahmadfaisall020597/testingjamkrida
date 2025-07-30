import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    listData: [],
    typePenjaminan: [],
    nikVerified: false,
    uploadLampiranList: [],
    listProduk: [],
    listPenjaminan: [],
    showPenjaminan: {},
    listPenjaminanProduct: [],
    searchCriteria: {},
    newDocument: []
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
        },
        setResetVerifyDukcapil(state){
            state.nikVerified = false;
        },
        setVerifyDukcapilResult(state, action){
            state.nikVerified = action.payload;
        },
        resetLampiranList(state){
            state.uploadLampiranList = [];
        },
        setLampiranResult(state, action){
            state.uploadLampiranList = action.payload;
        },
        setListPenjaminan(state, action) {
            state.listPenjaminan = action.payload;
        },
        setShowPenjaminan(state, action) {
            state.showPenjaminan = action.payload;
        },
        setListPenjaminanProduct(state, action) {
            state.listPenjaminanProduct = action.payload;
        },
        setLoading(state, action) {
            state.isLoading = action.payload;
        },
        resetListProduk(state) {
            state.listProduk = [];
        },
        setListProdukResult(state, action) {
            state.listProduk = action.payload;
        },
        setDocumentPenjaminan(state, action) {
            const { key, data } = action.payload;
            let foundDocument = state.newDocument.findIndex(doc => doc.key === key);
            if(foundDocument !== -1) {
                console.log("document found");
                state.newDocument[foundDocument].data = data;
            }
            else {
                console.log("document not found");
                state.newDocument.push({ key, data });
            }
            state.newDocument = state.newDocument.filter(item => item.data !== null);
        },
        resetDocumentPenjaminan(state){
            state.newDocument = [];
        }

    }
})

export const { setResetPenjaminanState, setListData, setResetVerifyDukcapil, setVerifyDukcapilResult, resetLampiranList, setLampiranResult, setListPenjaminan, setShowPenjaminan, setListPenjaminanProduct, setSearchCriteria, setLoading, resetListProduk, setListProdukResult, setDocumentPenjaminan, resetDocumentPenjaminan } = penjaminanSlice.actions;

export default penjaminanSlice.reducer;