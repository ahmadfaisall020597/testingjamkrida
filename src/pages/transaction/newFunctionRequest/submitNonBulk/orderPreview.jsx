import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setOrderSummaryData, setStepNameComponent } from "../newFunctionRequestSlice";
import { saveStepFunctionRequestDraft } from "src/utils/localStorage";
import InputModalQueryComponent from "src/components/partial/inputModalQueryComponent";
import { FaSearch } from "react-icons/fa";
import { backToFunctionRequest, decryptDataId, handleModalOpenQueryCostCenter, objectOrderSummaryData, objectPackageProductSelection, objectRoomSelection, objectTenantSelection, titleModalQueryCostCenter, validateAndNotify, validateCartPackage, validateCartProduct, validateDeliveryDate, validateMinimumOrderPerPortion, validateOrderSummaryData, validateRequestDataRoomSelection, validateRequestDataTenantSelection } from "../newFunctionRequestFn";
import OrderDetails from "src/pages/transaction/newFunctionRequest/submitNonBulk/moduleOrderPreview/orderDetails";
import DeliveryOptions from "src/pages/transaction/newFunctionRequest/submitNonBulk/moduleOrderPreview/deliveryOptions";
import PaymentSummary from "src/pages/transaction/newFunctionRequest/submitNonBulk/moduleOrderPreview/paymentSummary";
import OrderSummary from "src/pages/transaction/newFunctionRequest/submitNonBulk/moduleOrderPreview/orderSummary";
import AdditionalRequests from "src/pages/transaction/newFunctionRequest/submitNonBulk/moduleOrderPreview/additionalRequest";
import OrderActions from "src/pages/transaction/newFunctionRequest/submitNonBulk/moduleOrderPreview/orderActions";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { setSelectableModalQuery, setShowLoadingScreen, setShowModalAlert, setShowModalGlobal } from "src/utils/store/globalSlice";
import { addFunctionRequest, editFunctionRequest, getListPackageTransaction, getUnitMenu } from "src/utils/api/apiTransaction";
import { useSearchParams } from "react-router";
import { toast } from "react-toastify";


