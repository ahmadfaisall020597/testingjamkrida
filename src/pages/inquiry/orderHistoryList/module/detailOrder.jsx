import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Col, Form, Row, Stack } from "react-bootstrap"
import { useSelector } from "react-redux";
import ButtonComponent from "src/components/partial/buttonComponent"
import InputComponent from "src/components/partial/inputComponent";
import LoadingSpinner from "src/components/partial/spinnerComponent";
import { objectOrderSummaryData, objectRoomSelection, objectTenantSelection } from "src/pages/transaction/newFunctionRequest/newFunctionRequestFn";
import OrderDetails from "src/pages/transaction/newFunctionRequest/submitNonBulk/moduleOrderPreview/orderDetails";
import OrderSummary from "src/pages/transaction/newFunctionRequest/submitNonBulk/moduleOrderPreview/orderSummary";
import PaymentSummary from "src/pages/transaction/newFunctionRequest/submitNonBulk/moduleOrderPreview/paymentSummary";
import { getListPackageTransaction, getListPackageTransactionIframe, getOrderHistorySequenceByID, getOrderHistorySequenceByIDIframe, getUnitMenu, getUnitMenuIframe } from "src/utils/api/apiTransaction";

const DetailOrder = ({onBackAction, data, from}) =>{
  const requestKeys = {
    "Request Spoon and Fork": "spoon",
    "Request Straw": "straw",
  };

  const {deliveryType} = useSelector(state=>state.newFunctionRequest)

  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState(null);

  const [loadingProduct, setLoadingProduct] = useState(true);
  const [listDataProduct, setListDataProduct] = useState([]);

  const [loadingPackage, setLoadingPackage] = useState(true);
  const [listDataPackage, setListDataPackage] = useState([]);

  const {roomSelectionData, productSelectionData, orderSummaryData, tenantSelectionData} = responseData || {}

  const tenantId = useMemo(() => tenantSelectionData?.[objectTenantSelection[0]], [tenantSelectionData]);

  const fetchDataPackage = useCallback(()=>{
    setLoadingPackage(true);
    const params = {
      packageName:"",
    }
    
    if(tenantId){
      let apiFn = getListPackageTransaction
      if(from == "iframe"){
        apiFn = getListPackageTransactionIframe
      } 
      apiFn(params, tenantId).then(res=>{
        const data = res.data.data
        setListDataPackage(data)
        setLoadingPackage(false)
      }).catch(err=>{
        const response = err.response.data
        setListDataPackage(response.data)
        setLoadingPackage(false)
      })
    }

  },[from, tenantId])

  useEffect(() => {
    fetchDataPackage();
  }, [fetchDataPackage]);

  const fetchDataProduct =useCallback(() => {
    setLoadingProduct(true);
    const params = {
      productName:"",
    }
    if(tenantId){
      let apiFn = getUnitMenu
      if(from == "iframe"){
        apiFn = getUnitMenuIframe
      } 
      apiFn(params, tenantId).then(res=>{
        const data = res.data.data
        setListDataProduct(data)
        setLoadingProduct(false)
      }).catch(err=>{
        const response = err.response.data
        setListDataProduct(response.data)
        setLoadingProduct(false)
      })
    }
  },[from, tenantId])

  useEffect(() => {
    fetchDataProduct();
  }, [fetchDataProduct]);

  const fetchData = useCallback(()=>{
    setLoading(true)
    const id = data.ID
    let apiFn = getOrderHistorySequenceByID
    if(from == "iframe"){
      apiFn = getOrderHistorySequenceByIDIframe
    } 
    apiFn(id).then(res=>{
      setResponseData(res.data.data)
    }).catch(()=>{
      setResponseData(null)
    }).finally(()=>{
      setLoading(false)
    })
  },[data, from])

  useEffect(()=>{
    fetchData()
  },[fetchData])

  if(responseData){
    return (
      <Row>
        {/* Left Column */}
        <Col xl={6} className="pe-xl-4 create-col border-end border-3">
          <OrderDetails roomSelectionData={roomSelectionData || null}/>
          <div className="py-3 border-bottom border-2">
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
                  <div className="mb-3">
                    {moment(roomSelectionData?.[objectRoomSelection[13]]?.ROOM_FROM).format("DD MMM YYYY HH:mm")} - {moment(roomSelectionData?.[objectRoomSelection[13]]?.ROOM_TO).format("DD MMM YYYY HH:mm")}
                  </div>
                </>
              )
            }
            <Row className="">
              <Col sm={4}>
                Cost Center
              </Col>
              <Col sm={8} className="fw-normal">
                : {orderSummaryData?.[objectOrderSummaryData[4]]}
              </Col>
            </Row>
          </div>
          <div className="py-3 border-bottom border-2">
            <Row className="">
              <Col sm={4}>
                Delivery Type
              </Col>
              <Col sm={8} className="fw-normal">
                {
                  from=='iframe'?
                    `: ${data?.DELIVERY_TYPE_DESC}`
                  :
                    `: ${deliveryType?.find(v=>v.value==orderSummaryData?.deliveryType)?.label}`
                }
              </Col>
            </Row>
          </div>
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
                : {roomSelectionData?.[objectRoomSelection[9]]}
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
          <PaymentSummary productSelectionData={productSelectionData} from={from}/>
        </Col>
        {/* Right Column */}
        <Col className="ps-xl-4">
          <OrderSummary listDataPackage={listDataPackage} listDataProduct={listDataProduct} loadingProduct={loadingProduct} loadingPackage={loadingPackage} productSelectionData={productSelectionData} roomSelectionData={roomSelectionData}/>
          <div className="py-3 custom-checkbox-table">
            {["Request Spoon and Fork", "Request Straw"].map((item, index) => (
              <Stack role="button" key={index} direction="horizontal" className="w-100 align-items-center mb-2" gap={3}>
                <Form.Check type="checkbox" checked={orderSummaryData?.request?.[requestKeys[item]] === true} readOnly/>
                <p className="m-0">{item}</p>
              </Stack>
            ))}
          </div>
          <div className="py-2">
            <InputComponent
              type="textarea"
              label="Notes"
              labelXl="2"
              value={orderSummaryData?.[objectOrderSummaryData[2]]||""}
              name={"NOTES"}
              disabled={true}
              formGroupClassName="gx-2"
              inputClassName={"fw-light"}
              marginBottom="3"
            />
          </div>
          <Stack direction="horizontal" className="mt-3 justify-content-end" gap={3}>
            <ButtonComponent className="px-sm-5 py-sm-2 fw-semibold" variant="outline-danger" onClick={onBackAction} title="Back" />
          </Stack>
        </Col>
      </Row>
    )
  }

  return(
    <LoadingSpinner color="secondary"/>
  )

}

export default DetailOrder