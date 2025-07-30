import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import { removeProductionSelectionDataDraft, saveOrderEditOrViewDataDraft, saveOrderSummaryDataDraft, saveProductionSelectionDataDraft, saveRoomSelectionDataDraft, saveTenantSelectionDataDraft } from "src/utils/localStorage";
import { objectRoomSelection, objectTenantSelection } from "./newFunctionRequestFn";

const initialState = {
    listData: [],
    requestType: [{value: "", label: "All"}],
    statusOrder: [{value: "", label: "All"}],
    deliveryType: [{value: "", label:""}],
    stepNameComponent: "RoomSelection",
    roomListData:[],
    tenantListData:[],
    roomSelectionData: {},
    tenantSelectionData: {},
    productSelectionData: {},
    orderSummaryData: {},
    orderEditOrViewData: null,
    showModalUploadBulk: false,
    bulkStepNameComponent: "DetailBulk",
    bulkListData: [],
    bulkProductionSelectionData: [],
    bulkOrderSummaryData:[],
    bulkRoomTeamsData: [],
    bulkRoomNonTeamsData:[]
};

const newFunctionRequestSlice = createSlice({
    name: 'newFunctionRequest',
    initialState,
    reducers:{
      setResetNewFunctionRequestState: () => initialState,
      setResetFunctionRequestState: (state)=>{
        state.roomSelectionData = initialState.roomSelectionData
        state.tenantListData = initialState.tenantListData
        state.productSelectionData = initialState.productSelectionData
        state.orderSummaryData = initialState.orderSummaryData
        state.bulkListData = initialState.bulkListData
        state.bulkProductionSelectionData = initialState.bulkProductionSelectionData
        state.bulkOrderSummaryData = initialState.bulkOrderSummaryData
      },
      setListData(state, action){
          state.listData = action.payload
      },
      setRequestType(state, action){
        let data = initialState.requestType
        if(action.payload){
            if(action.payload.length > 0){
                const requestTypeData = action.payload.map((item)=>{
                    return {value: item.CODE_ID, label: item.SHORT_DESC}
                })
                data = [...data, ...requestTypeData]
            }
        }
        state.requestType = data
      },
      setStatusOrder(state, action){
        let data = initialState.statusOrder
        if(action.payload){
          if(action.payload.length > 0){
            const statusOrderData = action.payload.map((item)=>{
              return {value: item.CODE_ID, label: item.SHORT_DESC}
            })
            data = [...data, ...statusOrderData]
          }
        }
        state.statusOrder = data
      },
      setDeliveryType(state, action){
        let data = initialState.deliveryType
        if(action.payload){
          if(action.payload.length > 0){
            const statusOrderData = action.payload.map((item)=>{
              return {value: item.CODE_ID, label: item.SHORT_DESC}
            })
            data = statusOrderData
          }
        }
        state.deliveryType = data
      },
      setStepNameComponent(state, action){
        state.stepNameComponent = action.payload
      },
      setResetStepNameComponent(state){
        state.stepNameComponent = initialState.stepNameComponent
      },
      setRoomSelectionData(state, action){
        state.roomSelectionData = {
          ...state.roomSelectionData,
          [action.payload.key]: action.payload.value
        }
        saveRoomSelectionDataDraft(state.roomSelectionData)
      },
      setResetRoomSelectionData(state){
        state.roomSelectionData = initialState.roomSelectionData
      },
      setRoomListData(state, action){
        let uniqBy = "ROOM_ID"
        if(state.roomSelectionData){
          if(!state.roomSelectionData?.[objectRoomSelection[3]]){
            uniqBy = "ROOM_UNIQ"
          }
        }
        const uniqueRooms = _.uniqBy([...state.roomListData, ...action.payload], uniqBy);
        state.roomListData = uniqueRooms
      },
      setResetRoomListData(state){
        state.roomListData = initialState.roomListData
      },
      setTenantSelectionData(state, action){
        if(action.payload.key == objectTenantSelection[0]){
          if(state.tenantSelectionData[objectTenantSelection[0]]){
            if(state.tenantSelectionData[objectTenantSelection[0]] != action.payload.value){
              removeProductionSelectionDataDraft()
              state.productSelectionData = initialState.productSelectionData
            }
          }
        }
        
        state.tenantSelectionData = {
          ...state.tenantSelectionData,
          [action.payload.key]: action.payload.value
        }

        saveTenantSelectionDataDraft(state.tenantSelectionData)
      },
      setResetTenantSelectionData(state){
        state.tenantSelectionData = initialState.tenantSelectionData
      },
      setProductSelectionData(state, action){
        state.productSelectionData = {
          ...state.productSelectionData,
          [action.payload.key]: action.payload.value
        }
        saveProductionSelectionDataDraft(state.productSelectionData)
      },
      setResetProductSelectionData(state){
        state.productSelectionData = initialState.productSelectionData
      },
      setOrderSummaryData(state, action){
        state.orderSummaryData = {
          ...state.orderSummaryData,
          [action.payload.key]: action.payload.value
        }
        saveOrderSummaryDataDraft(state.orderSummaryData)
      },
      setResetOrderSummaryData(state){
        state.orderSummaryData = initialState.orderSummaryData
      },
      setOrderEditOrViewData(state, action){
        state.orderEditOrViewData = {
          ...state.orderEditOrViewData,
          [action.payload.key]: action.payload.value
        }
        saveOrderEditOrViewDataDraft(state.orderEditOrViewData)
      },
      setResetOrderEditOrViewData(state){
        state.orderEditOrViewData = initialState.orderEditOrViewData
      },
      setShowModalUploadBulk(state, action){
        state.showModalUploadBulk = action.payload
      },
      setBulkStepNameComponent(state, action){
        state.bulkStepNameComponent = action.payload
      },
      setResetBulkStepNameComponent(state){
        state.bulkStepNameComponent = initialState.bulkStepNameComponent
      },
    }
})

export const { 
  setResetNewFunctionRequestState, 
  setListData, 
  setRequestType, 
  setStatusOrder, 
  setStepNameComponent,
  setRoomSelectionData,
  setRoomListData,
  setTenantSelectionData,
  setResetTenantSelectionData,
  setProductSelectionData,
  setResetProductSelectionData,
  setResetRoomListData,
  setOrderSummaryData,
  setResetOrderSummaryData,
  setDeliveryType,
  setOrderEditOrViewData,
  setResetOrderEditOrViewData,
  setResetRoomSelectionData,
  setResetStepNameComponent,
  setShowModalUploadBulk,
  setBulkStepNameComponent,
  setResetBulkStepNameComponent,
  setResetFunctionRequestState
} = newFunctionRequestSlice.actions;

export default newFunctionRequestSlice.reducer;