const OrderPreview = () =>{
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const {roomSelectionData, productSelectionData, orderSummaryData, tenantSelectionData, orderEditOrViewData, deliveryType} = useSelector(state=>state.newFunctionRequest)
  const { selectableModalQuery } = useSelector(state => state.global);

    const [loadingProduct, setLoadingProduct] = useState(true);
    const [listDataProduct, setListDataProduct] = useState([]);
  
    const [loadingPackage, setLoadingPackage] = useState(true);
    const [listDataPackage, setListDataPackage] = useState([]);

  const tenantId = useMemo(() => tenantSelectionData?.[objectTenantSelection[0]], [tenantSelectionData]);

  const fetchDataPackage = useCallback(()=>{
    setLoadingPackage(true);
    const params = {
      packageName:"",
    }
    getListPackageTransaction(params, tenantId).then(res=>{
      const data = res.data.data
      setListDataPackage(data)
      setLoadingPackage(false)
    }).catch(err=>{
      const response = err.response.data
      setListDataPackage(response.data)
      setLoadingPackage(false)
    })
  },[tenantId])

  useEffect(() => {
    fetchDataPackage();
  }, [fetchDataPackage]);

  const fetchDataProduct =useCallback(() => {
    setLoadingProduct(true);
    const params = {
      productName:"",
    }
    getUnitMenu(params, tenantId).then(res=>{
      const data = res.data.data
      setListDataProduct(data)
      setLoadingProduct(false)
    }).catch(err=>{
      const response = err.response.data
      setListDataProduct(response.data)
      setLoadingProduct(false)
    })
  },[tenantId])

  useEffect(() => {
    fetchDataProduct();
  }, [fetchDataProduct]);
  
  useEffect(() => {
    if (selectableModalQuery?.title === titleModalQueryCostCenter) {
      dispatch(setOrderSummaryData({key: objectOrderSummaryData[4], value:selectableModalQuery?.data?.costCenterId}))
      dispatch(setOrderSummaryData({key: objectOrderSummaryData[5], value:selectableModalQuery?.data?.costCenterName}))
    }

    return () => dispatch(setSelectableModalQuery(null));
  }, [selectableModalQuery, dispatch]);

  const submitData = () =>{
    dispatch(setShowLoadingScreen(true))

    let data = {
      roomSelectionData,
      tenantSelectionData,
      productSelectionData,
      orderSummaryData,
      postFrom: "WEB",
      purposeFlag: "submit",
    }

    if(orderEditOrViewData?.orderId){
      data = {...data, orderId: orderEditOrViewData?.orderId}
    }

    const searchParamsEncrypted = searchParams.get("q")
    if(searchParamsEncrypted !== null){
      const param = decryptDataId(searchParams.get("q"))
      if(param){
        const id = param?.id
        editFunctionRequest(id, data).then(res=>{
          if(res.data.data){
            dispatch(setShowModalAlert({
              show: true,
              content: {
                title: "Awesome!",
                message: `Your request order ${data.orderId} has been edit succesfully`,
                type: "success",
                button: ()=>backToFunctionRequest()
              }
            }))
          }
        }).finally(()=>{
          dispatch(setShowLoadingScreen(false))
        })
      }else{
        toast.error("Ilegal Order")
        setTimeout(()=>{
          backToFunctionRequest()
        },[1000])
      }
    }else{
      addFunctionRequest(data).then(res=>{
        if(res.data.data){
          dispatch(setShowModalAlert({
            show: true,
            content: {
              title: "Awesome!",
              message: "Your request order has been added succesfully",
              type: "success",
              button: ()=>backToFunctionRequest()
            }
          }))
        }
      }).finally(()=>{
        dispatch(setShowLoadingScreen(false))
      })
    }
  }
  
  const handleSubmit = async ()=>{
    dispatch(setShowLoadingScreen(true))

    if (!validateAndNotify(validateCartProduct, productSelectionData[objectPackageProductSelection[0]], listDataProduct)){
      dispatch(setShowLoadingScreen(false))
      return;
    } 
    if (!validateAndNotify(validateCartPackage, productSelectionData[objectPackageProductSelection[1]], listDataPackage)){
      dispatch(setShowLoadingScreen(false))
      return;
    } 
    if (!validateRequestDataRoomSelection(roomSelectionData)) {
      dispatch(setShowLoadingScreen(false))
      return;
    }
    if (!validateRequestDataTenantSelection(tenantSelectionData)) {
      dispatch(setShowLoadingScreen(false))
      return;
    }
    if(!validateOrderSummaryData(orderSummaryData, roomSelectionData)){
      dispatch(setShowLoadingScreen(false))
      return;
    }

    if (!await validateDeliveryDate(roomSelectionData, tenantSelectionData)){
      dispatch(setShowLoadingScreen(false))
      return;
    } 

    if (!await validateMinimumOrderPerPortion(productSelectionData, tenantSelectionData, listDataPackage, listDataProduct)){
      dispatch(setShowLoadingScreen(false))
      return;
    } 
    

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

  const handleBack = ()=>{
    if(orderEditOrViewData){
      if(!orderEditOrViewData.canEdit){
        backToFunctionRequest()
        return
      }
    }
    saveStepFunctionRequestDraft("ProductSelection");
    dispatch(setStepNameComponent("ProductSelection"));
  }

  return(
    <Row>
      {/* Left Column */}
      <Col xl={6} className="pe-xl-4 create-col border-end border-3">
        <OrderDetails roomSelectionData={roomSelectionData}/>
        <div className={`${roomSelectionData?.[objectRoomSelection[2]] !=="RQ_002" || !roomSelectionData?.[objectRoomSelection[3]] ? "py-3 border-bottom border-2" : ""}`}>
          {
            !roomSelectionData?.[objectRoomSelection[3]] &&(
              <>
                <Row className="mb-2">
                  <Col sm={4}>
                    Room Booked by
                  </Col>
                  <Col sm={8} className="fw-normal">
                    : {roomSelectionData?.[objectRoomSelection[13]]?.ROOM_BOOKEDBY}
                  </Col>
                </Row>
                <div>
                  {moment(roomSelectionData?.[objectRoomSelection[13]]?.ROOM_FROM).format("DD MMM YYYY HH:mm")} - {moment(roomSelectionData?.[objectRoomSelection[13]]?.ROOM_TO).format("DD MMM YYYY HH:mm")}
                </div>
              </>
            )
          }
          {roomSelectionData?.[objectRoomSelection[2]] !=="RQ_002" &&
            (
              <div className={!roomSelectionData?.[objectRoomSelection[3]] ? "mt-3" : ""}>
                <InputModalQueryComponent
                  label="Cost Center"
                  labelXl="4"
                  value={orderSummaryData[objectOrderSummaryData[4]]}
                  componentButton={<FaSearch />}
                  buttonOnclick={() =>{
                    if(orderEditOrViewData){
                      if(!orderEditOrViewData.canEdit){
                        return
                      }
                    }
                    handleModalOpenQueryCostCenter()
                  }}
                  formGroupClassName={"align-items-center"}
                  marginBottom="0"
                  disabled={orderEditOrViewData ? orderEditOrViewData.canEdit ? false : true : false}
                />
              </div>
            )
          }
        </div>

        <DeliveryOptions orderSummaryData={orderSummaryData} deliveryType={deliveryType}/>
        <div className="py-3">
          <Row className="mb-2">
            <Col sm={4}>
              Function Delivery Location
            </Col>
            <Col sm={8} className="fw-normal">
              : {roomSelectionData?.[objectRoomSelection[13]]?.ROOM_LOCATION}
            </Col>
          </Row>
          <Row className="mb-2">
            <Col sm={4}>
              Delivery to
            </Col>
            <Col sm={8} className="fw-normal">
              : {roomSelectionData[objectRoomSelection[9]]}
            </Col>
          </Row>
          <Row className="mb-2">
            <Col sm={4}>
              Delivery Date
            </Col>
            <Col sm={8} className="fw-normal">
              : {moment(roomSelectionData[objectRoomSelection[8]]).format("DD MMM YYYY")}
            </Col>
          </Row>
          <Row className="mb-2">
            <Col sm={4}>
              Delivery Time
            </Col>
            <Col sm={8} className="fw-normal">
              : {moment(roomSelectionData[objectRoomSelection[8]]).format("HH:mm")}
            </Col>
          </Row>
        </div>
        <PaymentSummary productSelectionData={productSelectionData}/>
      </Col>
      {/* Right Column */}
      <Col className="ps-xl-4">
        <OrderSummary listDataPackage={listDataPackage} listDataProduct={listDataProduct} loadingProduct={loadingProduct} loadingPackage={loadingPackage} productSelectionData={productSelectionData} roomSelectionData={roomSelectionData}/>
        <AdditionalRequests orderSummaryData={orderSummaryData}/>
        <OrderActions onBack={handleBack} onSubmit={handleSubmit}/>
      </Col>
    </Row>
  )
}

export default OrderPreview;