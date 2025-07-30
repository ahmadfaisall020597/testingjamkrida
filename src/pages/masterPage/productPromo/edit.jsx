import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap";
import ButtonComponent from "src/components/partial/buttonComponent";
import CardComponent from "src/components/partial/cardComponent";
import { History } from "src/utils/router";
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage";
import "./style.scss";
import InputImageComponent from "src/components/partial/inputImageComponent";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import InputDateRangeComponent from "src/components/partial/inputDateRangeComponent";
import InputComponent from "src/components/partial/inputComponent";
import InputModalQueryComponent from "src/components/partial/inputModalQueryComponent";
import TableComponent from "src/components/partial/tableComponent";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setSelectableModalQuery, setShowLoadingScreen, setShowModalQuery } from "src/utils/store/globalSlice";
import { getListProduct, getListTenant, getProductPromoDetails } from "src/utils/api/apiMasterPage";
import { FaSearch } from "react-icons/fa";
import { fnStoreEditProductPromo } from "./productPromoFn";
import { useLocation, useSearchParams } from "react-router";
import { formatNumberWithThousandSeparator, removeThousandSeparator } from "src/utils/helpersFunction";

const objectName = [
  "PROMO_ID",//0
  "TENANT_ID",//1
  "TENANT_NAME",//2
  "PRODUCT_ID",//3
  "PRODUCT_NAME",//4
  "FROM_DATE",//5
  "THRU_DATE",//6
  "PRODUCT_IMAGE",//7
  "STATUS",//8
  "DETAILS",//9
]

