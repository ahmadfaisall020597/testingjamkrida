import { useCallback, useEffect, useState } from "react"
import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap"
import { FaSearch } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import ButtonComponent from "src/components/partial/buttonComponent"
import CardComponent from "src/components/partial/cardComponent"
import InputComponent from "src/components/partial/inputComponent"
import InputDropdownComponent from "src/components/partial/inputDropdownComponent"
import InputImageComponent from "src/components/partial/inputImageComponent"
import InputModalQueryComponent from "src/components/partial/inputModalQueryComponent"
import TableComponent from "src/components/partial/tableComponent"
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage"
import { setError, setSelectableModalQuery, setShowModalGlobal } from "src/utils/store/globalSlice"
import { addCategory, addCategoryProduct, addPrice, deleteCategory, deleteCategoryProduct, deletePrice, fnStoreProductPackage, handleModalOpenQueryProductPerCategory, handleModalOpenQueryTenant, handleViewImage, mappingCategoryProduct, objectDetailsCategoryName, objectDetailsPriceName, objectDetailsProductPerCategoryName, objectName, prepareFormData, titleModalQueryProduct, titleModalQueryTenant, updateDetailsCategoryWithProduct, updateFormDataWithTenant, validateFormData } from "./productPackageFn"
import { formatNumberWithThousandSeparator } from "src/utils/helpersFunction"
import { History } from "src/utils/router"
import { fnGetTenantDetails } from "../tenant/TenantFn"

