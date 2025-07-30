import { Col, Row, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "src/components/partial/buttonComponent";
import { setProductSelectionData, setRoomSelectionData, setStepNameComponent } from "../newFunctionRequestSlice";
import { saveStepFunctionRequestDraft } from "src/utils/localStorage";
import moment from "moment";
import { isCartEmpty, objectPackageProductSelection, objectRoomSelection, objectTenantSelection, validateAndNotify, validateCartPackage, validateCartProduct, validateDeliveryDate, validateMinimumOrderPerPortion, validatePaymentProductPackage, validateRequestDataRoomSelection, validateRequestDataTenantSelection } from "../newFunctionRequestFn";
import InputSearchComponent from "src/components/partial/inputSearchComponent";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import _ from "lodash";
import { FaSearch } from "react-icons/fa";
import { getListPackageTransaction, getUnitMenu } from "src/utils/api/apiTransaction";
import LoadingSpinner from "src/components/partial/spinnerComponent";
import { toast } from "react-toastify";
import DateTimeSelection from "./moduleProductSelection/dateTimeSelection";
import PackageItem from "./moduleProductSelection/PackageItem";
import ProductItem from "./moduleProductSelection/ProductItem";

// 📌 Komponen Input Pencarian
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

const ProductSelection = () => {
  const dispatch = useDispatch();
  const { roomSelectionData, tenantSelectionData, productSelectionData } = useSelector((state) => state.newFunctionRequest);
  
  const [currentSearchProductName, setCurrentSearchProductName] = useState("");
  const [currentSearchProductPackageName, setCurrentSearchProductPackageName] = useState("");

  const [searchTermProductName, setSearchTermProductName] = useState("");
  const [searchTermProductPackageName, setSearchTermProductPackageName] = useState("");

  const [cart, setCart] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [listDataProduct, setListDataProduct] = useState([]);

  const [cartPackage, setCartPackage] = useState([]);
  const [loadingPackage, setLoadingPackage] = useState(true);
  const [listDataPackage, setListDataPackage] = useState([]);

  const debounceSearchProductPackageNameRef = useRef(null);
  const debounceSearchProductNameRef = useRef(null);

  const tenantId = useMemo(() => tenantSelectionData?.[objectTenantSelection[0]], [tenantSelectionData]);

  const totalCartItems = cart?.length + cartPackage.length

  useEffect(()=>{
    if(productSelectionData){
      if(productSelectionData?.[objectPackageProductSelection[0]]){
        const dataCartProduct = productSelectionData?.[objectPackageProductSelection[0]]
        setCart(dataCartProduct)
      }
      if(productSelectionData?.[objectPackageProductSelection[1]]){
        const dataCartPackage = productSelectionData?.[objectPackageProductSelection[1]]
        setCartPackage(dataCartPackage)
      }
    }
  },[])

  useEffect(()=>{
    if(tenantId){
      dispatch(setProductSelectionData({key: objectPackageProductSelection[2], value: tenantId}))
    }
  },[dispatch, tenantId])

  useEffect(()=>{
    dispatch(setProductSelectionData({key: objectPackageProductSelection[0], value: cart}))
  },[cart, dispatch])

  useEffect(()=>{
    dispatch(setProductSelectionData({key: objectPackageProductSelection[1], value: cartPackage}))
  },[cartPackage, dispatch])

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

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    const updatedDatetime = newDate
      ? `${newDate} ${moment(roomSelectionData[objectRoomSelection[8]]).format("HH:mm")}:00`
      : undefined;
    dispatch(setRoomSelectionData({ key: objectRoomSelection[8], value: updatedDatetime }));
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    const updatedDatetime = moment(roomSelectionData[objectRoomSelection[8]]).format("YYYY-MM-DD")
      ? `${moment(roomSelectionData[objectRoomSelection[8]]).format("YYYY-MM-DD")} ${newTime}:00`
      : "";
    dispatch(setRoomSelectionData({ key: objectRoomSelection[8], value: updatedDatetime }));
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
    const { cartProduct, cartPackage } = productSelectionData;
  
    if (isCartEmpty(cartProduct, cartPackage)) {
      toast.error("Please select at least one product or package.");
      return;
    }
  
    if (!validateAndNotify(validateCartProduct, productSelectionData[objectPackageProductSelection[0]], listDataProduct)) return;
    if (!validateAndNotify(validateCartPackage, productSelectionData[objectPackageProductSelection[1]], listDataPackage)) return;
    if (!validateRequestDataRoomSelection(roomSelectionData)) return
    if (!validateRequestDataTenantSelection(tenantSelectionData)) return
    if (!await validatePaymentProductPackage(productSelectionData)) return
    if (!await validateDeliveryDate(roomSelectionData, tenantSelectionData)) return
    if (!await validateMinimumOrderPerPortion(productSelectionData, tenantSelectionData, listDataPackage, listDataProduct)) return
    saveStepFunctionRequestDraft("OrderPreview");
    dispatch(setStepNameComponent("OrderPreview"));
  };

  const handleBack = () => {
    saveStepFunctionRequestDraft("TenantSelection");
    dispatch(setStepNameComponent("TenantSelection"));
  };

  return (
    <Stack gap={4}>
      {/* Pilih Tanggal & Waktu */}
      <DateTimeSelection
        dateValue={roomSelectionData[objectRoomSelection[8]] ? moment(roomSelectionData[objectRoomSelection[8]]).format("YYYY-MM-DD") : ""}
        timeValue={roomSelectionData[objectRoomSelection[8]] ? moment(roomSelectionData[objectRoomSelection[8]]).format("HH:mm") : ""}
        onDateChange={handleDateChange}
        onTimeChange={handleTimeChange}
      />

      {/* Pencarian Produk & Paket */}
      <Row>
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
      <Stack direction="horizontal" className="justify-content-center" gap={3}>
        <ButtonComponent className="px-sm-5 fw-semibold" variant="outline-dark" onClick={handleBack} title="Back" />
        <ButtonComponent className="px-sm-5 fw-semibold" variant="warning" onClick={handleNext} title={`Checkout (${totalCartItems})`} />
      </Stack>
    </Stack>
  );
};

export default ProductSelection;
