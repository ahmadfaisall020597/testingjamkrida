import { useCallback, useEffect, useState } from "react";
import { Col, Container, Row, Stack } from "react-bootstrap";
import CardComponent from "src/components/partial/cardComponent";
import DetailOrder from "../inquiry/orderHistoryList/module/detailOrder";
import HeaderOrder from "../inquiry/orderHistoryList/module/headerOrder";
import TableDetailOrder from "./tableDetailOrder";
import { useSearchParams } from "react-router";
import { useDispatch } from "react-redux";
import { setShowLoadingScreen } from "src/utils/store/globalSlice";
import { getOrderHistoryByIDIframe } from "src/utils/api/apiTransaction";
import { MdReportProblem } from "react-icons/md";

const OrderHeader = () => {
  let [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const [showOrderPreview, setShowOrderPreview] = useState(false);
  const [dataDetailPerSequence, setDataDetailPerSequence] = useState(null);
  const [error, setError] = useState(false);
  const [data, setData] = useState({});

  const fetchData =useCallback(() => {
		dispatch(setShowLoadingScreen(true))
    const param = searchParams.get("id")
    if(param === null){
      dispatch(setShowLoadingScreen(false))
      setError(true)
    }else{
      setError(false)
      const id = param
      getOrderHistoryByIDIframe(id).then(res=>{
        let data = res?.data?.data
        data = {...data, PAYMENT_METHOD: data.COST_CENTER_ID? "PM_001" : "PM_002"}
        setData(data)
      }).finally(()=>{
        dispatch(setShowLoadingScreen(false))
      })
    }
	},[dispatch, searchParams])

  useEffect(()=>{
    fetchData()
  },[fetchData])

  const handleViewDetail = (row)=>{
    setShowOrderPreview(true)
    setDataDetailPerSequence(row)
  }

  if(error){
    return (
      <Stack className="p-3 justify-content-center align-items-center flex-wrap vh-100" gap={2}>
        <MdReportProblem size={50} color={"#e00d0d"} />
        <p className="m-0 fw-bold fs-3">
          404 NO DATA
        </p>
      </Stack>
    );
  }

  return (
    <Container fluid id="edit-order-history-list-page">
      {showOrderPreview?
        <CardComponent
          title={`View Detail Order`}
          type="create"
        >
          <DetailOrder onBackAction={() => setShowOrderPreview(false)} data={dataDetailPerSequence} from={"iframe"} />
        </CardComponent>
      :
      (
        <CardComponent
          title={`View Order`}
          type="create"
          // needFooter={true}
          // dataFooter={data.LOGS}
        >
          <div>
            <Row className="mb-4">
              <Col>
                <HeaderOrder data={data}/>
              </Col>
            </Row>
            <TableDetailOrder 
              canEdit={false} 
              data={data.ORDER_LIST_SEQUENCE} 
              onChangePrice={()=>console.log()} 
              onChangeStatus={()=>console.log()}
              onViewDetail={handleViewDetail}
            />
          </div>
        </CardComponent>
      )
      }
    </Container>
  )
};

export default OrderHeader;