const CreateProductPackage = () => {
  const dispatch = useDispatch()
  const { profileUsers, listRoleUsers, UsersRoleFunctionRequest, selectableModalQuery } = useSelector(state => state.global);
  const { categoryProduct } = useSelector(state => state.product)

  const adminRole = listRoleUsers?.find(item=>item.CODE_ID==="ROLE_01")
	const campServices = listRoleUsers?.find(item=>item.CODE_ID==="ROLE_02")
  const isIncludeAdminRole = UsersRoleFunctionRequest?.find(item=>item.RoleId==adminRole?.SHORT_DESC)
	const isIncludeCampService = UsersRoleFunctionRequest?.find(item=>item.RoleId==campServices?.SHORT_DESC)

  const filteredObjectDetailsPriceName = objectDetailsPriceName.filter(
    (key) => key !== objectDetailsPriceName[0] && key !== objectDetailsPriceName[1]
  );

  const filteredObjectDetailsCategoryName = objectDetailsCategoryName.filter(
    (key) => key !== objectDetailsCategoryName[0] && key !== objectDetailsCategoryName[1] && key !== objectDetailsCategoryName[4]
  );

  const filteredObjectDetailsProductPerCategoryName = objectDetailsProductPerCategoryName.filter(
    (key) => key !== objectDetailsProductPerCategoryName[0] && key !== objectDetailsProductPerCategoryName[1] 
  );
  
  const fillDataDetailsCategory = filteredObjectDetailsCategoryName.reduce((acc, key) => ({ ...acc, [key]: "" }), 
  { 
    done: false,
    [objectDetailsCategoryName[4]]: [
      filteredObjectDetailsProductPerCategoryName.reduce((acc, key) => ({ ...acc, [key]: "" }), { done: false })
    ]
  })

  const [formData, setFormData] = useState({
    [objectName[5]]: true,
    [objectName[6]]: false,
    [objectName[7]]: "-"
  });

  const [detailsPrice, setDetailsPrice] = useState([
    filteredObjectDetailsPriceName.reduce((acc, key) => ({ ...acc, [key]: "" }), { done: false })
  ]);

  const [detailsCategory, setDetailsCategory] = useState([fillDataDetailsCategory]);

  useEffect(() => {
    if (selectableModalQuery?.title === titleModalQueryTenant) {
      setFormData(prev => updateFormDataWithTenant(prev, selectableModalQuery, objectName));
    }

    if (selectableModalQuery?.title === titleModalQueryProduct) {
      setDetailsCategory(prev => updateDetailsCategoryWithProduct(prev, selectableModalQuery, objectDetailsCategoryName, objectDetailsProductPerCategoryName));
    }

    return () => dispatch(setSelectableModalQuery(null));
  }, [selectableModalQuery, dispatch]);

  const selectedTenantChange = (tenant)=>{
    const tenantData = {
      data: {
        TENANT_ID: tenant.TENANT_ID,
        TENANT_NAME: tenant.TENANT_NAME
      }
    }
    setFormData(prev => updateFormDataWithTenant(prev, tenantData, objectName));
  }

  const fetchDataDetailTenant = useCallback((tenantId)=>{
    if(isIncludeAdminRole || isIncludeCampService){
			tenantId = null
		}
    if(tenantId){
      fnGetTenantDetails(tenantId).then(res=>{
        if(res){
          const availableAddPackage = res.ADD_PACKAGE
          if(!availableAddPackage){
            dispatch(setError(
              { 
                status: 401, 
                message: "NOT AUTHORIZED TO ADD PACKAGE", 
                data: {data:"after this message, you will redirect to master package"} 
              }
            ));
            setTimeout(()=>{
              History.navigate(objectRouterMasterPage.productPackage.path)
            },[1000])
          }
        }
      })
    }

  },[dispatch, isIncludeAdminRole, isIncludeCampService])

  useEffect(()=>{
    if(profileUsers?.tenantAdmin){
      selectedTenantChange(profileUsers?.tenantAdmin[0])
      fetchDataDetailTenant(profileUsers?.tenantAdmin[0].TENANT_ID)
    }
  },[fetchDataDetailTenant, profileUsers])

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleChangeCategoryAfterPopupConfirmation = (key, value, index, detailsProduct) => {
    setDetailsCategory((prevData) =>
      prevData.map((row, idx) =>
        idx === index ? { ...row, [key]: value, ...detailsProduct } : row
      )
    );
  }

  const handleChangeCategory = (key, value, index) => {
    if(key == objectDetailsCategoryName[2]) {
      const detailsProduct = {
        [objectDetailsCategoryName[4]]: [
          filteredObjectDetailsProductPerCategoryName.reduce((acc, key) => ({ ...acc, [key]: "" }), { done: false })
        ]
      }
      dispatch(setShowModalGlobal({
        show: true,
        content: {
          captionText: "Please note that the product list in this category will be reset.",
          questionText: "Do you want to proceed with the category change?",
          buttonLeftText: "Yes, Change Category",
          buttonRightText: "Cancel",
          buttonLeftFn: ()=>handleChangeCategoryAfterPopupConfirmation(key, value, index, detailsProduct),
          buttonRightFn: null
        }
      }))
    }else{
      handleChangeCategoryAfterPopupConfirmation(key, value, index, null)
    }
  };

  const handleCellChangePrice = (e, index, formattedValue) => {
    const { name } = e.target;

    setDetailsPrice((prevData) =>
      prevData.map((row, idx) =>
        idx === index ? { ...row, [name]: formattedValue } : row
      )
    );
  };

  const handleFileChange = (fileData) => {
    handleChange(objectName[4], fileData || null);
  };
  
  const handleAddPrice = () => {
    setDetailsPrice(prev => addPrice(prev, filteredObjectDetailsPriceName));
  };
  
  const handleDeletePrice = (index) => {
    setDetailsPrice(prev => deletePrice(prev, index));
  };
  
  const handleAddCategory = () => {
    setDetailsCategory(prev => addCategory(prev, filteredObjectDetailsCategoryName, filteredObjectDetailsProductPerCategoryName));
  };
  
  const handleDeleteCategory = (index) => {
    setDetailsCategory(prev => deleteCategory(prev, index));
  };
  
  const handleAddCategoryProduct = (indexDetails, indexCategory) => {
    setDetailsCategory(prev => addCategoryProduct(prev, indexCategory, filteredObjectDetailsProductPerCategoryName));
  };
  
  const handleDeleteCategoryProduct = (indexDetails, indexCategory) => {
    setDetailsCategory(prev => deleteCategoryProduct(prev, indexDetails, indexCategory));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // 🚀 Validasi Data
    if (!validateFormData(formData, detailsPrice, detailsCategory)) return;

    // 🚀 Buat FormData
    const bodyFormData = prepareFormData(formData, detailsPrice, detailsCategory);

    // 🔥 Debugging (Opsional)
    // console.log("🚀 FormData sebelum dikirim:");
    // for (let pair of bodyFormData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }

    fnStoreProductPackage(bodyFormData)
  }

  const renderInputCell = (row, index, key) => (
    row.done ? 
    <div>{formatNumberWithThousandSeparator(row[key])}</div> 
    :
    <InputComponent type="text" label="" labelXl="0" value={row[key]} name={key} onChange={(e, formattedValue) => handleCellChangePrice(e, index, formattedValue)} marginBottom="0" needSeparator={true} />
  );

  const renderInputProductPerCategory = (row, indexDetails, indexCategory, key)=>{
    return(
      <InputModalQueryComponent
        label=""
        labelXl="0"
        value={row[key]}
        componentButton={<FaSearch />}
        buttonOnclick={() =>handleModalOpenQueryProductPerCategory(formData[objectName[2]], detailsCategory[indexCategory][objectDetailsCategoryName[2]], {indexDetails, indexCategory})}
        formGroupClassName={"align-items-center"}
        marginBottom="0"
        disabled={!formData[objectName[2]] || !detailsCategory[indexCategory][objectDetailsCategoryName[2]]}
      />
    )
  }

  return(
    <Container fluid id="create-product-package-page">
      <Row>
        <Col>
          <CardComponent title="Add Package" type="create">
            <Form onSubmit={handleSubmit}>
              <Row>
                {/* Left Column */}
                <Col xl={6} className="pe-xl-4 create-col border-end border-3">
                  <InputComponent
                    type="text"
                    label="Name"
                    labelXl="2"
                    value={formData[objectName[1]]}
                    name={objectName[1]}
                    onChange={(e) => handleChange(objectName[1], e.target.value)}
                    formGroupClassName={"gx-2 align-items-center"}
                    marginBottom="4"
                    required
                  />
                  <Row className="gx-3 gy-3 align-items-center mb-4">
                    <Col md={6} sm={12}>
                      {
                        isIncludeAdminRole || isIncludeCampService ?
                          <InputModalQueryComponent
                            label="Tenant ID"
                            labelXl="4"
                            value={formData[objectName[2]]}
                            componentButton={<FaSearch />}
                            buttonOnclick={() =>handleModalOpenQueryTenant()}
                            formGroupClassName={"gx-2 align-items-center"}
                            required
                            marginBottom="0"
                          />
                        :
                          <InputComponent
                            type="text"
                            label="Tenant ID"
                            labelXl="4"
                            value={formData[objectName[2]]}
                            name={objectName[2]}
                            onChange={(e) => handleChange(objectName[2], e.target.value)}
                            required
                            formGroupClassName={"gx-2 align-items-center"}
                            inputClassName={"border-0"}
                            disabled={true}
                            marginBottom="0"
                          />
                      }

                    </Col>
                    <Col md={6} sm={12}>
                      <InputComponent
                        type="text"
                        label=""
                        labelXl="0"
                        value={formData[objectName[3]]}
                        name={objectName[3]}
                        onChange={(e) => handleChange(objectName[3], e.target.value)}
                        disabled={true}
                        inputClassName={"border-0"}
                        marginBottom="0"
                      />
                    </Col>
                  </Row>
                  <InputImageComponent
                    type="file"
                    label="Upload Picture"
                    labelXl="12"
                    value={formData[objectName[4]]}
                    name={objectName[4]}
                    onChange={handleFileChange}
                    formGroupClassName="gx-2"
                    showImagePreview
                    controlId="formImageCreateProductPackage"
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
                        value={formData[objectName[5]]}
                        name={objectName[5]}
                        onChange={(e) => handleChange(objectName[5], e.target.value === "true")}
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
                        value={formData[objectName[6]]}
                        name={objectName[6]}
                        onChange={(e) => handleChange(objectName[6], e.target.value === "true")}
                        formGroupClassName="gx-2"
                        readOnly={true}
                      />
                    </Col>
                  </Row>
                </Col>
                {/* Right Column */}
                <Col xl={6} className="m-0 p-0 right-side-col">
                  <div className="overflow-hidden h-100">
                    <Stack className="h-100">
                      <div className=" mb-4 mx-4 px-3 py-2 header-title fw-bold fs-6">
                        Add Detail Package
                      </div>
                      <div className="overflow-y-scroll ps-4 pe-3 pb-4">
                        {
                          detailsCategory.map((item, index)=>
                            <div className="mb-4 border-bottom border-2 pb-4" key={index}>
                              <Row className="gx-2">
                                <Col xl={6}>
                                  <InputDropdownComponent
                                    listDropdown={mappingCategoryProduct(categoryProduct)}
                                    valueIndex
                                    label="Category"
                                    labelXl="4"
                                    value={item[objectDetailsCategoryName[2]]}
                                    name={objectDetailsCategoryName[2]}
                                    onChange={(e) => handleChangeCategory(objectDetailsCategoryName[2], e.target.value, index)}
                                    formGroupClassName="gx-0"
                                  />
                                </Col>
                                <Col xl={4}>
                                  <InputComponent
                                    type="number"
                                    label="Quantity"
                                    labelXl="5"
                                    ColXl={6}
                                    value={item[objectDetailsCategoryName[3]]}
                                    name={objectDetailsCategoryName[3]}
                                    onChange={(e) => handleChangeCategory(objectDetailsCategoryName[3], e.target.value, index)}
                                    formGroupClassName={"gx-0 align-items-center justify-content-end"}
                                  />
                                </Col>
                                <Col>
                                  <Stack direction="horizontal">
                                    {detailsCategory.length === index + 1 && <Button variant="link" onClick={handleAddCategory}>Add</Button>}
                                    {detailsCategory.length !== index + 1 && <Button variant="link" className="text-danger" onClick={() => handleDeleteCategory(index)}>Delete</Button>}
                                  </Stack>
                                </Col>
                              </Row>
                              <div className="details-per-category">
                                <p className="m-0 fw-bold">Product List</p>
                                <div>
                                  <TableComponent
                                    key={`detail-product-per-category-create-${item[objectDetailsCategoryName[4]]?.length}-${index}`}
                                    columns={
                                      [
                                        { name: "Product ID", cell:(row, idx)=> renderInputProductPerCategory(row, idx, index, objectDetailsProductPerCategoryName[2]), width:"120px" },
                                        { name: "Product Name", selector: row=>row[objectDetailsProductPerCategoryName[3]], width: "180px"},
                                        { name: "Type", selector: row=>row[objectDetailsProductPerCategoryName[6]],width: "150px"},
                                        { name: "Image", cell:(row)=>(
                                          !row.PRODUCT_IMAGE ? 
                                          "No Image" 
                                          :
                                          <Button variant="link" onClick={()=>handleViewImage(row[objectDetailsProductPerCategoryName[2]])}>View Image</Button>
                                        ), width: "130px"},
                                        {
                                          name: "Actions",
                                          cell: (row, idx) => (
                                            <Stack direction="horizontal">
                                              {item[objectDetailsCategoryName[4]]?.length === idx + 1 && <Button variant="link" onClick={()=>handleAddCategoryProduct(idx, index)}>Add</Button>}
                                              {item[objectDetailsCategoryName[4]]?.length !== idx + 1 && <Button variant="link" className="text-danger" onClick={() => handleDeleteCategoryProduct(idx, index)}>Delete</Button>}
                                            </Stack>
                                          ),
                                          sortable: false,
                                          width: "100px"
                                        }
                                      ]
                                    }
                                    data={item[objectDetailsCategoryName[4]]}
                                    paginationComponentOptions={{noRowsPerPage: true}}
                                    persistTableHead
                                    responsive
                                    striped
                                    needExport={false}
                                    pagination={false}
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        }
                        {
                          isIncludeAdminRole || isIncludeCampService ?
                          <>
                            <div className="mb-3 px-3 py-2 header-title fw-bold fs-6">
                              Detail Price
                            </div>
                            <div className="mb-3">
                              <TableComponent 
                                key={`detail-product-price-create-${detailsPrice.length}`}
                                columns={
                                  [
                                    { name: "Portion from", cell: (row, index) => renderInputCell(row, index, objectDetailsPriceName[2]), width:"24%" },
                                    { name: "Portion to", cell: (row, index) => renderInputCell(row, index, objectDetailsPriceName[3]), width:"24%" },
                                    { name: "Price per portion", cell: (row, index) => renderInputCell(row, index, objectDetailsPriceName[4]) },
                                    {
                                      name: "Actions",
                                      cell: (row, index) => (
                                        <Stack direction="horizontal">
                                          {detailsPrice.length === index + 1 && <Button variant="link" onClick={handleAddPrice}>Add</Button>}
                                          {detailsPrice.length !== index + 1 && <Button variant="link" className="text-danger" onClick={() => handleDeletePrice(index)}>Delete</Button>}
                                        </Stack>
                                      ),
                                      sortable: false,
                                      width: "18%"
                                    }
                                  ]
                                }
                                data={detailsPrice}
                                paginationComponentOptions={{noRowsPerPage: true}}
                                persistTableHead
                                responsive
                                striped
                                needExport={false}
                                pagination={false}
                              />
                            </div>
                          </>
                          :
                          null
                        }

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
                        <InputComponent
                          type="textarea"
                          label="Note:"
                          labelXl="12"
                          placeholder={"no records yet"}
                          value={formData[objectName[8]]}
                          name={objectName[8]}
                          onChange={(e) => handleChange(objectName[8], e.target.value)}
                          formGroupClassName="gx-2"
                          inputClassName={"border-0 header-title fw-light"}
                        />
                        {/* Submit & Cancel Buttons */}
                        <Stack direction="horizontal" className="mt-4 justify-content-end" gap={3}>
                          <ButtonComponent className="px-sm-5 fw-semibold" variant="warning" title="Submit" type="submit" />
                          <ButtonComponent
                            className="px-sm-5 fw-semibold"
                            variant="outline-danger"
                            onClick={() => History.navigate(objectRouterMasterPage.productPackage.path)}
                            title="Cancel"
                          />
                        </Stack>
                      </div>
                    </Stack>
                  </div>
                </Col>
              </Row>
            </Form>
          </CardComponent>
        </Col>
      </Row>
    </Container>
  )
}

export default CreateProductPackage