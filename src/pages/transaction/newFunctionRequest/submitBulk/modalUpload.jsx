import { Button, Col, Image, Modal, Row, Stack } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { setShowModalUploadBulk } from "../newFunctionRequestSlice"
import closeButton from "src/assets/image/close_button_gray.png"
import InputModalQueryComponent from "src/components/partial/inputModalQueryComponent"
import { FaSearch } from "react-icons/fa"
import { getListTenant } from "src/utils/api/apiMasterPage"
import { setSelectableModalQuery, setShowLoadingScreen, setShowModalQuery } from "src/utils/store/globalSlice"
import { useEffect, useState } from "react"
import InputComponent from "src/components/partial/inputComponent"
import ButtonComponent from "src/components/partial/buttonComponent"
import InputExcelComponent from "src/components/partial/InputExcelComponent"
import { History } from "src/utils/router"
import objectRouterFunctionRequest from "src/utils/router/objectRouter.functionRequest"
import { uploadExcelBulkRequest } from "src/utils/api/apiTransaction"
import { toast } from "react-toastify"
import { saveBulkListData, saveBulkStepFunctionRequest } from "src/utils/localStorage"
import { downloadTemplateBulk } from "src/utils/api/apiGlobal"

const ModalUpload = () => {
  const dispatch = useDispatch()
  const {showModalUploadBulk} = useSelector(state=>state.newFunctionRequest)
  const { selectableModalQuery } = useSelector(state => state.global);
  const [localDefaultData, setLocalDefaultData] = useState({});
  const titleModalQuery = "List All Tenant"

  useEffect(() => {
    if(selectableModalQuery?.title == titleModalQuery){
      setLocalDefaultData((prev) => ({
        ...prev,
        "TENANT_ID": selectableModalQuery?.data?.TENANT_ID, 
        "TENANT_NAME": selectableModalQuery?.data?.TENANT_NAME
      }))
    }
    return(()=>dispatch(setSelectableModalQuery(null)))
  },[selectableModalQuery, dispatch])

  const handleModalOpenQuery = ()=>{
    const data = getListTenant;
    // this can change to your data
    
    const columnConfig = [
      {
        name: "Tenant ID",
        selector: row=> row.TENANT_ID,
        sortable: true,
        sortField: "TENANT_ID",
        width: "120px"
      },
      {
        name: "Name",
        selector: row=> row.TENANT_NAME,
        sortable: true,
        sortField: "TENANT_NAME",
      },
      {
        name: "Status",
        cell: row =>(
          <div className={`fw-bold text-${row.STATUS? 'success': 'danger'}`}>{row.STATUS? 'Active': 'Inactive'}</div>
        ),
        sortable: true,
        sortField: "STATUS",
        width: "150px"
      },
    ]
    dispatch(setShowModalQuery({show:true,
      content:{
        title: titleModalQuery,
        data: data,
        columnConfig: columnConfig,
        searchKey: "tenantName",
        searchLabel: "Tenant Name",
        usingPaginationServer: true
      }
    }))
  }

  const handleChange = (key, value) => {
    setLocalDefaultData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = ()=>{
    // Validasi input
    if (!localDefaultData.FILE_UPLOAD) {
      toast.error("File must be uploaded!");
      return;
    }

    if (!localDefaultData.TENANT_ID) {
      toast.error("Tenant cannot be empty!");
      return;
    }

    if (!localDefaultData.EVENT_NAME) {
      toast.error("Event name cannot be empty!");
      return;
    }

    if (!localDefaultData.PURPOSE_FUNCTION) {
      toast.error("Purpose function cannot be empty!");
      return;
    }
    dispatch(setShowLoadingScreen(true))
    // process upload
    const bodyFormData = new FormData();
    bodyFormData.append("file", localDefaultData.FILE_UPLOAD);
    bodyFormData.append("tenantId", localDefaultData.TENANT_ID);
    bodyFormData.append("eventName", localDefaultData.EVENT_NAME);
    bodyFormData.append("purpose", localDefaultData.PURPOSE_FUNCTION);

    uploadExcelBulkRequest(bodyFormData).then((res)=>{
      toast.success(res.data.message)
      saveBulkStepFunctionRequest('DetailBulk')
      const data = res.data.data.map((v)=>({...v,
        postFrom: "WEB",
        purposeFlag: "submit", 
        productSelectionData: {
          cartProduct: [],
          cartPackage: []
        }
      }))
      
      saveBulkListData(data)
      setTimeout(()=>{
        dispatch(setShowModalUploadBulk(false))
        History.navigate(objectRouterFunctionRequest.submitBulkFunctionRequest.path)
      },[1000])
    }).finally(()=>{
      setTimeout(()=>{
        dispatch(setShowLoadingScreen(false))
      },[1000])
    })
  }

  const handleCancel = () => {
    dispatch(setShowModalUploadBulk(false))
    setLocalDefaultData({})
  }

  const handleDownloadTemplate = () => {
    dispatch(setShowLoadingScreen(true))
    downloadTemplateBulk().then((res)=>{
      // const timestamp = moment().format("YYYYMMDD_HHmmss")
      const url = res.data?.fileUrl; 
      if(url){
        const link = document.createElement('a');
        link.href = url;
        // link.setAttribute('download', 'List_Product_' + timestamp + '.xlsx'); // Nama file yang akan diunduh
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    })
    .finally(()=>{
      dispatch(setShowLoadingScreen(false))
    })
  }

  return(
    <Modal
      show={showModalUploadBulk}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={()=>dispatch(setShowModalUploadBulk(false))}
    >
      <Modal.Body className="position-relative">
        <div role="button" className="position-absolute" onClick={()=>dispatch(setShowModalUploadBulk(false))} style={{right:"12px"}}>
          <Image src={closeButton} />
        </div>
        <div className="p-2">
          <Modal.Title id="contained-modal-title-vcenter" className="mb-4 fw-bold">
            Upload Bulk Request
          </Modal.Title>
          <div>
            <InputExcelComponent
              onChange={(value)=>handleChange("FILE_UPLOAD", value)}
              label="Upload your file"
              termsConditionText=""
              labelXl="4"
              formGroupClassName={"gx-1"}
              marginBottom="2"
              controlId="formControlUploadExcelBulk"
            />
            <Row className="mb-3 gx-1">
              <Col xl={{offset: 4}}>
                <Button variant="link" onClick={() => handleDownloadTemplate()} className="p-0">
                  <Stack direction="horizontal" className="w-100 fw-semibold" gap={2}>
                    <div>Download Template.xlsx</div>
                  </Stack>
                </Button>              
              </Col>
            </Row>
            <InputModalQueryComponent
              label="Tenant Name"
              labelXl="4"
              value={localDefaultData.TENANT_NAME}
              onChange={()=>console.log()}
              componentButton={<FaSearch />}
              buttonOnclick={() =>handleModalOpenQuery()}
              formGroupClassName={"gx-1"}
              marginBottom="4"
            />
            <InputComponent
              labelXl="4"
              label="Event Name"
              value={localDefaultData.EVENT_NAME}
              onChange={(e) => handleChange("EVENT_NAME", e.target.value)}
              type={"text"}
              formGroupClassName="gx-1"
            />
            <InputComponent
              labelXl="4"
              label="Purpose Function"
              value={localDefaultData.PURPOSE_FUNCTION}
              onChange={(e) => handleChange("PURPOSE_FUNCTION", e.target.value)}
              type={"text"}
              formGroupClassName="gx-1"
            />
            <Stack direction="horizontal" className="justify-content-center mt-5" gap={3}>
              <ButtonComponent
                className={"px-sm-5 py-sm-2 fw-semibold"}
                variant="warning"
                onClick={() => handleSubmit()}
                title={"Upload"}
              />
              <ButtonComponent
                className={"px-sm-5 py-sm-2 fw-semibold"}
                variant="outline-danger"
                onClick={() => handleCancel()}
                title={"Cancel"}
              />
            </Stack>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ModalUpload