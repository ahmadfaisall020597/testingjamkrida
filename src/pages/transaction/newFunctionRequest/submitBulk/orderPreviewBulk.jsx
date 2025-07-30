import { Col, Row } from "react-bootstrap"
import OrderActions from "./moduleOrderPreview/orderActions"
import { useDispatch, useSelector } from "react-redux"
import { setSelectableModalQuery, setShowLoadingScreen, setShowModalAlert, setShowModalGlobal } from "src/utils/store/globalSlice"
import { backToFunctionRequest, handleModalOpenQueryCostCenter, objectOrderSummaryData, objectPackageProductSelection, objectRoomSelection, titleModalQueryCostCenter, validateAndNotify, validateCartPackage, validateCartProduct, validateDeliveryDate, validateMinimumOrderPerPortion, validateOrderSummaryData, validateRequestDataRoomSelection, validateRequestDataTenantSelection } from "../newFunctionRequestFn"
import { getBulkListData, saveBulkListData, saveBulkStepFunctionRequest } from "src/utils/localStorage"
import { setBulkStepNameComponent } from "../newFunctionRequestSlice"
import { useCallback, useEffect, useState } from "react"
import AdditionalRequests from "./moduleOrderPreview/additionalRequest"
import objectRouterFunctionRequest from "src/utils/router/objectRouter.functionRequest"
import { useLocation } from "react-router"
import OrderSummary from "./moduleOrderPreview/orderSummary"
import LoadingSpinner from "src/components/partial/spinnerComponent"
import { addFunctionRequestBulk, getListPackageTransaction, getUnitMenu } from "src/utils/api/apiTransaction"
import OrderDetails from "../submitNonBulk/moduleOrderPreview/orderDetails"
import moment from "moment"
import InputModalQueryComponent from "src/components/partial/inputModalQueryComponent"
import { FaSearch } from "react-icons/fa"
import DeliveryOptions from "./moduleOrderPreview/deliveryOptions"
import DeliveryDetails from "./moduleOrderPreview/deliveryDetails"
import PaymentSummary from "../submitNonBulk/moduleOrderPreview/paymentSummary"


