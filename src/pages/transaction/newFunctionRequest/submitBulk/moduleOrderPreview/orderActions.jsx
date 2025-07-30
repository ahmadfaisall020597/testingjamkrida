import { Stack } from "react-bootstrap";
import ButtonComponent from "src/components/partial/buttonComponent";
import InputComponent from "src/components/partial/inputComponent";
import { objectOrderSummaryData } from "src/pages/transaction/newFunctionRequest/newFunctionRequestFn";

const OrderActions = ({ onBack, onSubmit, onChangeInput, orderSummaryData }) => {

  return (
    <>
      <div className="py-2">
          <InputComponent
            type="textarea"
            label="Notes"
            labelXl="2"
            value={orderSummaryData?.[objectOrderSummaryData[2]]||""}
            name={"NOTES"}
            onChange={(e) => onChangeInput({key: objectOrderSummaryData[2], value: e.target.value})}
            formGroupClassName="gx-2"
            inputClassName={"fw-light"}
            marginBottom="3"
          />
      </div>
      <Stack direction="horizontal" className="mt-4 justify-content-end" gap={3}>
        <ButtonComponent className="px-sm-5 fw-semibold" variant="outline-dark" onClick={onBack} title="Back" />
        <ButtonComponent className="px-sm-5 fw-semibold" variant="warning" onClick={onSubmit} title="Submit" />
      </Stack>
    </>
  );
};

export default OrderActions;
