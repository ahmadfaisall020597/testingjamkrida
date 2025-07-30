import { Col, Form, Row, Stack } from "react-bootstrap";
import { objectOrderSummaryData } from "src/pages/transaction/newFunctionRequest/newFunctionRequestFn";

const DeliveryOptions = ({orderSummaryData, deliveryType, onChangeInput}) => {
  const handleCheck = (data)=>{
    onChangeInput({key: objectOrderSummaryData[0], value: data.value})
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