const OrderPreviewBulk = () =>{
  const dispatch = useDispatch()
  const location = useLocation()
  const {bulkStepNameComponent, deliveryType} = useSelector(state => state.newFunctionRequest)
  const { selectableModalQuery } = useSelector(state => state.global);

  const [localState, setLocalState] = useState([]);
  const [tenantId, setTenantId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [listDataProduct, setListDataProduct] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingPackage, setLoadingPackage] = useState(true);
  const [listDataPackage, setListDataPackage] = useState([]);

  useEffect(()=>{
    if (location.pathname.includes(objectRouterFunctionRequest.submitBulkFunctionRequest.path)) {
      if(bulkStepNameComponent=="OrderPreviewBulk"){
        if(getBulkListData()){
          const data = getBulkListData()
          setLocalState(data)
          setTenantId(data[0]?.tenantSelectionData?.TENANT_ID)
        }
      }
    }
  },[location, bulkStepNameComponent])

  useEffect(() => {
    if (selectableModalQuery?.title === titleModalQueryCostCenter) {
      setLocalState((prev)=>{
        prev[currentIndex].orderSummaryData[objectOrderSummaryData[4]] = selectableModalQuery?.data?.costCenterId
        prev[currentIndex].orderSummaryData[objectOrderSummaryData[5]] = selectableModalQuery?.data?.costCenterName;
        saveBulkListData([...prev])
        return [...prev];
      })
    }

    return () => dispatch(setSelectableModalQuery(null));
  }, [currentIndex, dispatch, selectableModalQuery]);
  
  const fetchDataPackage = useCallback(()=>{
    setLoadingPackage(true);
    const params = {
      packageName:"",
    }
    if(tenantId){
      getListPackageTransaction(params, tenantId).then(res=>{
        const data = res.data.data
        setListDataPackage(data)
        setLoadingPackage(false)
      }).catch(err=>{
        const response = err.response.data
        setListDataPackage(response.data)
        setLoadingPackage(false)
      })
    }
    
  },[tenantId])
  
  useEffect(() => {
    fetchDataPackage();
  }, [fetchDataPackage]);

  const fetchDataProduct =useCallback(() => {
    setLoadingProduct(true);
    const params = {
      productName:"",
    }
    if(tenantId){
      getUnitMenu(params, tenantId).then(res=>{
        const data = res.data.data
        setListDataProduct(data)
        setLoadingProduct(false)
      }).catch(err=>{
        const response = err.response.data
        setListDataProduct(response.data)
        setLoadingProduct(false)
      })
    }
  },[tenantId])

  useEffect(() => {
    fetchDataProduct();
  }, [fetchDataProduct]);

  const handleChange = ({key, value})=>{
    setLocalState((prev)=>{
      prev[currentIndex].orderSummaryData[key] = value;
      saveBulkListData([...prev])
      return [...prev];
    })
  }

  const submitData = () =>{
    dispatch(setShowLoadingScreen(true))
    addFunctionRequestBulk(localState).then(res=>{
      if(res.data.data){
        dispatch(setShowModalAlert({
          show: true,
          content: {
            title: "Awesome!",
            message: "Your request order has been added succesfully",
            type: "success",
            button: ()=>backToFunctionRequest("bulk")
          }
        }))
      }
    }).finally(()=>{
      dispatch(setShowLoadingScreen(false))
    })
  }
  const handleSubmit = async ()=>{
    dispatch(setShowLoadingScreen(true))

    let valid = true;
    for (const element of localState) {
      if (!validateAndNotify(validateCartProduct, element.productSelectionData[objectPackageProductSelection[0]], listDataProduct, true, element.sequence)){
        dispatch(setShowLoadingScreen(false))
        valid = false;
        break;
      } 
      if (!validateAndNotify(validateCartPackage, element.productSelectionData[objectPackageProductSelection[1]], listDataPackage, true, element.sequence)){
        dispatch(setShowLoadingScreen(false))
        valid = false;
        break;
      } 
      if (!validateRequestDataRoomSelection(element.roomSelectionData, true, element.sequence)) {
        dispatch(setShowLoadingScreen(false))
        valid = false;
        break;
      }
      if (!validateRequestDataTenantSelection(element.tenantSelectionData, true, element.sequence)) {
        dispatch(setShowLoadingScreen(false))
        valid = false;
        break;
      }
      if(!validateOrderSummaryData(element.orderSummaryData, element.roomSelectionData, true, element.sequence)){
        dispatch(setShowLoadingScreen(false))
        valid = false;
        break;
      }

      if (!await validateDeliveryDate(element.roomSelectionData, element.tenantSelectionData, true, element.sequence)){
        valid = false;
        break;
      }

      if (!await validateMinimumOrderPerPortion(element.productSelectionData, element.tenantSelectionData, listDataPackage, listDataProduct, true, element.sequence)){
        valid = false;
        break;
      }
    }

    if(valid){
      setTimeout(()=>{
        dispatch(setShowLoadingScreen(false))
        dispatch(setShowModalGlobal({
          show: true,
          content: {
            captionText: `Your request order will be placed to the system and can’t be changed`,
            questionText: "Are you sure to submit your order?",
            buttonLeftText: "Submit",
            buttonRightText: "Cancel",
            buttonLeftFn: ()=>submitData(),
            buttonRightFn: null
          }
        }))
      }, 300)
    }
  }

  const handleBack = ()=>{
    saveBulkStepFunctionRequest("ProductBulkSelection")
    // simpan ke local storage, lalu call API
    dispatch(setBulkStepNameComponent("ProductBulkSelection"))
  }

  const changePage = (to)=>{
    let index = currentIndex
    if (to === "next") {
      index = currentIndex < localState.length - 1 ? currentIndex + 1 : localState.length - 1
      setCurrentIndex(index);
    } else {
      index = currentIndex > 0 ? currentIndex - 1 : 0
      setCurrentIndex(index);
    }
  }

  if(localState.length > 0){
    return(
      <Row>
        {/* Left Column */}
        <Col xl={6} className="pe-xl-4 create-col border-end border-3">
          <OrderDetails roomSelectionData={localState[currentIndex]?.roomSelectionData}/>
          <div className={localState[currentIndex]?.roomSelectionData?.[objectRoomSelection[2]] !=="RQ_002" || !localState[currentIndex]?.roomSelectionData?.[objectRoomSelection[3]] ? "py-3 border-bottom border-2" : ""}>
            {
              !localState[currentIndex]?.roomSelectionData?.[objectRoomSelection[3]] &&(
                <>
                  <Row className="mb-2">
                    <Col sm={4}>
                      Room Booked by
                    </Col>
                    <Col sm={8} className="fw-normal">
                      : {localState[currentIndex]?.roomSelectionData?.[objectRoomSelection[13]]?.ROOM_BOOKEDBY}
                    </Col>
                  </Row>
                  <div>
                    {moment(localState[currentIndex]?.roomSelectionData?.[objectRoomSelection[13]]?.ROOM_FROM).format("DD MMM YYYY HH:mm")} - {moment(localState[currentIndex]?.roomSelectionData?.[objectRoomSelection[13]]?.ROOM_TO).format("DD MMM YYYY HH:mm")}
                  </div>
                </>
              )
            }
            {localState[currentIndex]?.roomSelectionData?.[objectRoomSelection[2]] !=="RQ_002" &&
              (
                <div className={!localState[currentIndex]?.roomSelectionData?.[objectRoomSelection[3]] ? "mt-3" : ""}>
                  <InputModalQueryComponent
                    label="Cost Center"
                    labelXl="4"
                    value={localState[currentIndex]?.orderSummaryData[objectOrderSummaryData[4]]}
                    componentButton={<FaSearch />}
                    buttonOnclick={() =>handleModalOpenQueryCostCenter()}
                    formGroupClassName={"align-items-center"}
                    marginBottom="0"
                  />
                </div>
                
              )
            }
          </div>
          <DeliveryOptions 
            orderSummaryData={localState[currentIndex]?.orderSummaryData} 
            deliveryType={deliveryType} 
            onChangeInput={handleChange}
          />
          <DeliveryDetails roomSelectionData={localState[currentIndex]?.roomSelectionData}/>
          <PaymentSummary productSelectionData={localState[currentIndex]?.productSelectionData}/>
        </Col>
        {/* Right Column */}
        <Col className="ps-xl-4">
          <OrderSummary 
            listDataPackage={listDataPackage} 
            listDataProduct={listDataProduct} 
            loadingProduct={loadingProduct} 
            loadingPackage={loadingPackage} 
            productSelectionData={localState[currentIndex]?.productSelectionData} 
            roomSelectionData={localState[currentIndex]?.roomSelectionData} 
            buttonNext={()=>changePage("next")} 
            buttonPrevious={()=>changePage("prev")}
            currentIndex={currentIndex}
            localState={localState}
          />
          <AdditionalRequests orderSummaryData={localState[currentIndex]?.orderSummaryData} onChangeInput={handleChange}/>
          <OrderActions onBack={handleBack} onSubmit={handleSubmit} orderSummaryData={localState[currentIndex]?.orderSummaryData} onChangeInput={handleChange} />
        </Col>
      </Row>
    )
  }

  return <LoadingSpinner color="secondary"/>

}

export default OrderPreviewBulk