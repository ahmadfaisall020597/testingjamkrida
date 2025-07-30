import { useCallback, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import CardComponent from "src/components/partial/cardComponent";
import "./style.scss";
import InputComponent from "src/components/partial/inputComponent";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import { useDispatch, useSelector } from "react-redux";
import HeaderOrder from "./module/headerOrder";
import ButtonAction from "./module/buttonAction";
import { setSelectableModalQuery, setShowLoadingScreen } from "src/utils/store/globalSlice";
import { decryptDataId } from "./orderHistoryListFn";
import { useSearchParams } from "react-router";
import { History } from "src/utils/router";
import objectRouterInquiry from "src/utils/router/objectRouter.inquiry";
import TableDetailOrder from "./module/tableDetailOrder";
import { getOrderHistoryByID } from "src/utils/api/apiTransaction";
import DetailOrder from "./module/detailOrder";
import InputModalQueryComponent from "src/components/partial/inputModalQueryComponent";
import { FaSearch } from "react-icons/fa";
import { handleModalOpenQueryCostCenter, titleModalQueryCostCenter } from "src/pages/transaction/newFunctionRequest/newFunctionRequestFn";
import InputFileComponent from "src/components/partial/InputFileComponent";
import { removeThousandSeparator } from "src/utils/helpersFunction";

const EditOrderHistoryList = () =>{
  let [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const {listPaymentMethod} = useSelector(state=>state.orderHistoryList)
  const { selectableModalQuery } = useSelector(state => state.global);

  const [canEdit, setCanEdit] = useState(true);
  const [showOrderPreview, setShowOrderPreview] = useState(false);
  const [dataDetailPerSequence, setDataDetailPerSequence] = useState(null);
  const [data, setData] = useState({});
  const [currentParamValue, setCurrentParamValue] = useState("");

  const fetchData =useCallback(() => {
		dispatch(setShowLoadingScreen(true))
    const param = decryptDataId(searchParams.get("q"))
    if(param === null){
      History.navigate(objectRouterInquiry.orderHistoryList.path)
      dispatch(setShowLoadingScreen(false))
    }else{
      setCanEdit(param?.from == "edit")
      setCurrentParamValue(param?.from)
      const id = param?.orderId
      getOrderHistoryByID(id).then(res=>{
        let data = res?.data?.data
        data = {...data, PAYMENT_METHOD: data.COST_CENTER_ID? "PM_001" : "PM_002"}
        setData(data)
      }).finally(()=>{
        dispatch(setShowLoadingScreen(false))
      })
    }
	},[dispatch, searchParams])

  useEffect(()=>{
    fetchData()
  },[fetchData])

  useEffect(() => {
    if (selectableModalQuery?.title === titleModalQueryCostCenter) {
      setData((prev)=>({...prev, 
        COST_CENTER_ID: selectableModalQuery?.data?.costCenterId, 
        COST_CENTER_NAME: selectableModalQuery?.data?.costCenterName
      }))
    }

    return () => dispatch(setSelectableModalQuery(null));
  }, [selectableModalQuery, dispatch]);

  const handleChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFileChange = (fileData) => {
    handleChange("PAYMENT_ATTACHMENT_URL", fileData || null);
  };

  const handleChangePrice = (row, changedData)=>{
    console.log("changePrice")

    // Salin data lama agar tidak merubah state secara langsung (immutable)
    const updatedData = { ...data };

    // Cari item yang sesuai berdasarkan ID
    const updatedOrderList = updatedData.ORDER_LIST_SEQUENCE.map(item => {
      if (item.ID === row.ID) {  // Cek apakah ID item sama dengan ID yang diubah
        return {
          ...item,
          PRICE_ADMIN: removeThousandSeparator(changedData),  // Update harga
        };
      }
      return item;  // Jika tidak sama, kembalikan item tanpa perubahan
    });

    // Perbarui data dengan ORDER_LIST_SEQUENCE yang sudah diubah
    updatedData.ORDER_LIST_SEQUENCE = updatedOrderList;

    // Setel ulang state dengan data yang sudah diperbarui
    setData(updatedData);
  }

  const handleChangeStatus = (row, changedData) =>{
    console.log("changeStatus")

    // Salin data lama agar tidak merubah state secara langsung (immutable)
    const updatedData = { ...data };

    // Cari item yang sesuai berdasarkan ID
    const updatedOrderList = updatedData.ORDER_LIST_SEQUENCE.map(item => {
      if (item.ID === row.ID) {  // Cek apakah ID item sama dengan ID yang diubah
        return {
          ...item,
          STATUS: changedData,  // Update status
        };
      }
      return item;  // Jika tidak sama, kembalikan item tanpa perubahan
    });

    // Perbarui data dengan ORDER_LIST_SEQUENCE yang sudah diubah
    updatedData.ORDER_LIST_SEQUENCE = updatedOrderList;

    // Setel ulang state dengan data yang sudah diperbarui
    setData(updatedData);
  }

  const handleViewDetail = (row)=>{
    setShowOrderPreview(true)
    setDataDetailPerSequence(row)
  }

  const handleChangeDropDownPaymentMethod = (value) =>{
    if(value=="PM_002"){
      setData((prev)=>({...prev, 
        COST_CENTER_ID: "", 
        COST_CENTER_NAME: "",
        PAYMENT_METHOD: value
      }))
    }else{
      setData((prev)=>({...prev, 
        PAYMENT_METHOD: value
      }))
    }
  }

  return (
    <Container fluid id="edit-order-history-list-page">
      {showOrderPreview?
        <CardComponent
          title={`View Detail Order`}
          type="create"
        >
          <DetailOrder onBackAction={() => setShowOrderPreview(false)} data={dataDetailPerSequence} />
        </CardComponent>
      :
      (
        <CardComponent
          title={`${canEdit ? "Edit": "View"} Order`}
          type="create"
          needFooter={true}
          dataFooter={data.LOGS}
        >
          <div>
            <Row className="mb-4">
              <Col xl={6} className="pe-xl-4 create-col border-end border-3">
                <HeaderOrder data={data}/>
              </Col>
              <Col xl={6} className="ps-xl-4 create-col">
                <Row>
                  <Col>
                    <InputDropdownComponent
                      onChange={(e) => handleChangeDropDownPaymentMethod(e.target.value)}
                      value={data.PAYMENT_METHOD}
                      label="Payment Method"
                      listDropdown={listPaymentMethod}
                      labelXl="12"
                      valueIndex
                      readOnly={!canEdit}
                    />
                  </Col>
                  <Col>
                    {data.PAYMENT_METHOD === "PM_001" &&
                      (
                        <InputModalQueryComponent
                          label="Cost Center"
                          labelXl="12"
                          value={data.COST_CENTER_ID}
                          componentButton={<FaSearch />}
                          buttonOnclick={() =>handleModalOpenQueryCostCenter()}
                          formGroupClassName={"align-items-center"}
                          marginBottom="0"
                          readOnly={!canEdit}
                          disabled={!canEdit}
                        />
                      )
                    }
                    
                  </Col>
                </Row>
                <InputFileComponent
                  type="file"
                  label="Payment Attachment"
                  labelXl="12"
                  value={data.PAYMENT_ATTACHMENT_URL}
                  name={"PAYMENT_ATTACHMENT_URL"}
                  onChange={handleFileChange}
                  formGroupClassName="gx-2"
                  readOnly={!canEdit}
                  controlId="formControlPaymentAttachmentUrl"
                />
                <InputComponent
                  type="textarea"
                  label="Comment:"
                  labelXl="12"
                  placeholder={"Write your comment here..."}
                  value={data.COMMENT}
                  name={"COMMENT"}
                  onChange={(e) => handleChange("COMMENT", e.target.value)}
                  formGroupClassName="gx-2"
                  inputClassName={"border-0 header-title fw-light"}
                  readOnly={!canEdit}
                />
              </Col>
            </Row>
            <TableDetailOrder 
              canEdit={canEdit} 
              data={data.ORDER_LIST_SEQUENCE} 
              onChangePrice={handleChangePrice} 
              onChangeStatus={handleChangeStatus}
              onViewDetail={handleViewDetail}
              currentParamValue={currentParamValue}
            />
            <ButtonAction canEdit={canEdit} data={data}/>
          </div>
        </CardComponent>
      )
      }
    </Container>
  )
}

export default EditOrderHistoryList;