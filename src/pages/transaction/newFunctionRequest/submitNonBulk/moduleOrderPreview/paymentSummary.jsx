import { useCallback, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import LoadingSpinner from "src/components/partial/spinnerComponent";
import { calculateOrderTotal, calculateOrderTotalIframe } from "src/utils/api/apiTransaction";
import { formatNumber } from "src/utils/helpersFunction";

const PaymentSummary = ({productSelectionData, from}) => {
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState(null);

  const fetchData = useCallback(()=>{
    setLoading(true)
    let apiFn = calculateOrderTotal
    if(from == "iframe"){
      apiFn = calculateOrderTotalIframe
    } 
    apiFn(productSelectionData).then(res=>{
      setResponseData(res.data)
    }).catch(()=>{
      setResponseData(null)
    }).finally(()=>{
      setLoading(false)
    })
  },[from, productSelectionData])

  useEffect(()=>{
    fetchData()
  },[fetchData])

  return (
    <>
      <div className="my-1 px-3 py-2 header-title fw-bold fs-5">Payment Summary</div>
      <div className="py-3">
        {loading ?
          <LoadingSpinner color="secondary"/>
        :
        <>
          <Row className="mb-2">
            <Col sm={4}>Price</Col>
            <Col sm={8}>Rp. {formatNumber(responseData?.totalPrice)}</Col>
          </Row>
          <Row className="mb-3">
            <Col sm={4}>Discount</Col>
            <Col sm={8}>Rp. {formatNumber(responseData?.discount)}</Col>
          </Row>
          <Row className="fs-4 fw-bold">
            <Col sm={4}>Total</Col>
            <Col sm={8}>Rp. {formatNumber(responseData?.totalPriceAfterDiscount)}</Col>
          </Row>
        </>
        }
      </div>
    </>
  );
};

export default PaymentSummary;
