import { Stack } from "react-bootstrap";
import ButtonComponent from "src/components/partial/buttonComponent";
import InputComponent from "src/components/partial/inputComponent";
import { useDispatch, useSelector } from "react-redux";
import { setOrderSummaryData } from "src/pages/transaction/newFunctionRequest/newFunctionRequestSlice";
import { objectOrderSummaryData } from "src/pages/transaction/newFunctionRequest/newFunctionRequestFn";

const OrderActions = ({ onBack, onSubmit }) => {
  const dispatch = useDispatch()
  const {orderSummaryData, orderEditOrViewData } = useSelector(state=>state.newFunctionRequest)

  const renderSubmitButton = ()=>{
    const SubmitButton = <ButtonComponent className="px-sm-5 fw-semibold" variant="warning" onClick={onSubmit} title="Submit" />
    if(orderEditOrViewData){
      if(orderEditOrViewData.canEdit){
        return SubmitButton
      }
      return <></>
    }
    return SubmitButton
  }

  return (
    <>
      <div className="py-2">
          <InputComponent
            type="textarea"
            label="Notes"
            labelXl="2"
            value={orderSummaryData[objectOrderSummaryData[2]]||""}
            name={"NOTES"}
            onChange={(e) => dispatch(setOrderSummaryData({key: objectOrderSummaryData[2], value: e.target.value}))}
            formGroupClassName="gx-2"
            inputClassName={"fw-light"}
            marginBottom="3"
            readOnly={orderEditOrViewData ? orderEditOrViewData.canEdit ? false : true : false }
            disabled={orderEditOrViewData ?orderEditOrViewData.canEdit ? false : true : false}
          />
      </div>
      <Stack direction="horizontal" className="mt-4 justify-content-end" gap={3}>
        <ButtonComponent className="px-sm-5 fw-semibold" variant="outline-dark" onClick={onBack} title="Back" />
        {renderSubmitButton()}
      </Stack>
    </>
  );
};

export default OrderActions;
