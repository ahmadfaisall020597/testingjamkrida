import { Container } from "react-bootstrap"
import CardComponent from "src/components/partial/cardComponent"
import "src/pages/transaction/newFunctionRequest/style.scss";
import { useDispatch, useSelector } from "react-redux";
import RoomSelection from "./roomSelection";
import TenantSelection from "./tenantSelection";
import ProductSelection from "./productSelection";
import OrderPreview from "./orderPreview";
import { useCallback, useEffect, useState } from "react";
import objectRouterFunctionRequest from "src/utils/router/objectRouter.functionRequest";
import { getOrderEditOrViewDataDraft, getOrderSummaryDataDraft, getProductionSelectionDataDraft, getRoomSelectionDataDraft, getStepFunctionRequestDraft, getTenantSelectionDataDraft, saveOrderEditOrViewDataDraft, saveOrderSummaryDataDraft, saveProductionSelectionDataDraft, saveRoomSelectionDataDraft, saveStepFunctionRequestDraft, saveTenantSelectionDataDraft } from "src/utils/localStorage";
import { decryptDataId, objectOrderEditOrViewData, objectOrderSummaryData, objectPackageProductSelection, objectRoomSelection, objectTenantSelection } from "../newFunctionRequestFn";
import { setOrderEditOrViewData, setOrderSummaryData, setProductSelectionData, setRoomSelectionData, setStepNameComponent, setTenantSelectionData } from "../newFunctionRequestSlice";
import { useLocation, useSearchParams } from "react-router";
import CommentSection from "src/components/partial/commentSectionComponent";
import { setShowLoadingScreen } from "src/utils/store/globalSlice";
import { getFunctionRequestByID } from "src/utils/api/apiTransaction";
import { History } from "src/utils/router";
import { fnSendMessage } from "../../RequestTransactionList/requestTransactionListFn";
import { toast } from "react-toastify";
import moment from "moment";

const EditOrViewFunctionRequest = () =>{
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const location = useLocation()
  const [flagFetchData, setFlagFetchData] = useState(false);
  const [localLogsChat, setLocalLogsChat] = useState([
    // {
    //   ID: "",
    //   ORDER_ID: "",
    //   USER_ID: "",
    //   USER_BY_NAME: "",
    //   LAST_UPDATED_DATE: moment().utc(),
    //   DESCRIPTION: ""
    // }
  ]);
  const {stepNameComponent, orderEditOrViewData} = useSelector(state => state.newFunctionRequest)
  const {profileUsers} = useSelector(state=>state.global)

  const stepComponents = {
    RoomSelection,
    TenantSelection,  
    ProductSelection,
    OrderPreview
  };

  const StepComponent = stepComponents[stepNameComponent] || (() => <div>Step Not Found</div>);

  const fetchData =useCallback(() => {
    setFlagFetchData(false)
    dispatch(setShowLoadingScreen(true))
    const param = decryptDataId(searchParams.get("q"))
    if(param === null){
      History.navigate(objectRouterFunctionRequest.fnRequest.path)
      dispatch(setShowLoadingScreen(false))
    }else{
      getFunctionRequestByID(null, param?.id).then(res => {
        if(res?.data?.data){
          const data = res?.data?.data
          const orderId = data.orderID
          const LOGS = data.LOGS
          const dataOrderEditOrView = {
            orderId: orderId,
            canEdit: param?.canEdit,
            LOGS: LOGS
          }
          saveOrderEditOrViewDataDraft(dataOrderEditOrView)
  
          if(data.roomSelectionData){
            if(data?.roomSelectionData?.NON_BOOK_ROOM == false){
              const ROOM_UNIQ = `${data.roomSelectionData.OBJ_ROOM_DATA.ROOM_ID}_${data.roomSelectionData.OBJ_ROOM_DATA.ROOM_FROM}_${data.roomSelectionData.OBJ_ROOM_DATA.ROOM_TO}`
              const OBJ_ROOM_DATA = {...data.roomSelectionData.OBJ_ROOM_DATA, ROOM_UNIQ: ROOM_UNIQ}

              saveRoomSelectionDataDraft({...data.roomSelectionData, OBJ_ROOM_DATA: OBJ_ROOM_DATA})
            }else{
              saveRoomSelectionDataDraft({...data.roomSelectionData})
            }
          }
          if(data.tenantSelectionData){
            saveTenantSelectionDataDraft(data.tenantSelectionData)
          }
          if(data.productSelectionData){
            saveProductionSelectionDataDraft(data.productSelectionData)
          }
          if(data.orderSummaryData){
            saveOrderSummaryDataDraft(data.orderSummaryData)
          }
          saveStepFunctionRequestDraft("OrderPreview");
        }
      }).finally(()=>{
        setFlagFetchData(true)
        dispatch(setShowLoadingScreen(false))
      })
    }
  },[dispatch, searchParams])

  useEffect(()=>{
    fetchData()
  },[fetchData])

  useEffect(()=>{
    if (location.pathname.includes(objectRouterFunctionRequest.editNonBulkFunctionRequest.path)) {
      if(flagFetchData){
        const data = getStepFunctionRequestDraft()
        if(data){
          dispatch(setStepNameComponent(data))
        }
      }
    }
  },[location, dispatch, flagFetchData])

  useEffect(() => {
    if (location.pathname.includes(objectRouterFunctionRequest.editNonBulkFunctionRequest.path)) {
      if(flagFetchData){
        const dataOrderEditOrView = getOrderEditOrViewDataDraft()
        if(dataOrderEditOrView){
          objectOrderEditOrViewData.forEach(v=>{
            dispatch(setOrderEditOrViewData({key: v, value: dataOrderEditOrView[v]}))
          })
        }
  
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
      }
    }
  }, [location, dispatch, stepNameComponent, flagFetchData])

  const sendMessageToTenant = (message) =>{
    const body = {
      message : message,
      messageType : "requestor"
    }
    const param = decryptDataId(searchParams.get("q"))
    
    fnSendMessage(body, param?.id).then(res=>{
      toast.success(res.data.message)
    }).finally(()=>{
      const currentUserId = profileUsers?.badgeNumber
      const currentFullName = profileUsers?.fullName
      setLocalLogsChat((prev)=>[{
          ID: "",
          ORDER_ID: orderEditOrViewData?.orderId,
          USER_ID: currentUserId,
          USER_BY_NAME: currentFullName,
          LAST_UPDATED_DATE: moment().utc(),
          DESCRIPTION: message
        },...prev])
    })
  }

  return(
    <Container fluid id="create-function-request-page">
      <CardComponent
				title={`${orderEditOrViewData?.canEdit ? "Edit": "View"} Request`}
				type="create"
        needFooter={stepNameComponent=="OrderPreview"}
        dataFooter={[...localLogsChat, ...orderEditOrViewData?.LOGS || [] ]}
        children2={
          stepNameComponent=="OrderPreview" &&
          (<CommentSection onClick={(message)=>sendMessageToTenant(message)} titleButton={"Send message to Tenant"}/>)}
			>
        <div>
          <StepComponent />
        </div>
      </CardComponent>
    </Container>
  )
}

export default EditOrViewFunctionRequest