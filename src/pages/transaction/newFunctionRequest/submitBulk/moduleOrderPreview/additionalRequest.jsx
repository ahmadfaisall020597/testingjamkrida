import { Form, Stack } from "react-bootstrap";
import { objectOrderSummaryData } from "src/pages/transaction/newFunctionRequest/newFunctionRequestFn";

const AdditionalRequests = ({orderSummaryData, onChangeInput}) => {

  const requestKeys = {
    "Request Spoon and Fork": "spoon",
    "Request Straw": "straw",
  };

  const handleCheck = (item)=>{
    const key = requestKeys[item]
    const updatedRequest = {
      ...orderSummaryData?.request,
      [key]: orderSummaryData?.request?.[key] === true ? false : true, // Toggle antara 0 dan 1
    };

    onChangeInput({ key: objectOrderSummaryData[1], value: updatedRequest });
  }
  return (
    <div className="py-2 custom-checkbox-table">
      {["Request Spoon and Fork", "Request Straw"].map((item, index) => (
        <Stack role="button" key={index} direction="horizontal" className="w-100 align-items-center mb-2" gap={3} onClick={()=>handleCheck(item)}>
          <Form.Check type="checkbox" checked={orderSummaryData?.request?.[requestKeys[item]] === true} onChange={() => handleCheck(item)} />
          <p className="m-0">{item}</p>
        </Stack>
      ))}
    </div>
  );
};

export default AdditionalRequests;
