import { Container } from "react-bootstrap"
import CardComponent from "src/components/partial/cardComponent"
import "src/pages/transaction/newFunctionRequest/style.scss";
import { useDispatch, useSelector } from "react-redux";
import RoomSelection from "./roomSelection";
import TenantSelection from "./tenantSelection";
import ProductSelection from "./productSelection";
import OrderPreview from "./orderPreview";
import { useEffect } from "react";
import objectRouterFunctionRequest from "src/utils/router/objectRouter.functionRequest";
import { getOrderEditOrViewDataDraft, getOrderSummaryDataDraft, getProductionSelectionDataDraft, getRoomSelectionDataDraft, getStepFunctionRequestDraft, getTenantSelectionDataDraft, removeOrderEditOrViewDataDraft, removeOrderSummaryDataDraft, removeProductionSelectionDataDraft, removeRoomSelectionDataDraft, removeStepFunctionRequestDraft, removeTenantSelectionDataDraft } from "src/utils/localStorage";
import { objectOrderSummaryData, objectPackageProductSelection, objectRoomSelection, objectTenantSelection } from "../newFunctionRequestFn";
import { setOrderSummaryData, setProductSelectionData, setResetOrderEditOrViewData, setResetOrderSummaryData, setResetProductSelectionData, setResetRoomSelectionData, setResetStepNameComponent, setResetTenantSelectionData, setRoomSelectionData, setStepNameComponent, setTenantSelectionData } from "../newFunctionRequestSlice";
import { useLocation } from "react-router";
import { setShowLoadingScreen } from "src/utils/store/globalSlice";

const CreateFunctionRequest = () =>{
  const dispatch = useDispatch()
  const location = useLocation()
  const {stepNameComponent} = useSelector(state => state.newFunctionRequest)

  const stepComponents = {
    RoomSelection,
    TenantSelection,  
    ProductSelection,
    OrderPreview
  };

  const StepComponent = stepComponents[stepNameComponent] || (() => <div>Step Not Found</div>);

  useEffect(() => {
    if (location.pathname.includes(objectRouterFunctionRequest.submitNonBulkFunctionRequest.path)) {
      // checking data from edit or not
      dispatch(setShowLoadingScreen(true))
      const dataOrderEditOrView = getOrderEditOrViewDataDraft()
      if(dataOrderEditOrView){
        removeRoomSelectionDataDraft()
        removeTenantSelectionDataDraft()
        removeProductionSelectionDataDraft()
        removeOrderSummaryDataDraft()
        removeStepFunctionRequestDraft()
      }

      setTimeout(()=>{
        const data = getRoomSelectionDataDraft() // get from localstorage
        // console.log(data)
        if(data){
          objectRoomSelection.forEach(v=>{
            dispatch(setRoomSelectionData({ key: v, value: data[v] }));
          })
        }
        const data2 = getTenantSelectionDataDraft()
        // console.log(data2)
        if(data2){
          objectTenantSelection.forEach(v=>{
            dispatch(setTenantSelectionData({ key: v, value: data2[v] }));
          })
        }
        const data3 = getProductionSelectionDataDraft()
        // console.log(data3)
        if(data3){
          objectPackageProductSelection.forEach(v=>{
            dispatch(setProductSelectionData({ key: v, value: data3[v] }));
          })
        }
        const data4 = getOrderSummaryDataDraft()
        // console.log(data3)
        if(data4){
          objectOrderSummaryData.forEach(v=>{
            dispatch(setOrderSummaryData({ key: v, value: data4[v] }));
          })
        }

        if(dataOrderEditOrView){
          dispatch(setResetRoomSelectionData())
          dispatch(setResetTenantSelectionData())
          dispatch(setResetProductSelectionData())
          dispatch(setResetOrderSummaryData())
          dispatch(setResetOrderEditOrViewData())
          removeOrderEditOrViewDataDraft()
        }
        dispatch(setShowLoadingScreen(false))
      },500)
    }
  }, [location, dispatch, stepNameComponent])

  useEffect(()=>{
    if (location.pathname.includes(objectRouterFunctionRequest.submitNonBulkFunctionRequest.path)) {
      const dataOrderEditOrView = getOrderEditOrViewDataDraft()
      if(dataOrderEditOrView){
        removeStepFunctionRequestDraft()
        dispatch(setResetStepNameComponent())
      }
      if(getStepFunctionRequestDraft()){
        dispatch(setStepNameComponent(getStepFunctionRequestDraft()))
      }
    }
  },[location, dispatch])

  return(
    <Container fluid id="create-function-request-page">
      <CardComponent
				title={`New Request`}
				type="create"
			>
        <div>
          <StepComponent />
        </div>
      </CardComponent>
    </Container>
  )
}

export default CreateFunctionRequest