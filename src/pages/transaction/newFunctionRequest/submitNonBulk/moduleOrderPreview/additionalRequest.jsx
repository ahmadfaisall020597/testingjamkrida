import { Form, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { objectOrderSummaryData } from "src/pages/transaction/newFunctionRequest/newFunctionRequestFn";
import { setOrderSummaryData } from "src/pages/transaction/newFunctionRequest/newFunctionRequestSlice";

const AdditionalRequests = ({orderSummaryData}) => {
  const dispatch = useDispatch()
  const {orderEditOrViewData } = useSelector(state=>state.newFunctionRequest)


  const requestKeys = {
    "Request Spoon and Fork": "spoon",
    "Request Straw": "straw",
  };

  const handleCheck = (item)=>{
    const key = requestKeys[item]
    const updatedRequest = {
      ...orderSummaryData.request,
      [key]: orderSummaryData.request?.[key] === true ? false : true, // Toggle antara 0 dan 1
    };

    dispatch(setOrderSummaryData({ key: objectOrderSummaryData[1], value: updatedRequest }));
  }
  return (
    <div className="py-2 custom-checkbox-table">
      {["Request Spoon and Fork", "Request Straw"].map((item, index) => (
        <Stack role="button" key={index} direction="horizontal" className="w-100 align-items-center mb-2" gap={3} onClick={()=>{
          if(orderEditOrViewData){
            if(!orderEditOrViewData.canEdit){
              return
            }
          }
          handleCheck(item)
        }}>
          <Form.Check type="checkbox" checked={orderSummaryData?.request?.[requestKeys[item]] === true} onChange={() =>{
            if(orderEditOrViewData){
              if(!orderEditOrViewData.canEdit){
                return
              }
            }
            handleCheck(item)
          }}/>
          <p className="m-0">{item}</p>
        </Stack>
      ))}
    </div>
  );
};

export default AdditionalRequests;
