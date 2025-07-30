import { useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap";
import { toast } from "react-toastify";
import { History } from "src/utils/router";
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage";
import ButtonComponent from "src/components/partial/buttonComponent";
import CardComponent from "src/components/partial/cardComponent";
import InputComponent from "src/components/partial/inputComponent";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import InputImageComponent from "src/components/partial/inputImageComponent";
import { useDispatch, useSelector } from "react-redux";
import "./style.scss"
import TableComponent from "src/components/partial/tableComponent";
import { fnStoreEditProduct } from "./productFn";
import { useLocation, useSearchParams } from "react-router";
import { setShowLoadingScreen } from "src/utils/store/globalSlice";
import { getProductDetails } from "src/utils/api/apiMasterPage";
import { formatNumberWithThousandSeparator, removeThousandSeparator } from "src/utils/helpersFunction";

const objectName = [
  "PRODUCT_ID", //0
  "PRODUCT_NAME", //1
  "TYPE_PRODUCT", //2
  "CLASS", //3
  "CATEGORY_PRODUCT", //4 
  "PRICE_PRODUCT", //5
  "UNIT_OF_VALUE", //6 NOT USED
  "PRICE_STATUS", //7
  "IMAGE_PRODUCT", //8
  "STATUS_PRODUCT", //9
  "AVAILABLE", //10
  "COMMENT", //11
  "ADD_ON", //12
  "TENANT_ID", //13
  "PRICE_STATUS_DESC", //14
  "TENANT_NAME", //15
]

const privilegeCampServices = [
  objectName[5], objectName[11]
]

const privilegeTenant = [
  objectName[0], objectName[1], objectName[2], objectName[3], objectName[4], objectName[6], objectName[8], objectName[9], objectName[10], objectName[11], objectName[12], objectName[13]
]

const EditProduct = () => {
  let [searchParams] = useSearchParams()
  const location = useLocation()
  const dispatch = useDispatch()
  const {typeProduct, classProduct, categoryProduct, priceStatusProduct, addOnProduct } = useSelector(state => state.product)
	const { listRoleUsers, UsersRoleFunctionRequest } = useSelector(state=>state.global)
  const adminRole = listRoleUsers?.find(item=>item.CODE_ID==="ROLE_01")
	const campServices = listRoleUsers?.find(item=>item.CODE_ID==="ROLE_02")
	const tenant = listRoleUsers?.find(item=>item.CODE_ID==="ROLE_03")
  const isIncludeAdminRole = UsersRoleFunctionRequest?.find(item=>item.RoleId==adminRole?.SHORT_DESC)
	const isIncludeCampService = UsersRoleFunctionRequest?.find(item=>item.RoleId==campServices?.SHORT_DESC)
	const isIncludeTenant = UsersRoleFunctionRequest?.find(item=>item.RoleId==tenant?.SHORT_DESC)

  const columnConfig = [
    {
      name: "Add on",
      cell: (row,index) =>(
        row.done ?
        (
          <div>{row.add_on_desc}</div>
        )
          :
        (
          <InputDropdownComponent
            listDropdown={listDropDownAddOn}
            valueIndex
            label=""
            labelXl="0"
            ColXl={12}
            value={row.add_on_value}
            name={"ADD_ON"+(index+1)}
            onChange={(e) => handleCellChange(e, index)}
            formGroupClassName="gx-0 w-100"
            marginBottom="0"
          />
        )
        
      ),
      sortable: true,
      sortField: "ADD_ON",
    },
    {
      name: "Action",
      cell: (row, index) => (
        logicCanEditOrNot(objectName[12])?
        <Button variant="link" className="text-danger" onClick={() => handleDelete(index)}>
          Delete
        </Button>
        :
        null
      ),
      sortable: false,
      width: "110px"
    }
  ]

  const [listAddOn, setListAddOn] = useState([]);
  const [listDropDownAddOn, setListDropDownAddOn] = useState([]);
  const [dataFooter, setDataFooter] = useState([]);

  const [formData, setFormData] = useState({
    [objectName[0]]: "",
    [objectName[1]]: "",
    [objectName[2]]: "All",
    [objectName[3]]: "All",
    [objectName[4]]: "All",
    [objectName[5]]: "",
    [objectName[6]]: "",
    [objectName[7]]: "",
    [objectName[8]]: null,
    [objectName[9]]: true,
    [objectName[10]]: false,
    [objectName[11]]: "",
    [objectName[13]]: "1", // nanti ini diganti kalau usernya tenant admin, ambil data dari profile dia tenant admin siapa
    [objectName[14]]: "",
    [objectName[15]]: "",
  });

  const [initialFormData, setInitialFormData] = useState({});

  const fetchData =useCallback(() => {
		dispatch(setShowLoadingScreen(true))
    if(searchParams.get("q") === null){
      History.navigate(objectRouterMasterPage.product.path)
    }else{
      getProductDetails({}, searchParams.get("q")).then(res=>{
        const data = res.data.data
        const PRICE_STATUS_DESC = priceStatusProduct.find(v=> v.value == data.PRICE_STATUS).label || "unknown status"
        const addOns = Object.keys(data)
        .filter(key => key.startsWith("ADD_ON") && data[key] !== "" && data[key] !== null)
        .map(key => {
            const addOnValue = data[key];

            // Cari add_on_desc berdasarkan value di addOnProduct
            const matchedAddOn = addOnProduct.find(addOn => addOn.value === addOnValue);
            return {
                add_on_value: addOnValue,
                add_on_desc: matchedAddOn ? matchedAddOn.label : "Unknown Add-On", // Default jika tidak ditemukan
                done: true
            };
        });
        setListAddOn(addOns);
        setFormData(prevState => ({
          ...prevState, // Tetap mempertahankan nilai lama jika tidak ada di response
          ...Object.fromEntries(
              Object.entries(data).filter(([key, value]) => value !== undefined && value !== null)
          ), // Update hanya jika ada di response API
          [objectName[14]]: PRICE_STATUS_DESC, // Selalu update PRICE_STATUS_DESC
        }));
        setInitialFormData({
          ...Object.fromEntries(
            Object.entries(data).filter(([key, value]) => value !== undefined && value !== null)
          ), // Update hanya jika ada di response API
        })
        setDataFooter(data.LOGS)
        dispatch(setShowLoadingScreen(false))
      }).catch(()=>{
        dispatch(setShowLoadingScreen(false))
      })
    }
	},[addOnProduct, dispatch, priceStatusProduct, searchParams])

  useEffect(()=>{
    fetchData()
  },[fetchData])

  useEffect(()=>{
    if(addOnProduct?.length > 0){
      setListDropDownAddOn(addOnProduct)
    }
  },[addOnProduct])

  const setStylePriceStatus = () =>{
    const selectedPriceStatus = priceStatusProduct.find(v => v.value === formData[objectName[7]]);
    const textColorStyle = { color: selectedPriceStatus?.desc?.textColor || "black" };
    const bgColorStyle = { backgroundColor: selectedPriceStatus?.desc?.bgColor || "#EEEEEE" };
    return { ...textColorStyle, ...bgColorStyle }
  }

  const handleCellChange = (e, index) => {
    const { selectedOptions } = e.target;
    setListAddOn((prevData) =>
      prevData.map((row, idx) =>
        idx === index ? { ...row, 
          add_on_desc: selectedOptions[0].label, add_on_value: selectedOptions[0].value 
        } : row
      )
    );
  };

  const handleDelete = (index) => {
    setListAddOn(prevData => {
      const updatedList = prevData.filter((_, i) => i !== index);
      const notIncludedInUpdatedList = updatedList.filter(item => item.add_on_value !== "").filter(item => item.done !== false);
      const availableAddOns = addOnProduct.filter(item => !notIncludedInUpdatedList.some(addOn => addOn.add_on_value === item.value));
      setListDropDownAddOn(availableAddOns);
      return updatedList;
    });
  }

  const handleAdd = () =>{
    if(listAddOn.length < 5){
      setListAddOn(prevData => {
        const updatedList = [...prevData.map(row => ({ ...row, done: true })), { add_on_desc: "", add_on_value: "", done: false }];
        const notIncludedNullInUpdatedList = updatedList.filter(item => item.add_on_value !== "");
        const availableAddOns = addOnProduct.filter(item => !notIncludedNullInUpdatedList.some(addOn => addOn.add_on_value === item.value));
        setListDropDownAddOn(availableAddOns);
        return updatedList;
      });
    }else{
      setListAddOn(prevData => {
        const updatedList = [...prevData.map(row => ({ ...row, done: true }))];
        const notIncludedNullInUpdatedList = updatedList.filter(item => item.add_on_value !== "");
        const availableAddOns = addOnProduct.filter(item => !notIncludedNullInUpdatedList.some(addOn => addOn.add_on_value === item.value));
        setListDropDownAddOn(availableAddOns);
        return updatedList;
      });
      // kasih warning add on tidak lebih dari 5 data
      toast.info("You have reached the maximum limit of 5 add-ons.");
    }
    
  }

  const handleChange = (key, value) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [key]: value };

      // Jika Status menjadi Inactive, AVAILABLE otomatis menjadi No (false) & disable
      if (key === objectName[9] && !value) { // Jika status berubah ke Inactive
        updatedData[objectName[10]] = false; // Set Available ke No
      }

      return updatedData;
    });
  };

  const handleFileChange = (fileData) => {
    handleChange(objectName[8], fileData || null);
  };

  const validateForm = () => {
    const requiredFields = [ objectName[1], objectName[2], objectName[3], objectName[4] ];
    
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill out ${field.replace("_", " ").toLowerCase()}.`);
        return false;
      }
    }

    switch ("All") {
      case formData[objectName[2]]:
        toast.error("Please change type product.");
        return false;
      case formData[objectName[3]]:
        toast.error("Please change class product.");
        return false;
      case formData[objectName[4]]:
        toast.error("Please change category product.");
        return false;   
      default:
        break;
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const bodyFormData = new FormData();

    // **7. Masukkan semua key dari formData ke dalam FormData**
    objectName.forEach((key) => {
      if (![objectName[0], objectName[8], objectName[6], objectName[12]].includes(key)){
        bodyFormData.append(key, typeof formData[key] == "string" ? removeThousandSeparator(formData[key]) : formData[key]);
      }
    });

    listAddOn.filter(item=>item.done).forEach((row, idx)=>{
      bodyFormData.append("ADD_ON"+(idx+1), row.add_on_value)
    })

    if (typeof formData[objectName[8]] === "string" && formData[objectName[8]]) {
      bodyFormData.append(objectName[8], formData[objectName[8]]);
    }else{
      if (typeof formData[objectName[8]] === "object" && formData[objectName[8]]) {
        bodyFormData.append("ProductImageFile", formData[objectName[8]]);
        bodyFormData.append(objectName[8], formData[objectName[8]].name);
      }
    }

    // bodyFormData.forEach((value, key)=>console.log(key, value))

    // TODO: Implement submit request using bodyFormData
    fnStoreEditProduct(bodyFormData, formData[objectName[0]])
  };

  const logicCanEditOrNot = (inputName, type="input") =>{

    let result = false
    if(isIncludeAdminRole){
      if(inputName == objectName[10]){
        result = false
      }else{
        result = true
      }
    }else if(formData[objectName[7]]=="PPS001" || formData[objectName[7]]=="PPS003"){
      if(isIncludeCampService){
        if(type == "input"){
          result = privilegeCampServices.includes(inputName)
        }else{
          result = true
        }
      }
    }else if(formData[objectName[7]]=="PPS002"){
      if(isIncludeTenant){
        if(type == "input"){
          result = privilegeTenant.includes(inputName)
        }else{
          result = true
        }
      }
    }
    if(location.pathname.includes("view")){
      result = false
    }
    return result
  }

  return (
    <Container fluid id="create-product-page">
      <Row>
        <Col>
          <CardComponent 
            title="Edit Product" 
            type="create"
            needFooter
            dataFooter={dataFooter}
          >
            <Form onSubmit={handleSubmit}>
              <Row>
                {/* Left Column */}
                <Col xl={6} className="pe-xl-4 create-col border-end border-3">
                  <Row>
                    <Col md={6} sm={12}>
                      <InputComponent
                        type="text"
                        label="Tenant ID"
                        labelXl="4"
                        value={formData[objectName[13]]}
                        name={objectName[1]}
                        onChange={(e) => handleChange(objectName[13], e.target.value)}
                        required
                        formGroupClassName={"gx-2"}
                        inputClassName={"border-0"}
                        disabled={true}
                      />
                    </Col>
                    <Col md={6} sm={12}>
                      <InputComponent
                        type="text"
                        label=""
                        labelXl="0"
                        placeholder={formData[objectName[15]]}
                        name={objectName[3]}
                        onChange={(e) => handleChange(objectName[15], e.target.value)}
                        disabled={true}
                        inputClassName={"border-0"}
                        formGroupClassName={"gx-3 align-items-center"}
                        marginBottom="0"
                      />
                    </Col>
                  </Row>
                  <InputComponent
                    type="text"
                    label="Name"
                    labelXl="2"
                    value={formData[objectName[1]]}
                    name={objectName[1]}
                    onChange={(e) => handleChange(objectName[1], e.target.value)}
                    required
                    formGroupClassName="gx-2"
                    disabled={!logicCanEditOrNot(objectName[1])}
                  /> 
                  <InputDropdownComponent
                    listDropdown={typeProduct}
                    valueIndex
                    label="Type"
                    required
                    labelXl="2"
                    value={formData[objectName[2]]}
                    name={objectName[2]}
                    onChange={(e) => handleChange(objectName[2], e.target.value)}
                    formGroupClassName="gx-2"
                    readOnly={!logicCanEditOrNot(objectName[2])}
                  />
                  <InputDropdownComponent
                    listDropdown={classProduct}
                    valueIndex
                    label="Class"
                    required
                    labelXl="2"
                    value={formData[objectName[3]]}
                    name={objectName[3]}
                    onChange={(e) => handleChange(objectName[3], e.target.value)}
                    formGroupClassName="gx-2"
                    readOnly={!logicCanEditOrNot(objectName[3])}
                  />
                  <InputDropdownComponent
                    listDropdown={categoryProduct}
                    valueIndex
                    label="Category"
                    required
                    labelXl="2"
                    value={formData[objectName[4]]}
                    name={objectName[4]}
                    onChange={(e) => handleChange(objectName[4], e.target.value)}
                    formGroupClassName="gx-2"
                    readOnly={!logicCanEditOrNot(objectName[4])}
                  />
                  <InputComponent
                    type="text"
                    label="Price"
                    labelXl="2"
                    value={formatNumberWithThousandSeparator(formData[objectName[5]])}
                    name={objectName[5]}
                    onChange={(e, formattedValue) => handleChange(objectName[5], formattedValue)}
                    formGroupClassName="gx-2"
                    disabled={!logicCanEditOrNot(objectName[5])}
                    needSeparator={true}
                  />
                  <InputImageComponent
                    type="file"
                    label="Upload Picture"
                    labelXl="12"
                    value={formData[objectName[8]]}
                    name={objectName[8]}
                    onChange={handleFileChange}
                    formGroupClassName="gx-2"
                    showImagePreview
                    readOnly={!logicCanEditOrNot(objectName[8])}
                    controlId="formImageEditProduct"
                  />
                  <Row>
                    <Col xl={6}>
                      <InputDropdownComponent
                        listDropdown={[
                          { value: true, label: "Active" },
                          { value: false, label: "Inactive" },
                        ]}
                        valueIndex
                        label="Status"
                        required
                        labelXl="4"
                        value={formData[objectName[9]]}
                        name={objectName[9]}
                        onChange={(e) => handleChange(objectName[9], e.target.value === "true")}
                        formGroupClassName="gx-3"
                        readOnly={!logicCanEditOrNot(objectName[9])}
                      />
                    </Col>
                    <Col xl={6}>
                      {
                        logicCanEditOrNot(objectName[10]) ?
                        <InputDropdownComponent
                          listDropdown={[
                            { value: true, label: "Yes" },
                            { value: false, label: "No" },
                          ]}
                          valueIndex
                          label="Available"
                          required
                          labelXl="4"
                          value={formData[objectName[10]]}
                          name={objectName[10]}
                          onChange={(e) => handleChange(objectName[10], e.target.value === "true")}
                          formGroupClassName="gx-2"
                          readOnly={!formData[objectName[9]]}
                        />
                        :
                        <InputDropdownComponent
                          listDropdown={[
                            { value: true, label: "Yes" },
                            { value: false, label: "No" },
                          ]}
                          valueIndex
                          label="Available"
                          required
                          labelXl="4"
                          value={formData[objectName[10]]}
                          name={objectName[10]}
                          onChange={() => null}
                          formGroupClassName="gx-2"
                          readOnly={true}
                        />
                      }
                      
                    </Col>
                  </Row>
                </Col>

                {/* Right Column */}
                <Col className="ps-xl-4">
                  <div className="mb-3 px-3 py-2 header-title fw-bold fs-6">
                    Add-Ons
                  </div>
                  <Row className="mb-5">
                    <Col xl={8}>
                      <TableComponent 
                        columns={columnConfig}
                        data={listAddOn}
                        persistTableHead
                        responsive
                        striped
                        key={`detail-addon-edit-${listAddOn.length}`}
                      />
                      <div className="float-xl-end mt-3">
                        {
                          logicCanEditOrNot(objectName[12])?
                            <ButtonComponent onClick={() => handleAdd()} type="button" variant="primary" title="Add" className={"text-white"} rounded="2" />
                          :
                            null
                        }
                      </div>
                    </Col>
                  </Row>
                  <InputComponent
                    type="text"
                    label="Price Status"
                    labelXl="3"
                    ColXl={"4"}
                    disabled={true}
                    value={formData[objectName[14]]}
                    name={objectName[14]}
                    onChange={(e) => handleChange(objectName[14], e.target.value)}
                    formGroupClassName="gx-2"
                    inputClassName={"text-center border-0 header-title text-capitalize"}
                    marginBottom="2"
                    style={setStylePriceStatus()}
                  />
                  <InputComponent
                    type="textarea"
                    label="Note:"
                    labelXl="12"
                    placeholder={"no records yet"}
                    value={formData[objectName[11]]}
                    name={objectName[11]}
                    onChange={(e) => handleChange(objectName[11], e.target.value)}
                    formGroupClassName="gx-2"
                    inputClassName={"border-0 header-title fw-light"}
                    disabled={!logicCanEditOrNot(objectName[11])}
                  />
                  {/* Submit & Cancel Buttons */}
                  <Stack direction="horizontal" className="mt-4 justify-content-end" gap={3}>
                    {
                      logicCanEditOrNot(null,null) &&
                      <ButtonComponent className="px-sm-5 fw-semibold" variant="warning" title="Submit" type="submit" />
                    }
                    <ButtonComponent
                      className="px-sm-5 fw-semibold"
                      variant="outline-danger"
                      onClick={() => History.navigate(objectRouterMasterPage.product.path)}
                      title="Cancel"
                    />
                  </Stack>
                </Col>
              </Row>
            </Form>
          </CardComponent>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProduct;
