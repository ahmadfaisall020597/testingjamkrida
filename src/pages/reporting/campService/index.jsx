import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Stack } from "react-bootstrap"
import { FaSearch } from "react-icons/fa";
import { RiFileExcel2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import CardComponent from "src/components/partial/cardComponent"
import InputComponent from "src/components/partial/inputComponent";
import InputDateRangeComponent from "src/components/partial/inputDateRangeComponent"
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import InputModalQueryComponent from "src/components/partial/inputModalQueryComponent";
import { handleModalOpenQueryTenant, titleModalQueryTenant } from "src/pages/masterPage/productPackage/productPackageFn";
import { generateExcelCampServices } from "src/utils/api/apiReport";
import { setSelectableModalQuery, setShowLoadingScreen } from "src/utils/store/globalSlice";

const ReportingCampServices = ()=>{
  const dispatch = useDispatch()
  const initialState = {
    tenant: {
      id: "",
      name: ""
    },
    status: "",
    deliveryDateFrom: "",
    deliveryDateTo: "",
    orderDateFrom: "",
    orderDateTo: "",
    department: "",
    requestType: "",
  }
  const { requestType, statusOrder } = useSelector(state => state.newFunctionRequest)
  const { selectableModalQuery } = useSelector(state => state.global);
  const [formSearch, setFormSearch] = useState(initialState);

  useEffect(() => {
    if (selectableModalQuery?.title === titleModalQueryTenant) {
      handleChange("tenant", {id: selectableModalQuery?.data?.TENANT_ID, name: selectableModalQuery?.data?.TENANT_NAME})
    }

    return () => dispatch(setSelectableModalQuery(null));
  }, [selectableModalQuery, dispatch]);

  const handleChange = (key, value) => {
    setFormSearch((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const generateReport = ()=>{
    dispatch(setShowLoadingScreen(true))
    generateExcelCampServices(formSearch).then((res)=>{
      // const timestamp = moment().format("YYYYMMDD_HHmmss")
      const url = res.data?.data; 
      if(url){
        const link = document.createElement('a');
        link.href = url;
        // link.setAttribute('download', 'Camp_Service_' + timestamp + '.xlsx'); // Nama file yang akan diunduh
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
		<Container fluid id="report-camp-services-page">
			<CardComponent
				title={`Report Camp Services`}
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
                label="Order Date"
                startDate={formSearch.orderDateFrom}
                endDate={formSearch.orderDateTo}
                onChangeStartDate={(e)=>handleChange("orderDateFrom", e)}
                onChangeEndDate={(e)=>handleChange("orderDateTo", e)}
                rowClassName={"gx-2"}
              />
              <InputComponent
                type="text"
                label="Department"
                labelXl="4"
                value={formSearch.department}
                name={"department"}
                onChange={(e) => handleChange("department", e.target.value)}
                marginBottom="3"
                formGroupClassName={"gx-2"}
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
            </Col>
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
                onChange={(e) => handleChange("requestType", e.target.value)}
                value={formSearch.requestType}
                label="Request Type"
                listDropdown={requestType}
                labelXl="4"
                valueIndex
                marginBottom="3"
                formGroupClassName={"gx-2"}
              />
              <InputModalQueryComponent
                label="Tenant ID"
                labelXl="4"
                value={formSearch.tenant.name}
                componentButton={<FaSearch />}
                buttonOnclick={() =>handleModalOpenQueryTenant()}
                formGroupClassName={"align-items-center gx-2"}
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

export default ReportingCampServices