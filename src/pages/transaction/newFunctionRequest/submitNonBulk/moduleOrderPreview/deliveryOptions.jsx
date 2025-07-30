import { Col, Form, Row, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { objectOrderSummaryData } from "src/pages/transaction/newFunctionRequest/newFunctionRequestFn";
import { setOrderSummaryData } from "src/pages/transaction/newFunctionRequest/newFunctionRequestSlice";

const DeliveryOptions = ({orderSummaryData, deliveryType}) => {
  const dispatch = useDispatch()
  const {orderEditOrViewData } = useSelector(state=>state.newFunctionRequest)

  const handleCheck = (data)=>{
    if(orderEditOrViewData){
      if(!orderEditOrViewData.canEdit){
        return
      }
    }
    dispatch(setOrderSummaryData({key: objectOrderSummaryData[0], value: data.value}))
  }

  return (
    <div className="py-3 border-bottom border-2">
      <Row>
        <Col sm={4}>Select Delivery Type</Col>
        <Col sm={8}>
          <Stack direction="horizontal" className="w-100 justify-content-start" gap={5}>
            {deliveryType.map((type, index)=>
              <Form.Check 
                id={`delivery-type-${type.value}`} 
                role="button" 
                key={index} 
                label={type.label}
                type="radio" 
                checked={orderSummaryData[objectOrderSummaryData[0]]==type.value} 
                onChange={() => handleCheck(type)} 
              />
            )}            
          </Stack>
        </Col>
      </Row>
    </div>
  );
};

export default DeliveryOptions;
