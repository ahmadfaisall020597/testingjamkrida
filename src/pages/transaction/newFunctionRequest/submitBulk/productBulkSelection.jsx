import { useDispatch, useSelector } from "react-redux";
import DateTimeSelection from "../submitNonBulk/moduleProductSelection/dateTimeSelection"
import { useLocation } from "react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import objectRouterFunctionRequest from "src/utils/router/objectRouter.functionRequest";
import { getBulkListData, saveBulkListData, saveBulkStepFunctionRequest } from "src/utils/localStorage";
import { isCartEmpty, objectPackageProductSelection, validateAndNotify, validateCartPackage, validateCartProduct, validateDeliveryDate, validateMinimumOrderPerPortion, validatePaymentProductPackage, validateRequestDataRoomSelection, validateRequestDataTenantSelection } from "../newFunctionRequestFn";
import moment from "moment";
import { Col, Row, Stack } from "react-bootstrap";
import ButtonComponent from "src/components/partial/buttonComponent";
import { setBulkStepNameComponent } from "../newFunctionRequestSlice";
import InputSearchComponent from "src/components/partial/inputSearchComponent";
import { FaCaretSquareLeft, FaCaretSquareRight, FaSearch } from "react-icons/fa";
import _ from "lodash";
import LoadingSpinner from "src/components/partial/spinnerComponent";
import PackageItem from "../submitNonBulk/moduleProductSelection/PackageItem";
import ProductItem from "../submitNonBulk/moduleProductSelection/ProductItem";
import { getListPackageTransaction, getUnitMenu } from "src/utils/api/apiTransaction";
import { toast } from "react-toastify";

const SearchSelection = ({ label="", value, onChange, placeholder, className }) => {
  return (
    <InputSearchComponent
      label={label}
      value={value}
      onChange={(e)=>onChange(e, "onchange")}
      placeholder={placeholder}
      componentButton={<FaSearch />}
      buttonOnclick={() => onChange(null, "button")}
      formGroupClassName={className}
      labelXl="4"
    />
  );
};