const objectDetailsName = [
  "PROMO_ID_DETAIL",//0
  objectName[0],//1
  "PROMO_PERCENT", //2
  "PROMO_AMOUNT", //3
  "QUANTITY_FROM", //4
  "QUANTITY_TO" //5
]
const EditProductPromo = () => {
  let [searchParams] = useSearchParams()
  const location = useLocation()
  const dispatch = useDispatch()
  const [listDetails, setListDetails] = useState([]);
  const [formData, setFormData] = useState({
    [objectName[8]]: true
  });
  const [dataFooter, setDataFooter] = useState([]);
  const [canEdit, setCanEdit] = useState(false);

  const { selectableModalQuery } = useSelector(state => state.global);
  const titleModalQueryTenant = "List All Tenant"
  const titleModalQueryProduct = "List All Product"

  const fetchData =useCallback((edit) => {
		dispatch(setShowLoadingScreen(true))
    setCanEdit(edit)
    if(searchParams.get("q") === null){
      History.navigate(objectRouterMasterPage.productPromo.path)
    }else{
      getProductPromoDetails({}, searchParams.get("q")).then(res=>{
        const data = res.data.data
        // Timpa formData dengan data dari API berdasarkan objectName
        const newFormData = objectName.reduce((acc, key) => {
          let value = data[key] !== undefined ? data[key] : ""; // Default ke ""

          // Konversi FROM_DATE dan THRU_DATE ke format YYYY-MM-DD
          if (key === objectName[5] || key === objectName[6]) {
              value = value ? moment(value).format("YYYY-MM-DD") : "";
          }

          acc[key] = value;
          return acc;
        }, {});

        setFormData(newFormData);

        // Mapping DETAILS berdasarkan objectDetailsName
        const detailData = (data.DETAILS || []).map(detail => 
          objectDetailsName.reduce((acc, key) => {
              acc[key] = detail[key] !== undefined ? (detail[key] === 0 ? "" : detail[key]) : "";
              return acc;
          }, { done: true })
        );

        // Tambahkan row baru dengan key dari objectDetailsName (done: false)
        const newRow = objectDetailsName.reduce((acc, key) => {
          acc[key] = key === objectDetailsName[1] ? newFormData[objectName[0]] : "";;
          return acc;
        }, {  done: false });

        setListDetails(edit? [...detailData, newRow] : [...detailData]);
        setDataFooter(data.LOGS)
        dispatch(setShowLoadingScreen(false))
      }).catch(()=>{
        dispatch(setShowLoadingScreen(false))
      })
    }
	},[dispatch, searchParams])

  useEffect(()=>{
    let canEdit = false
		if(location.pathname.includes("edit")){
      canEdit = true
			// setCanEdit(true)
		}else{
      canEdit = false
			// setCanEdit(false)
		}
    fetchData(canEdit)
  },[location, fetchData])

  useEffect(() => {
    if(selectableModalQuery?.title == titleModalQueryTenant){
      setFormData((prev) => ({
        ...prev,
        [objectName[1]]: selectableModalQuery?.data?.TENANT_ID, 
        [objectName[2]]: selectableModalQuery?.data?.TENANT_NAME,
        [objectName[3]]: "", 
        [objectName[4]]: ""
      }))
    }
    if(selectableModalQuery?.title == titleModalQueryProduct){
      setFormData((prev) => ({
        ...prev,
        [objectName[3]]: selectableModalQuery?.data?.PRODUCT_ID, 
        [objectName[4]]: selectableModalQuery?.data?.PRODUCT_NAME
      }))
    }
    return(()=>dispatch(setSelectableModalQuery(null)))
  },[selectableModalQuery, dispatch])

  const validateRow = (row, prevRow) => {
    let prevRowQuantityTo = prevRow?.[objectDetailsName[5]]

    if(typeof prevRowQuantityTo === "string"){
      prevRowQuantityTo = prevRowQuantityTo.replace(".","")
    }

    if(!row[objectDetailsName[5]] && !row[objectDetailsName[4]]){
      return "You must fill Quantity From or Quantity To";
    }
    if ((row[objectDetailsName[2]] && row[objectDetailsName[3]]) || (!row[objectDetailsName[2]] && !row[objectDetailsName[3]])) {
      return "You must fill either Discount Percent or Discount Amount, but not both.";
    }
    if (row[objectDetailsName[5]] && Number(row[objectDetailsName[4]]?.replace(".","")) > Number(row[objectDetailsName[5]]?.replace(".",""))) {
      return "Quantity From value cannot greater than Quantity To value.";
    }
    if (prevRow && prevRow[objectDetailsName[5]] && Number(row[objectDetailsName[4]]?.replace(".","")) < Number(prevRowQuantityTo)) {
      return "Quantity From value cannot smaller than Quantity To value from the previous row.";
    }
    if (prevRow && prevRow[objectDetailsName[5]] && Number(row[objectDetailsName[4]]?.replace(".","")) == Number(prevRowQuantityTo)) {
      return "Quantity From value cannot be the same as Quantity To value from the previous row.";
    }
    return "";
  };

  const checkingString = (str) => {
    if (typeof str === "string" && str.includes(".")) {
      str = removeThousandSeparator(str); // Hapus titik untuk nilai string
    }

    return str;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const bodyFormData = new FormData();

    objectName.forEach((key) => {
      if (![objectName[9], objectName[7]].includes(key)){
        bodyFormData.append(key, formData[key]);
      }
      if(key == objectName[9]){
        const listDataFiltered = listDetails.filter((v)=> v.done == true).map((item) => ({
          ...item,
          [objectDetailsName[2]]: item[objectDetailsName[2]] == "" ? 0: checkingString(item[objectDetailsName[2]]), // Ganti null dengan 0
          [objectDetailsName[3]]: item[objectDetailsName[3]] == "" ? 0: checkingString(item[objectDetailsName[3]]), // Ganti null dengan 0
          [objectDetailsName[4]]: item[objectDetailsName[4]] == "" ? 0: checkingString(item[objectDetailsName[4]]), // Ganti null dengan 0
          [objectDetailsName[5]]: item[objectDetailsName[5]] == "" ? 0: checkingString(item[objectDetailsName[5]]), // Ganti null dengan 0
        }));
        bodyFormData.append("DETAILS_JSON", JSON.stringify(listDataFiltered))
      }
      if(key == objectName[7]){
        if (typeof formData[objectName[7]] === "string" && formData[objectName[7]]) {
          bodyFormData.append(key, formData[key]);
        }else{
          if (typeof formData[objectName[7]] === "object" && formData[objectName[7]]) {
            bodyFormData.append("ProductImageFile", formData[key]);
            bodyFormData.append(key, formData[key].name);
          }
        }
      }
    });

    // bodyFormData.forEach((value, key)=>console.log(key, value))
    // TODO: Implement submit request using bodyFormData
    fnStoreEditProductPromo(bodyFormData, formData[objectName[0]])
  }

  const handleAdd = () => {
    const lastRow = listDetails[listDetails.length - 1];
    const prevRow = listDetails.length > 1 ? listDetails[listDetails.length - 2] : null;

    const validationError = validateRow(lastRow, prevRow);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setListDetails((prevData) => [
      ...prevData.map((row) => ({ ...row, done: true })), // Menandai semua row sebelumnya sebagai "done"
      objectDetailsName.reduce((acc, key) => ({ 
        ...acc, 
        [key]: key === objectDetailsName[1] ? (formData[objectName[0]] || "") : "" // PROMO_ID diambil dari formData
      }), { done: false }) // Row baru dengan done: false
    ]);
  };


  const handleDelete = (index) => {
    setListDetails((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCellChange = (e, index, formattedValue) => {
    const { name } = e.target;
    setListDetails((prevData) =>
      prevData.map((row, idx) =>
        idx === index ? { ...row, [name]: formattedValue } : row
      )
    );
  };

  const handleFileChange = (fileData) => {
    handleChange(objectName[7], fileData || null);
  };

  const handleModalOpenQueryTenant = () => {
    const data = getListTenant;

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
        title: titleModalQueryTenant,
        data: data,
        columnConfig: columnConfig,
        searchKey: "tenantName",
        searchLabel: "Tenant Name",
        usingPaginationServer: true
      }
    }))
  }

  const handleModalOpenQueryProduct = () => {
    const data = getListProduct;
      
    const columnConfig = [
      {
        name: "Product ID",
        selector: row=> row.PRODUCT_ID,
        sortable: true,
        sortField: "PRODUCT_ID",
        width: "120px"
      },
      {
        name: "Name",
        selector: row=> row.PRODUCT_NAME,
        sortable: true,
        sortField: "PRODUCT_NAME",
      },
      {
        name: "Status",
        cell: row =>(
          <div className={`fw-bold text-${row.STATUS_PRODUCT? 'success': 'danger'}`}>{row.STATUS_PRODUCT? 'Active': 'Inactive'}</div>
        ),
        sortable: true,
        sortField: "STATUS_PRODUCT",
        width: "150px"
      },
    ]
    dispatch(setShowModalQuery({show:true,
      content:{
        title: titleModalQueryProduct,
        data: data,
        columnConfig: columnConfig,
        searchKey: "productName",
        searchLabel: "Product Name",
        usingPaginationServer: true,
        params:{
          categoryProduct: "",
          typeProduct: "",
          priceStatus: "",
          available: true,
          tenantId: formData[objectName[1]]
        }
      }
    }))
  }

  const renderInputCell = (row, index, key, suffix = "") => (
    row.done ? <div>{formatNumberWithThousandSeparator(row[key]) || "-"}{row[key]? suffix : null}</div> :
    <InputComponent type="text" label="" labelXl="0" value={row[key]} name={key} onChange={(e, formattedValue) => handleCellChange(e, index, formattedValue)} needSeparator={true} marginBottom="0" />
  );

  return(
    <Container fluid id="create-product-promo-page">
      <Row>
        <Col>
          <CardComponent title="Edit Promo" type="create"
            needFooter={true}
            dataFooter={dataFooter}
          >
            <Form onSubmit={handleSubmit}>
              <Row>
                {/* Left Column */}
                <Col xl={6} className="pe-xl-4 create-col border-end border-3">
                  <Row className="gx-3 align-items-center mb-2">
                    <Col>
                      <InputModalQueryComponent
                        label="Tenant ID"
                        labelXl="4"
                        value={formData[objectName[1]]}
                        componentButton={<FaSearch />}
                        buttonOnclick={() =>handleModalOpenQueryTenant()}
                        formGroupClassName={"gx-2 align-items-center"}
                        required
                        marginBottom="0"
                        disabled={true}
                      />
                    </Col>
                    <Col>
                      <InputComponent
                        type="text"
                        label=""
                        labelXl="0"
                        placeholder={formData[objectName[2]]}
                        name={objectName[2]}
                        onChange={(e) => handleChange(objectName[2], e.target.value)}
                        disabled={true}
                        inputClassName={"border-0"}
                        marginBottom="0"
                      />
                    </Col>
                  </Row>
                  <Row className="gx-3 align-items-center mb-2">
                    <Col>
                      <InputModalQueryComponent
                        label="Product ID"
                        labelXl="4"
                        value={formData[objectName[3]]}
                        componentButton={<FaSearch />}
                        buttonOnclick={() =>handleModalOpenQueryProduct()}
                        formGroupClassName={"gx-2 align-items-center"}
                        required
                        marginBottom="0"
                        disabled={true}
                      />
                    </Col>
                    <Col>
                      <InputComponent
                        type="text"
                        label=""
                        labelXl="0"
                        placeholder={formData[objectName[4]]}
                        name={objectName[4]}
                        onChange={(e) => handleChange(objectName[4], e.target.value)}
                        formGroupClassName="gx-2"
                        disabled={true}
                        inputClassName={"border-0"}
                        marginBottom="0"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={8}>
                      <InputDateRangeComponent
                        labelXl="12"
                        formGroupClassName={"dateRangeProductPromo"}
                        startDate={formData[objectName[5]]}
                        endDate={formData[objectName[6]]}
                        onChangeStartDate={(e)=>handleChange(objectName[5], e)}
                        onChangeEndDate={(e)=>handleChange(objectName[6], e)}
                        required
                        readOnly={!canEdit}
                      />
                    </Col>
                  </Row>
                  <InputImageComponent
                    type="file"
                    label="Upload Picture"
                    labelXl="12"
                    value={formData[objectName[7]]}
                    name={objectName[7]}
                    onChange={handleFileChange}
                    formGroupClassName="gx-2"
                    showImagePreview
                    readOnly={!canEdit}
                    controlId="formImageEditProductPromo"
                  />
                  <InputDropdownComponent
                    listDropdown={[
                      { value: true, label: "Active" },
                      { value: false, label: "Inactive" },
                    ]}
                    valueIndex
                    label="Status"
                    required
                    labelXl="2"
                    ColXl={3}
                    value={formData[objectName[8]]}
                    name={objectName[8]}
                    onChange={(e) => handleChange(objectName[8], e.target.value === "true")}
                    formGroupClassName="gx-1"
                    readOnly={!canEdit}
                  />
                </Col>

                {/* Right Column */}
                <Col className="ps-xl-4">
                  <div className="mb-1 px-3 py-2 header-title fw-bold fs-6">
                    <Row>
                      <Col>
                        Quantity
                      </Col>
                      <Col>
                        Discount
                      </Col>
                    </Row>
                  </div>
                  <TableComponent 
                    key={`detail-promo-create-${listDetails.length}`}
                    columns={
                      canEdit ?
                      [
                        { name: "From", cell: (row, index) => renderInputCell(row, index, objectDetailsName[4]), width:"15%" },
                        { name: "To", cell: (row, index) => renderInputCell(row, index, objectDetailsName[5]), width:"15%" },
                        { name: "Percent", cell: (row, index) => renderInputCell(row, index, objectDetailsName[2], "%") },
                        { name: "Amount", cell: (row, index) => renderInputCell(row, index, objectDetailsName[3]) },
                        {
                          name: "Actions",
                          cell: (row, index) => (
                            <Stack direction="horizontal">
                              {listDetails.length === index + 1 && <Button variant="link" onClick={handleAdd}>Add</Button>}
                              {listDetails.length !== index + 1 && <Button variant="link" className="text-danger" onClick={() => handleDelete(index)}>Delete</Button>}
                            </Stack>
                          ),
                          sortable: false,
                          width: "18%"
                        }
                      ]
                      :
                      [
                        { name: "From", cell: (row, index) => renderInputCell(row, index, objectDetailsName[4]), width:"15%" },
                        { name: "To", cell: (row, index) => renderInputCell(row, index, objectDetailsName[5]), width:"15%" },
                        { name: "Percent", cell: (row, index) => renderInputCell(row, index, objectDetailsName[2], "%") },
                        { name: "Amount", cell: (row, index) => renderInputCell(row, index, objectDetailsName[3]) },
                      ]
                    }
                    data={listDetails}
                    paginationComponentOptions={{noRowsPerPage: true}}
                    persistTableHead
                    responsive
                    striped
                    needExport={false}
                    pagination={false}
                  />
                  {/* Submit & Cancel Buttons */}
                  {
                    canEdit && (
                      <Stack direction="horizontal" className="mt-4 justify-content-end" gap={3}>
                        <ButtonComponent className="px-sm-5 fw-semibold" variant="warning" title="Submit" type="submit" />
                        <ButtonComponent
                          className="px-sm-5 fw-semibold"
                          variant="outline-danger"
                          onClick={() => History.navigate(objectRouterMasterPage.productPromo.path)}
                          title="Cancel"
                        />
                      </Stack>
                    )
                  }
                </Col>
              </Row>
            </Form>
          </CardComponent>
        </Col>
      </Row>
    </Container>
  )
}

export default EditProductPromo