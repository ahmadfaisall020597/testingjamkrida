import { useEffect, useState } from "react";
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
import { fnStoreProduct } from "./productFn";
import InputModalQueryComponent from "src/components/partial/inputModalQueryComponent";
import { FaSearch } from "react-icons/fa";
import { handleModalOpenQueryTenant } from "../productPackage/productPackageFn";
import { setSelectableModalQuery } from "src/utils/store/globalSlice";
import { removeThousandSeparator } from "src/utils/helpersFunction";

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
  "TENANT_NAME", //14
]
const CreateProduct = () => {
  const dispatch = useDispatch()
  const {typeProduct, classProduct, categoryProduct, addOnProduct } = useSelector(state => state.product)

  const { profileUsers, listRoleUsers, UsersRoleFunctionRequest, selectableModalQuery } = useSelector(state=>state.global)
	const adminRole = listRoleUsers?.find(item=>item.CODE_ID==="ROLE_01")
	const campServices = listRoleUsers?.find(item=>item.CODE_ID==="ROLE_02")
  const isIncludeAdminRole = UsersRoleFunctionRequest?.find(item=>item.RoleId==adminRole?.SHORT_DESC)
	const isIncludeCampService = UsersRoleFunctionRequest?.find(item=>item.RoleId==campServices?.SHORT_DESC)

  const [selectedTenant, setSelectedTenant] = useState(null);

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
        <Button variant="link" className="text-danger" onClick={() => handleDelete(index)}>
          Delete
        </Button>
      ),
      sortable: false,
      width: "110px"
    }
  ]

  const [listAddOn, setListAddOn] = useState([]);
  const [listDropDownAddOn, setListDropDownAddOn] = useState([]);

  const [formData, setFormData] = useState({
    [objectName[0]]: "",
    [objectName[1]]: "",
    [objectName[2]]: "All",
    [objectName[3]]: "All",
    [objectName[4]]: "All",
    [objectName[5]]: "",
    [objectName[6]]: "",
    [objectName[7]]: "-",
    [objectName[8]]: null,
    [objectName[9]]: true,
    [objectName[10]]: false,
    [objectName[11]]: "",
    [objectName[13]]: "", // nanti ini diganti kalau usernya tenant admin, ambil data dari profile dia tenant admin siapa
    [objectName[14]]: ""
  });

  const titleModalQueryTenant = "List All Tenant"

  useEffect(() => {
    if(selectableModalQuery?.title == titleModalQueryTenant){
      setFormData((prev) => ({
        ...prev,
        [objectName[13]]: selectableModalQuery?.data?.TENANT_ID, 
        [objectName[14]]: selectableModalQuery?.data?.TENANT_NAME,
      }))
    }
    return(()=>dispatch(setSelectableModalQuery(null)))
  },[selectableModalQuery, dispatch])
  

  useEffect(()=>{
    if(addOnProduct?.length > 0){
      setListDropDownAddOn(addOnProduct)
    }
  },[addOnProduct])

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
      const notIncludedNullInUpdatedList = updatedList.filter(item => item.add_on_value !== "").filter(item => item.done !== false);
      const availableAddOns = addOnProduct.filter(item => !notIncludedNullInUpdatedList.some(addOn => addOn.add_on_value === item.value));
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
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
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
      bodyFormData.append(objectName[12]+(idx+1), row.add_on_value)
    })

    if (formData[objectName[8]]) {
      bodyFormData.append("ProductImageFile", formData[objectName[8]]);
      bodyFormData.append(objectName[8], formData[objectName[8]].name);
    }
    // bodyFormData.forEach((value, key)=>console.log(key, value))
    // TODO: Implement submit request using bodyFormData
    fnStoreProduct(bodyFormData)
  };

  const selectedTenantChange = (tenant)=>{
    setFormData((prev) => ({
      ...prev,
      [objectName[13]]: tenant.TENANT_ID,
      [objectName[14]]: tenant.TENANT_NAME,
    }));
    setSelectedTenant(tenant)
  }

  useEffect(()=>{
    if(profileUsers?.tenantAdmin){
      selectedTenantChange(profileUsers?.tenantAdmin[0])
    }
  },[profileUsers])

  return (
    <Container fluid id="create-product-page">
      <Row>
        <Col>
          <CardComponent title="Add Product" type="create">
            <Form onSubmit={handleSubmit}>
              <Row>
                {/* Left Column */}
                <Col xl={6} className="pe-xl-4 create-col border-end border-3">
                  {/* not used since per user only have one tenant admin */}
                  {/* <ButtonGroupTenantComponent 
                    className={"mb-4"} 
                    listTenant={profileUsers?.tenantAdmin} 
                    selectedTenant={selectedTenant} 
                    onChangeTenant={(tenant)=>selectedTenantChange(tenant)}
                  /> */}
                  <Row>
                    <Col md={6} sm={12}>
                      {
                        isIncludeAdminRole || isIncludeCampService ?
                        <InputModalQueryComponent
                          label="Tenant ID"
                          labelXl="4"
                          value={formData[objectName[13]]}
                          componentButton={<FaSearch />}
                          buttonOnclick={() =>handleModalOpenQueryTenant()}
                          formGroupClassName={"gx-2 align-items-center"}
                          required
                        />
                        :
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
                      }
                      
                    </Col>
                    <Col md={6} sm={12}>
                      <InputComponent
                        type="text"
                        label=""
                        labelXl="0"
                        placeholder={formData[objectName[14]]}
                        name={objectName[3]}
                        onChange={(e) => handleChange(objectName[14], e.target.value)}
                        disabled={true}
                        inputClassName={"border-0"}
                        formGroupClassName={"gx-3 align-items-center"}
                        marginBottom="0"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <InputComponent
                        type="text"
                        label="Name"
                        labelXl="2"
                        value={formData[objectName[1]]}
                        name={objectName[1]}
                        onChange={(e) => handleChange(objectName[1], e.target.value)}
                        required
                        formGroupClassName="gx-2"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
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
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
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
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
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
                      />
                    </Col>
                  </Row>
                  {
                    isIncludeAdminRole || isIncludeCampService ?
                      <Row>
                        <Col>
                          <InputComponent
                            type="text"
                            label="Price"
                            labelXl="2"
                            value={formData[objectName[5]]}
                            name={objectName[5]}
                            onChange={(e, formattedValue) => handleChange(objectName[5], formattedValue)}
                            formGroupClassName="gx-2"
                            disabled={!(isIncludeAdminRole || isIncludeCampService)}
                            needSeparator={true}
                          />
                        </Col>
                      </Row>
                    :
                    null
                  }
                  
                  <Row>
                    <Col>
                      <InputImageComponent
                        type="file"
                        label="Upload Picture"
                        labelXl="12"
                        value={formData[objectName[8]]}
                        name={objectName[8]}
                        onChange={handleFileChange}
                        formGroupClassName="gx-2"
                        showImagePreview
                        controlId="formImageCreateProduct"
                      />
                    </Col>
                  </Row>
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
                      />
                    </Col>
                    <Col xl={6}>
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
                        readOnly={true}
                      />
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
                      />
                      <div className="float-xl-end mt-3">
                        <ButtonComponent onClick={() => handleAdd()} type="button" variant="primary" title="Add" className={"text-white"} rounded="2" />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <InputComponent
                        type="text"
                        label="Price Status"
                        labelXl="3"
                        ColXl={"4"}
                        disabled={true}
                        value={formData[objectName[7]]}
                        name={objectName[7]}
                        onChange={(e) => handleChange(objectName[7], e.target.value)}
                        formGroupClassName="gx-2"
                        inputClassName={"text-center border-0 header-title"}
                        marginBottom="2"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
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
                      />
                    </Col>
                  </Row>
                  {/* Submit & Cancel Buttons */}
                  <Stack direction="horizontal" className="mt-4 justify-content-end" gap={3}>
                    <ButtonComponent className="px-sm-5 fw-semibold" variant="warning" title="Submit" type="submit" />
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

export default CreateProduct;
