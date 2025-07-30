import { useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router";
import ButtonComponent from "src/components/partial/buttonComponent";
import CardComponent from "src/components/partial/cardComponent"
import InputComponent from "src/components/partial/inputComponent";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import { History } from "src/utils/router";
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage";
import { addCategory, addCategoryProduct, addPrice, deleteCategory, deleteCategoryProduct, deletePrice, fnStoreEditProductPackage, handleModalOpenQueryProductPerCategory, handleViewImage, mappingCategoryProduct, objectDetailsCategoryName, objectDetailsPriceName, objectDetailsProductPerCategoryName, objectName, prepareFormData, privilegeCampServices, privilegeTenant, titleModalQueryProduct, updateDetailsCategoryWithProduct, validateFormData } from "./productPackageFn";
import InputImageComponent from "src/components/partial/inputImageComponent";
import TableComponent from "src/components/partial/tableComponent";
import { formatNumberWithThousandSeparator } from "src/utils/helpersFunction";
import InputModalQueryComponent from "src/components/partial/inputModalQueryComponent";
import { FaSearch } from "react-icons/fa";
import { setSelectableModalQuery, setShowLoadingScreen, setShowModalGlobal } from "src/utils/store/globalSlice";
import { getProductPackageDetails } from "src/utils/api/apiMasterPage";

const EditProductPackage = () =>{
  let [searchParams] = useSearchParams()
  const location = useLocation()
  const dispatch = useDispatch()
  const { selectableModalQuery, listRoleUsers, UsersRoleFunctionRequest } = useSelector(state => state.global);
  const { categoryProduct, priceStatusProduct } = useSelector(state => state.product)

  const adminRole = listRoleUsers?.find(item=>item.CODE_ID==="ROLE_01")
	const campServices = listRoleUsers?.find(item=>item.CODE_ID==="ROLE_02")
	const tenant = listRoleUsers?.find(item=>item.CODE_ID==="ROLE_03")
  const isIncludeAdminRole = UsersRoleFunctionRequest?.find(item=>item.RoleId==adminRole?.SHORT_DESC)
	const isIncludeCampService = UsersRoleFunctionRequest?.find(item=>item.RoleId==campServices?.SHORT_DESC)
	const isIncludeTenant = UsersRoleFunctionRequest?.find(item=>item.RoleId==tenant?.SHORT_DESC)

  const [formData, setFormData] = useState({});
  const [detailsPrice, setDetailsPrice] = useState([]);
  const [detailsCategory, setDetailsCategory] = useState([]);
  const [dataFooter, setDataFooter] = useState([]);

  const fetchData =useCallback(() => {
		dispatch(setShowLoadingScreen(true))
    if(searchParams.get("q") === null){
      History.navigate(objectRouterMasterPage.productPackage.path)
    }else{
      getProductPackageDetails({}, searchParams.get("q")).then(res=>{
        const data = res.data.data

        // 🔹 1. Mapping `formData`
        const newFormData = objectName.reduce((acc, key) => {
          switch (key) {
            case objectName[5]: // STATUS
            case objectName[6]: // AVAILABLE
              acc[key] = data[key] ? "true" : "false"; // Kirim sebagai string
              break;
            case objectName[4]: // PACKAGE_IMAGE
              acc[key] = data[key] || "";
              acc[objectName[11]] = null; // Placeholder untuk file jika diubah
              break;
            case objectName[12]: // PRICE_STATUS_DESC
              acc[key] = data[key] || "-";
              break;
            default:
              acc[key] = data[key] !== undefined ? data[key] : "";
          }
          return acc;
        }, {});

        // 🔹 2. Mapping `DETAILS_CATEGORY` + Tambahkan Produk Kosong
        const newDetailsCategory = 
        (data.DETAILS_CATEGORY || []).map((category) => ({
          ...objectDetailsCategoryName.reduce((acc, key) => {
            acc[key] = category[key] !== undefined ? category[key] : "";
            return acc;
          }, {}),
          [objectDetailsCategoryName[4]]: [
            ...(category.DETAILS_CATEGORY_PRODUCT || []).map((product) =>
              objectDetailsProductPerCategoryName.reduce((acc, key) => {
                acc[key] = product[key] !== undefined ? product[key] : "";
                return acc;
              }, { done: true })
            ),
            // 🔥 Tambahkan baris kosong di setiap kategori
            objectDetailsProductPerCategoryName.reduce((acc, key) => ({ ...acc, [key]: "" }), { done: false })
          ],
          done: true,
        }));

        // 🔹 3. Mapping `DETAILS_PRICE`
        const newDetailsPrice = (data.DETAILS_PRICE || []).map((price) =>
          objectDetailsPriceName.reduce((acc, key) => {
            acc[key] = price[key] !== undefined ? price[key] : "";
            return acc;
          }, { done: true })
        );

        // 🔹 4. Set ke State
        setFormData(newFormData);

        // ✅ Set `DETAILS_CATEGORY` + Tambahkan Kategori Kosong
        setDetailsCategory([
          ...newDetailsCategory,
          {
            ...objectDetailsCategoryName.reduce((acc, key) => ({ ...acc, [key]: "" }), {}),
            [objectDetailsCategoryName[4]]: [
              objectDetailsProductPerCategoryName.reduce((acc, key) => ({ ...acc, [key]: "" }), { done: false })
            ],
            done: false,
          },
        ]);

        // ✅ Set `DETAILS_PRICE` + Tambahkan Harga Kosong
        setDetailsPrice([
          ...newDetailsPrice,
          {
            ...objectDetailsPriceName.reduce((acc, key) => ({ ...acc, [key]: "" }), { done: false }),
          },
        ]);

        setDataFooter(data.LOGS)
        dispatch(setShowLoadingScreen(false))
      }).catch(()=>{
        dispatch(setShowLoadingScreen(false))
      })
    }
	},[dispatch, searchParams])

  useEffect(()=>{
    fetchData()
  },[location, fetchData])

  useEffect(() => {
    if (selectableModalQuery?.title === titleModalQueryProduct) {
      setDetailsCategory(prev => updateDetailsCategoryWithProduct(prev, selectableModalQuery, objectDetailsCategoryName, objectDetailsProductPerCategoryName));
    }
    return () => dispatch(setSelectableModalQuery(null));
  }, [selectableModalQuery, dispatch]);

  const setStylePriceStatus = () =>{
    const selectedPriceStatus = priceStatusProduct.find(v => v.value === formData[objectName[7]]);
    const textColorStyle = { color: selectedPriceStatus?.desc?.textColor || "black" };
    const bgColorStyle = { backgroundColor: selectedPriceStatus?.desc?.bgColor || "#EEEEEE" };
    return { ...textColorStyle, ...bgColorStyle }
  }

  const handleChange = (key, value) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [key]: value };

      // Jika Status menjadi Inactive, AVAILABLE otomatis menjadi No (false) & disable
      if (key === objectName[5] && !value) { // Jika status berubah ke Inactive
        updatedData[objectName[6]] = false; // Set Available ke No
      }

      return updatedData;
    });
  };

  const handleChangeCategoryAfterPopupConfirmation = (key, value, index, detailsProduct) => {
    setDetailsCategory((prevData) =>
      prevData.map((row, idx) =>
        idx === index
          ? {
              ...row,
              [key]: value, // Ubah kategori
              ...detailsProduct,
            }
          : row
      )
    );
  }

  const handleChangeCategory = (key, value, index) => {
    if(key == objectDetailsCategoryName[2]) {
      const detailsProduct = {
        [objectDetailsCategoryName[4]]: [
          objectDetailsProductPerCategoryName.reduce((acc, key) => ({ ...acc, [key]: "" }), { done: false })
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
    setDetailsPrice(prev => addPrice(prev, objectDetailsPriceName));
  };
  
  const handleDeletePrice = (index) => {
    setDetailsPrice(prev => deletePrice(prev, index));
  };

  const handleAddCategory = () => {
    setDetailsCategory(prev => addCategory(prev, objectDetailsCategoryName, objectDetailsProductPerCategoryName));
  };
  
  const handleDeleteCategory = (index) => {
    setDetailsCategory(prev => deleteCategory(prev, index));
  };
  
  const handleAddCategoryProduct = (indexDetails, indexCategory) => {
    setDetailsCategory(prev => addCategoryProduct(prev, indexCategory, objectDetailsProductPerCategoryName));
  };
  
  const handleDeleteCategoryProduct = (indexDetails, indexCategory) => {
    setDetailsCategory(prev => deleteCategoryProduct(prev, indexDetails, indexCategory));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // 🚀 Validasi Data
    const valid = validateFormData(formData, detailsPrice, detailsCategory)
    if (!valid){
      return;
    }

    // 🚀 Buat FormData
    const bodyFormData = prepareFormData(formData, detailsPrice, detailsCategory);

    // 🔥 Debugging (Opsional)
    // console.log("🚀 FormData sebelum dikirim:");
    // for (let pair of bodyFormData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }

    fnStoreEditProductPackage(bodyFormData, formData[objectName[0]])
  }

  const logicCanEditOrNot = (inputName, type = 'input') =>{

    let result = false
    if(isIncludeAdminRole){
      if(inputName == objectName[6]){
        result = false
      }else{
        result = true
      }
    }else 
    if(formData[objectName[7]]=="PPS001" || formData[objectName[7]]=="PPS003"){
      if(isIncludeCampService){
        if(type == 'input'){
          result = privilegeCampServices.includes(inputName)
        }else{
          result = true
        }
      }
    }else if(formData[objectName[7]]=="PPS002"){
      if(isIncludeTenant){
        if(type == 'input'){
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

  const renderInputCell = (row, index, key) => (
    logicCanEditOrNot(objectName[10])?
      row.done ? 
      <div>{formatNumberWithThousandSeparator(row[key]) == 0 ? "-" : formatNumberWithThousandSeparator(row[key])}</div> 
      :
      <InputComponent type="text" label="" labelXl="0" value={row[key]} name={key} onChange={(e, formattedValue) => handleCellChangePrice(e, index, formattedValue)} marginBottom="0" needSeparator={true} />
    :
      <div>{formatNumberWithThousandSeparator(row[key]) == 0 ? "-" : formatNumberWithThousandSeparator(row[key])}</div> 
  );

  const renderInputProductPerCategory = (row, indexDetails, indexCategory, key)=>{
    if(logicCanEditOrNot(objectName[9])){
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
    }else{
      return(
        <InputModalQueryComponent
          label=""
          labelXl="0"
          value={row[key]}
          componentButton={<FaSearch />}
          buttonOnclick={() =>console.log("not authorized")}
          formGroupClassName={"align-items-center"}
          marginBottom="0"
          disabled={true}
        />
      )
    }
    
  }

  return(
    <Container fluid id="edit-product-package-page">
      <Row>
        <Col>
          <CardComponent title="Edit Package" type="create"
            needFooter={true}
            dataFooter={dataFooter}
          >
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
                    disabled={!logicCanEditOrNot(objectName[1])}
                  />
                  <Row className="gx-3 gy-3 align-items-center mb-4">
                    <Col md={6} sm={12}>
                      <InputComponent
                        type="text"
                        label="Tenant ID"
                        labelXl="4"
                        placeholder={formData[objectName[2]]}
                        name={objectName[2]}
                        onChange={(e) => handleChange(objectName[2], e.target.value)}
                        formGroupClassName={"gx-2 align-items-center"}
                        marginBottom="0"
                        required
                        disabled={true}
                        inputClassName={"border-0"}
                      />
                    </Col>
                    <Col md={6} sm={12}>
                      <InputComponent
                        type="text"
                        label=""
                        labelXl="0"
                        placeholder={formData[objectName[3]]}
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
                    readOnly={!logicCanEditOrNot(objectName[4])}
                    controlId="formImageEditProductPackage"
                  />
                  <Row>
                    <Col xl={6}>
                      <InputDropdownComponent
                        listDropdown={[
                          { value: "true", label: "Active" },
                          { value: "false", label: "Inactive" },
                        ]}
                        valueIndex
                        label="Status"
                        required
                        labelXl="4"
                        value={formData[objectName[5]]}
                        name={objectName[5]}
                        onChange={(e) => handleChange(objectName[5], e.target.value === "true")}
                        formGroupClassName="gx-3"
                        readOnly={!logicCanEditOrNot(objectName[5])}
                      />
                    </Col>
                    <Col xl={6}>
                      {
                        logicCanEditOrNot(objectName[6]) ?
                          <InputDropdownComponent
                            listDropdown={[
                              { value: "true", label: "Yes" },
                              { value: "false", label: "No" },
                            ]}
                            valueIndex
                            label="Available"
                            required
                            labelXl="4"
                            value={formData[objectName[6]]}
                            name={objectName[6]}
                            onChange={(e) => handleChange(objectName[6], e.target.value === "true")}
                            formGroupClassName="gx-2"
                            readOnly={!formData[objectName[5]]}
                          />
                        :
                          <InputDropdownComponent
                            listDropdown={[
                              { value: "true", label: "Yes" },
                              { value: "false", label: "No" },
                            ]}
                            valueIndex
                            label="Available"
                            required
                            labelXl="4"
                            value={formData[objectName[6]]}
                            name={objectName[6]}
                            onChange={() => null}
                            formGroupClassName="gx-2"
                            readOnly={true}
                          />
                      }
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
                          detailsCategory.filter((item)=>logicCanEditOrNot(objectName[9]) ? item : item.done).map((item, index)=>
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
                                    readOnly={!logicCanEditOrNot(objectName[9])}
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
                                    disabled={!logicCanEditOrNot(objectName[9])}
                                  />
                                </Col>
                                <Col>
                                  {
                                    logicCanEditOrNot(objectName[9]) ?
                                      <Stack direction="horizontal">
                                        {detailsCategory.length === index + 1 && <Button variant="link" onClick={handleAddCategory}>Add</Button>}
                                        {detailsCategory.length !== index + 1 && <Button variant="link" className="text-danger" onClick={() => handleDeleteCategory(index)}>Delete</Button>}
                                      </Stack>
                                    :
                                      null
                                  }
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
                                            logicCanEditOrNot(objectName[9]) ?
                                              <Stack direction="horizontal">
                                                {item[objectDetailsCategoryName[4]]?.length === idx + 1 && <Button variant="link" onClick={()=>handleAddCategoryProduct(idx, index)}>Add</Button>}
                                                {item[objectDetailsCategoryName[4]]?.length !== idx + 1 && <Button variant="link" className="text-danger" onClick={() => handleDeleteCategoryProduct(idx, index)}>Delete</Button>}
                                              </Stack>
                                            :
                                              null
                                          ),
                                          sortable: false,
                                          width: "100px"
                                        }
                                      ]
                                    }
                                    data={logicCanEditOrNot(objectName[9]) ? item[objectDetailsCategoryName[4]] : item[objectDetailsCategoryName[4]].filter(item=>item.done)}
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
                                    logicCanEditOrNot(objectName[10]) &&
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
                            data={logicCanEditOrNot(objectName[10]) ? detailsPrice : detailsPrice.filter((item) => item.done)}
                            paginationComponentOptions={{noRowsPerPage: true}}
                            persistTableHead
                            responsive
                            striped
                            needExport={false}
                            pagination={false}
                          />
                        </div>
                        <InputComponent
                          type="text"
                          label="Price Status"
                          labelXl="3"
                          ColXl={"4"}
                          disabled={true}
                          value={formData[objectName[12]]}
                          name={objectName[7]}
                          onChange={(e) => handleChange(objectName[12], e.target.value)}
                          formGroupClassName="gx-2"
                          inputClassName={"text-center border-0 header-title"}
                          marginBottom="2"
                          style={setStylePriceStatus()}
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
                          disabled={!logicCanEditOrNot(objectName[8])}
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

export default EditProductPackage