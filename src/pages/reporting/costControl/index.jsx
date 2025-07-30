import { useState } from "react";
import { Button, Col, Container, Row, Stack } from "react-bootstrap"
import { RiFileExcel2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import CardComponent from "src/components/partial/cardComponent"
import InputComponent from "src/components/partial/inputComponent";
import InputDateRangeComponent from "src/components/partial/inputDateRangeComponent"
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import { generateExcelCostControl } from "src/utils/api/apiReport";
import { setShowLoadingScreen } from "src/utils/store/globalSlice";

const ReportingCostControl = ()=>{
  const dispatch = useDispatch()
  const initialState = {
    requestType: "",
    status: "",
    deliveryDateFrom: "",
    deliveryDateTo: "",
    acknowledgeBy: "",
    receivedBy: "",
    checkedBy1: "",
    checkedBy2: "",
    reviewedBy: "",
    approvedBy: "",
  }
  const { requestType, statusOrder } = useSelector(state => state.newFunctionRequest)
  const [formSearch, setFormSearch] = useState(initialState);
  const handleChange = (key, value) => {
    setFormSearch((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const generateReport = ()=>{
    dispatch(setShowLoadingScreen(true))
    generateExcelCostControl(formSearch).then((res)=>{
      // const timestamp = moment().format("YYYYMMDD_HHmmss")
      const urlData = res.data?.data
      if(urlData){
        const link = document.createElement('a');
        link.href = urlData;
        // link.setAttribute('download', 'Cost_Control_' + timestamp + '.xlsx'); // Nama file yang akan diunduh
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
    })
    .finally(()=>{
      dispatch(setShowLoadingScreen(false))
    })
  }

  const resetFilter = ()=>{
    setFormSearch(initialState)
  }

  return (
		<Container fluid id="report-cost-control-page">
			<CardComponent
				title={`Report Cost Control`}
				type="index"
        addonClassName={"content overflow-hidden"}
        addonBodyClassName={"m-3"}
			>
				<div className="mt-5">
          <Row className="gx-5 gy-4">
            <Col xl={6}>
              <InputDateRangeComponent
                labelXs="4"
                labelXl="0"
                label="Delivery Date"
                startDate={formSearch.deliveryDateFrom}
                endDate={formSearch.deliveryDateTo}
                onChangeStartDate={(e)=>handleChange("deliveryDateFrom", e)}
                onChangeEndDate={(e)=>handleChange("deliveryDateTo", e)}
                rowClassName={"gx-2"}
              />
              <InputDropdownComponent
                onChange={(e) => handleChange('status', e.target.value)}
                value={formSearch.status}
                label="Status"
                listDropdown={statusOrder}
                labelXl="4"
                valueIndex
                marginBottom="3"
                formGroupClassName={"gx-2"}
              />
              <InputDropdownComponent
                onChange={(e) => handleChange("requestType", e.target.value)}
                value={formSearch.requestType}
                label="Request Type"
                listDropdown={requestType}
                labelXl="4"
                valueIndex
                marginBottom="3"
                formGroupClassName={"gx-2"}
              />
              <InputComponent
                type="text"
                label="Acknowledge By"
                labelXl="4"
                value={formSearch.acknowledgeBy}
                name={"acknowledgeBy"}
                onChange={(e) => handleChange("acknowledgeBy", e.target.value)}
                marginBottom="3"
                formGroupClassName={"gx-2"}
              />
              <InputComponent
                type="text"
                label="Received By"
                labelXl="4"
                value={formSearch.receivedBy}
                name={"receivedBy"}
                onChange={(e) => handleChange("receivedBy", e.target.value)}
                marginBottom="3"
                formGroupClassName={"gx-2"}
              />
            </Col>

            <Col xl={6}>
              <InputComponent
                type="text"
                label="Checked I By"
                labelXl="3"
                value={formSearch.checkedBy1}
                name={"checkedBy1"}
                onChange={(e) => handleChange("checkedBy1", e.target.value)}
                marginBottom="3"
              />
              <InputComponent
                type="text"
                label="Checked II By"
                labelXl="3"
                value={formSearch.checkedBy2}
                name={"checkedBy2"}
                onChange={(e) => handleChange("checkedBy2", e.target.value)}
                marginBottom="3"
              />
              <InputComponent
                type="text"
                label="Reviewed By"
                labelXl="3"
                value={formSearch.reviewedBy}
                name={"reviewedBy"}
                onChange={(e) => handleChange("reviewedBy", e.target.value)}
                marginBottom="3"
              />
              <InputComponent
                type="text"
                label="Approved By"
                labelXl="3"
                value={formSearch.approvedBy}
                name={"approvedBy"}
                onChange={(e) => handleChange("approvedBy", e.target.value)}
                marginBottom="3"
              />
            </Col>
          </Row>
          <Stack direction="horizontal" className="flex-wrap mt-3" gap={3}>
            <Button variant="primary" className="mb-1 text-white" onClick={()=>resetFilter()}>
              <Stack direction="horizontal" gap={2}>
                <p className="m-0">Reset Filter</p>
              </Stack>
            </Button>
            <Button variant="secondary" className="mb-1" onClick={()=>generateReport()}>
              <Stack direction="horizontal" gap={2}>
                <RiFileExcel2Fill/>
                <p className="m-0">Generate Report</p>
              </Stack>
            </Button>
          </Stack>
        </div>
      </CardComponent>
    </Container>
  )
}

export default ReportingCostControl