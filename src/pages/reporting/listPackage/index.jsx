import { useState } from "react";
import { Button, Col, Container, Row, Stack } from "react-bootstrap"
import { RiFileExcel2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import CardComponent from "src/components/partial/cardComponent"
import InputComponent from "src/components/partial/inputComponent";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import { generateExcelListPackage } from "src/utils/api/apiReport";
import { setShowLoadingScreen } from "src/utils/store/globalSlice";

const ReportingListPackage = ()=>{
  const dispatch = useDispatch()
  const initialState = {
    packageName: "",
    category: "",
    productName: "",
  }
	const { categoryProduct } = useSelector(state => state.product);
  const [formSearch, setFormSearch] = useState(initialState);
  const handleChange = (key, value) => {
    setFormSearch((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const generateReport = ()=>{
    dispatch(setShowLoadingScreen(true))
    generateExcelListPackage(formSearch).then((res)=>{
      // const timestamp = moment().format("YYYYMMDD_HHmmss")
      const url = res.data?.data; 
      if(url){
        const link = document.createElement('a');
        link.href = url;
        // link.setAttribute('download', 'List_Package_' + timestamp + '.xlsx'); // Nama file yang akan diunduh
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
		<Container fluid id="report-list-package-page">
			<CardComponent
				title={`Report List Package`}
				type="index"
        addonClassName={"content overflow-hidden"}
        addonBodyClassName={"m-3"}
			>
				<div className="mt-5">
          <Row className="gx-5 gy-4">
            <Col xl={6}>
              <InputComponent
                type="text"
                label="Package Name"
                labelXl="3"
                value={formSearch.packageName}
                name={"packageName"}
                onChange={(e) => handleChange("packageName", e.target.value)}
              />
              <InputDropdownComponent
								onChange={(e) => handleChange("category",e.target.value)}
								value={formSearch.type}
								label="Category"
								listDropdown={categoryProduct}
								labelXl="3"
								valueIndex
							/>
              <InputComponent
                type="text"
                label="Product Name"
                labelXl="3"
                value={formSearch.productName}
                name={"productName"}
                onChange={(e) => handleChange("productName", e.target.value)}
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

export default ReportingListPackage