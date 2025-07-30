import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listData: [],
    typeProduct: [{value: "", label: "All"}],
    categoryProduct: [{value: "", label: "All"}],
    priceStatusProduct: [{value: "", label: "All"}],
    classProduct: [{value: "", label: "All"}],
    addOnProduct: [{value: "", label: ""}],
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers:{
        setResetProductState: () => initialState,
        setListData(state, action){
            state.listData = action.payload
        },
        setTypeProduct(state, action){
            let data = initialState.typeProduct
            if(action.payload){
                if(action.payload.length > 0){
                    const addOnData = action.payload.map((item)=>{
                        return {value: item.CODE_ID, label: item.SHORT_DESC}
                    })
                    data = [...data, ...addOnData]
                }
            }
            state.typeProduct = data
        },
        setCategoryProduct(state, action){
            let data = initialState.categoryProduct
            if(action.payload){
                if(action.payload.length > 0){
                    const addOnData = action.payload.map((item)=>{
                        return {value: item.CODE_ID, label: item.SHORT_DESC}
                    })
                    data = [...data, ...addOnData]
                }
            }
            state.categoryProduct = data
        },
        setPriceStatusProduct(state, action){
            let data = initialState.priceStatusProduct
            if(action.payload){
                if(action.payload.length > 0){
                    const addOnData = action.payload.map((item)=>{
                        const parseDesc = (desc) => {
                            if (!desc) return { textColor: "black", bgColor: "white" }; // Default jika tidak ada desc
                        
                            // Regex untuk mencari nilai textColor dan bgColor
                            const textColorMatch = desc.match(/textColor:\s*['"]?([^,'"]+)['"]?/);
                            const bgColorMatch = desc.match(/bgColor:\s*['"]?([^,'"]+)['"]?/);
                        
                            return {
                                textColor: textColorMatch ? textColorMatch[1] : "black",
                                bgColor: bgColorMatch ? bgColorMatch[1] : "white"
                            };
                        };

                        return {value: item.CODE_ID, label: item.SHORT_DESC, desc: parseDesc(item.DESC)}
                    })
                    data = [...data, ...addOnData]
                }
            }
            state.priceStatusProduct = data
        },
        setClassProduct(state, action){
            let data = initialState.classProduct
            if(action.payload){
                if(action.payload.length > 0){
                    const addOnData = action.payload.map((item)=>{
                        return {value: item.CODE_ID, label: item.SHORT_DESC}
                    })
                    data = [...data, ...addOnData]
                }
            }
            state.classProduct = data
        },
        setAddonProduct(state, action){
            let data = initialState.addOnProduct
            if(action.payload){
                if(action.payload.length > 0){
                    const addOnData = action.payload.map((item)=>{
                        return {value: item.CODE_ID, label: item.SHORT_DESC}
                    })
                    data = [...data, ...addOnData]
                }
            }
            state.addOnProduct = data
        }
    }
})

export const { setResetProductState, setListData, setTypeProduct, setCategoryProduct, setPriceStatusProduct, setClassProduct, setAddonProduct } = productSlice.actions;

export default productSlice.reducer;