const ProductBulkSelection = () =>{
  const dispatch = useDispatch()
  const location = useLocation()
  const [localState, setLocalState] = useState([]);
  const [tenantId, setTenantId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [cart, setCart] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [listDataProduct, setListDataProduct] = useState([]);

  const [cartPackage, setCartPackage] = useState([]);
  const [loadingPackage, setLoadingPackage] = useState(true);
  const [listDataPackage, setListDataPackage] = useState([]);

  const [currentSearchProductName, setCurrentSearchProductName] = useState("");
  const [currentSearchProductPackageName, setCurrentSearchProductPackageName] = useState("");

  const [searchTermProductName, setSearchTermProductName] = useState("");
  const [searchTermProductPackageName, setSearchTermProductPackageName] = useState("");

  const debounceSearchProductPackageNameRef = useRef(null);
  const debounceSearchProductNameRef = useRef(null);
 
  const {bulkStepNameComponent} = useSelector(state => state.newFunctionRequest)

  const totalCartItems = useMemo(() => {
    return localState.reduce((total, item) => {
      const productCount = item.productSelectionData?.cartProduct?.length || 0;
      const packageCount = item.productSelectionData?.cartPackage?.length || 0;
      return total + productCount + packageCount;
    }, 0);
  }, [localState]);

  useEffect(()=>{
    if (location.pathname.includes(objectRouterFunctionRequest.submitBulkFunctionRequest.path)) {
      if(bulkStepNameComponent=="ProductBulkSelection"){
        if(getBulkListData()){
          const data = getBulkListData()
          setLocalState(getBulkListData())
          setTenantId(data[0]?.tenantSelectionData?.TENANT_ID)
          if(data[0]?.productSelectionData?.[objectPackageProductSelection[0]]){
            const dataCartProduct = data[0]?.productSelectionData?.[objectPackageProductSelection[0]]
            setCart(dataCartProduct)
          }
          if(data[0]?.productSelectionData?.[objectPackageProductSelection[1]]){
            const dataCartPackage = data[0]?.productSelectionData?.[objectPackageProductSelection[1]]
            setCartPackage(dataCartPackage)
          }
        }
      }
    }
  },[location, bulkStepNameComponent])

  const fetchDataPackage = useCallback(()=>{
    setLoadingPackage(true);
    const params = {
      packageName:searchTermProductPackageName,
    }
    if(tenantId){
      getListPackageTransaction(params, tenantId).then(res=>{
        const data = res.data.data
        setListDataPackage(data)
        setLoadingPackage(false)
      }).catch(err=>{
        const response = err.response.data
        setListDataPackage(response.data)
        setLoadingPackage(false)
      })
    }
    
  },[searchTermProductPackageName, tenantId])
  
  useEffect(() => {
    fetchDataPackage();
  }, [fetchDataPackage]);

  const fetchDataProduct =useCallback(() => {
    setLoadingProduct(true);
    const params = {
      productName:searchTermProductName,
    }
    if(tenantId){
      getUnitMenu(params, tenantId).then(res=>{
        const data = res.data.data
        setListDataProduct(data)
        setLoadingProduct(false)
      }).catch(err=>{
        const response = err.response.data
        setListDataProduct(response.data)
        setLoadingProduct(false)
      })
    }
  },[searchTermProductName, tenantId])

  useEffect(() => {
    fetchDataProduct();
  }, [fetchDataProduct]);

  useEffect(() => {
    setLocalState((prev) => {
      const updatedState = [...prev]; // Create a copy of the previous state
      updatedState[currentIndex] = {
        ...updatedState[currentIndex],
        productSelectionData: {
          ...updatedState[currentIndex].productSelectionData, // Keep existing data in productSelectionData
          cartProduct: cart, // Update the cartProduct field
        },
      };
      saveBulkListData(updatedState); // Save the updated state
      return updatedState; // Return the updated state
    });
  }, [cart, currentIndex]);

  useEffect(() => {
    setLocalState((prev) => {
      const updatedState = [...prev]; // Create a copy of the previous state
      updatedState[currentIndex] = {
        ...updatedState[currentIndex],
        productSelectionData: {
          ...updatedState[currentIndex].productSelectionData, // Keep existing data in productSelectionData
          cartPackage: cartPackage, // Update the cartPackage field
        },
      };
      saveBulkListData(updatedState); // Save the updated state
      return updatedState; // Return the updated state
    });
  }, [cartPackage, currentIndex]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setLocalState((prev)=>{
      const updatedDatetime = newDate && moment(prev[currentIndex].roomSelectionData?.DELIVERY_DATETIME).format("HH:mm") ? `${newDate} ${moment(prev[currentIndex].roomSelectionData?.DELIVERY_DATETIME).format("HH:mm")}:00` : newDate;
      prev[currentIndex].roomSelectionData.DELIVERY_DATETIME = updatedDatetime;
      saveBulkListData([...prev])
      return [...prev];
    })
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setLocalState((prev)=>{
      const updatedDatetime = moment(prev[currentIndex].roomSelectionData?.DELIVERY_DATETIME).format("YYYY-MM-DD") && newTime ? `${moment(prev[currentIndex].roomSelectionData?.DELIVERY_DATETIME).format("YYYY-MM-DD")} ${newTime}:00` : "";
      prev[currentIndex].roomSelectionData.DELIVERY_DATETIME = updatedDatetime;
      saveBulkListData([...prev])
      return [...prev];
    })
  };

  useEffect(() => {
    debounceSearchProductPackageNameRef.current = _.debounce((value) => {
      setSearchTermProductPackageName(value);
    }, 500);
  }, [searchTermProductPackageName]);

  const handleSearchProductPackageName = (e, from) => {
    if (from === "onchange") {
      setCurrentSearchProductPackageName(e.target.value);
      debounceSearchProductPackageNameRef.current(e.target.value);
    } else {
      setSearchTermProductPackageName(currentSearchProductPackageName);
    }
  };

  useEffect(() => {
    debounceSearchProductNameRef.current = _.debounce((value) => {
      setSearchTermProductName(value);
    }, 500);
  }, [searchTermProductName]);

  const handleSearchProductName = (e, from) => {
    if (from === "onchange") {
      setCurrentSearchProductName(e.target.value);
      debounceSearchProductNameRef.current(e.target.value);
    } else {
      setSearchTermProductName(currentSearchProductName);
    }
  };

  const handleNext = async () => {
    // loop validasi per object
    let valid = true;
    for (const element of localState) {
      const { cartProduct, cartPackage } = element.productSelectionData;

      if (isCartEmpty(cartProduct, cartPackage)) {
        toast.error("Please select at least one product or package in page "+ element.sequence);
        valid = false;
        break;
      }

      if (!validateAndNotify(validateCartProduct, element.productSelectionData[objectPackageProductSelection[0]], listDataProduct, true, element.sequence)) {
        valid = false;
        break;
      }

      if (!validateAndNotify(validateCartPackage, element.productSelectionData[objectPackageProductSelection[1]], listDataPackage, true, element.sequence)) {
        valid = false;
        break;
      }

      if (!validateRequestDataRoomSelection(element.roomSelectionData, true, element.sequence)) {
        valid = false;
        break;
      }

      if (!validateRequestDataTenantSelection(element.tenantSelectionData, true, element.sequence)) {
        valid = false;
        break;
      }

      if (!await validatePaymentProductPackage(element.productSelectionData, true, element.sequence)) {
        valid = false;
        break;
      }

      if (!await validateDeliveryDate(element.roomSelectionData, element.tenantSelectionData, true, element.sequence)){
        valid = false;
        break;
      }
      if (!await validateMinimumOrderPerPortion(element.productSelectionData, element.tenantSelectionData, listDataPackage, listDataProduct, true, element.sequence)){
        valid = false;
        break;
      }
    }

    if(valid){
      saveBulkListData(localState) // save to local storage
      saveBulkStepFunctionRequest("OrderPreviewBulk")
      // simpan ke local storage, lalu call API
      dispatch(setBulkStepNameComponent("OrderPreviewBulk"))
    }
  };

  const handleBack = () => {
    saveBulkStepFunctionRequest("DetailBulk")
    // simpan ke local storage, lalu call API
    dispatch(setBulkStepNameComponent("DetailBulk"))
  };
  
  const changePage = (to)=>{
    let index = currentIndex
    if (to === "next") {
      index = currentIndex < localState.length - 1 ? currentIndex + 1 : localState.length - 1
      setCurrentIndex(index);
    } else {
      index = currentIndex > 0 ? currentIndex - 1 : 0
      setCurrentIndex(index);
    }
    if(localState[index]?.productSelectionData){
      if(localState[index]?.productSelectionData?.[objectPackageProductSelection[0]]){
        const dataCartProduct = localState[index]?.productSelectionData?.[objectPackageProductSelection[0]]
        setCart(dataCartProduct)
      }
      if(localState[index]?.productSelectionData?.[objectPackageProductSelection[1]]){
        const dataCartPackage = localState[index]?.productSelectionData?.[objectPackageProductSelection[1]]
        setCartPackage(dataCartPackage)
      }
    }
  }

  return(
    <div className="position-relative">
      {/* Pilih Tanggal & Waktu */}
      <DateTimeSelection
        dateValue={localState[currentIndex]?.roomSelectionData?.DELIVERY_DATETIME ? moment(localState[currentIndex]?.roomSelectionData?.DELIVERY_DATETIME).format("YYYY-MM-DD") : ""}
        timeValue={localState[currentIndex]?.roomSelectionData?.DELIVERY_DATETIME ? moment(localState[currentIndex]?.roomSelectionData?.DELIVERY_DATETIME).format("HH:mm") : ""}
        onDateChange={handleDateChange}
        onTimeChange={handleTimeChange}
      />
      <div className="position-absolute top-0 end-0">
        <Stack direction="horizontal" className="fs-4" gap={3}>
          <div role="button" onClick={()=> changePage("prev")}><FaCaretSquareLeft size={28}/></div>
          <div>Page {currentIndex+1} of {localState.length}</div>
          <div role="button" onClick={() => changePage("next")}><FaCaretSquareRight size={28}/></div>
        </Stack>
      </div>
      <Row className="mt-4">
        <Col xl={6} className="pe-xl-3 create-col border-end border-3">
          <SearchSelection
            value={currentSearchProductPackageName}
            onChange={handleSearchProductPackageName}
            placeholder="Search package..."
            className="inputProductPackageName"
          />
          <div className="overflow-y-scroll overflow-x-hidden pe-2 scrollable-product-section">
            <div className="mt-1 px-3 py-2 header-title fw-bold fs-5">List Package</div>
            {loadingPackage && <LoadingSpinner color="secondary"/>}
            <Stack className="list-menu w-100" gap={2}>
              {!loadingPackage && listDataPackage?.length > 0 && listDataPackage.map((packageData, index)=>
                <PackageItem key={`${packageData.PACKAGE_ID}-${index}`} packageProps={packageData} cart={cartPackage} setCart={setCartPackage} />
              )}
            </Stack>
          </div>
        </Col>
        <Col xl={6} className="ps-xl-4">
          <SearchSelection
            value={currentSearchProductName}
            onChange={handleSearchProductName}
            placeholder="Search product..."
            className="inputProductName flex-sm-row-reverse"
          />
          <div className="overflow-y-scroll overflow-x-hidden pe-3 scrollable-product-section">
            <div className="mt-1 px-3 py-2 header-title fw-bold fs-5">Unit Menu</div>
            {loadingProduct && <LoadingSpinner color="secondary"/>}
            <Stack className="list-menu w-100" gap={2}>
              {!loadingProduct && listDataProduct?.length > 0 && listDataProduct.map(product=>
                <ProductItem key={product.PRODUCT_ID} product={product} cart={cart} setCart={setCart} />
              )}
            </Stack>
          </div>
        </Col>
      </Row>
      {/* Tombol Aksi */}
      <Stack direction="horizontal" className="justify-content-center mt-4" gap={3}>
        <ButtonComponent className="px-sm-5 fw-semibold" variant="outline-dark" onClick={handleBack} title="Back" />
        <ButtonComponent className="px-sm-5 fw-semibold" variant="warning" onClick={handleNext} title={`Checkout (${totalCartItems})`} />
      </Stack>
    </div>
  )
}

export default ProductBulkSelection