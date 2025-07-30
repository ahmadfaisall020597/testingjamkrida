import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Col, Image, Row, Stack } from "react-bootstrap";
import { PiImageBrokenFill } from "react-icons/pi";
import { useSelector } from "react-redux";
import LoadingSpinner from "src/components/partial/spinnerComponent";
import { objectPackageProductSelection, objectPackageSelection, objectProductSelection, objectRoomSelection } from "src/pages/transaction/newFunctionRequest/newFunctionRequestFn";
import { formatNumber } from "src/utils/helpersFunction";

const PackageProductDetailItem = ({detail, listDetailsCategory})=>{
  const currentDetailsCategory = listDetailsCategory?.find(p=>p[objectPackageSelection[5]] === detail?.[objectPackageSelection[5]])
  return (
    <div>
      <Stack direction="horizontal">
        <p className="m-0 fw-bold w-50">{currentDetailsCategory?.[objectPackageSelection[6]]}</p>
        <p className="m-0 fw-normal">{detail?.listProduct?.length}</p>
      </Stack>
      {detail?.listProduct?.map((item, index)=>
        <p className="ms-3 m-0 fs-7 fw-normal" key={index}>{
          currentDetailsCategory?.[objectPackageSelection[8]]?.find(value=>value.PRODUCT_ID === item)?.PRODUCT_NAME
        }</p>
      )}
    </div>
    
  )
}
const PackageItem = ({packageData, listDataPackage})=>{
  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [brokenImage, setBrokenImage] = useState(false);

  const currentPackage = listDataPackage?.find(p=>p[objectPackageSelection[0]] === packageData[objectPackageSelection[0]])

  const imageUrl = useMemo(() => {
    return currentPackage?.[objectPackageSelection[2]];
  }, [currentPackage]);

  useEffect(() => {
    if (typeof imageUrl === "string" && imageUrl) {
      setLoadingImage(true);
      const timer = setTimeout(()=>{
        setImage(imageUrl);
        setLoadingImage(false)
        setBrokenImage(false)
      },[1000])
      return ()=>clearTimeout(timer)
    }else{
      setLoadingImage(false)
    }
  },[imageUrl])

  const getPriceValue = () =>{
    // disini fungsi menentukan harga dari banyaknya quantity yang di add ke cart package per package, secara default ambil harga tertinggi dari array DETAILS_PRICE
    if (!currentPackage?.[objectPackageSelection[11]] || currentPackage?.[objectPackageSelection[11]].length === 0) {
      return 0; // Jika tidak ada harga yang tersedia
    }
    
    // Cari harga berdasarkan jumlah item dalam cart
    let selectedPrice = currentPackage?.[objectPackageSelection[11]].reduce((maxPrice, price) => {
      if (
        (packageData?.[objectPackageSelection[7]] >= price.PORTION_FROM && packageData?.[objectPackageSelection[7]] <= price.PORTION_THRU) ||
        (price.PORTION_THRU === 0 && packageData?.[objectPackageSelection[7]] >= price.PORTION_FROM)
      ) {
        return price[objectPackageSelection[12]];
      }
      return maxPrice;
    }, currentPackage?.[objectPackageSelection[11]][0][objectPackageSelection[12]]);
    
    return selectedPrice;
  }

  const handleImageError = () =>{
    setLoadingImage(false)
    setBrokenImage(true)
  }
  
  return(
    <div className="bg-white product-item py-3">
      <Row className="w-100 gx-0 gy-4">
        <Col sm={8}>
          <Stack className="h-100 pe-2" gap={3}>
            <div>
              <Stack direction="horizontal" className="justify-content-between">
                <Stack direction="horizontal" gap={2}>
                  <p className="m-0 fw-bold">{currentPackage?.[objectPackageSelection[1]]}</p>
                </Stack>
              </Stack>
            </div>
            <p className="m-0 fw-bold">Rp. {formatNumber(getPriceValue())}</p>
            <Stack className="mt-auto" gap={2}>
              {
                packageData?.[objectPackageSelection[4]]?.map(item=>
                  <PackageProductDetailItem key={item?.[objectPackageSelection[5]]} detail={item} listDetailsCategory={currentPackage?.[objectPackageSelection[4]]}/>
                )
              }
            </Stack>
          </Stack>
        </Col>
        <Col sm={4}>
          <Stack className="h-100 align-items-end">
            {loadingImage && <LoadingSpinner color="secondary"/>}
            {brokenImage ?
              <PiImageBrokenFill  size={103} className={loadingImage ? "d-none" : ""} />
            :
              <Image 
                src={currentPackage?.[objectPackageSelection[2]]} 
                className={loadingImage ? "d-none" : "object-fit-contain product-image"} 
                width={100} 
                height={100}
                onError={handleImageError} 
              />
            }
            <p className="m-0 my-1 fw-normal">Package Qty : {packageData?.[objectPackageSelection[7]]}</p>
            <p className="m-0 mt-auto fw-bold">Rp. {formatNumber(packageData?.[objectPackageSelection[7]] * getPriceValue())}</p>
          </Stack>
        </Col>
      </Row>
    </div>
  )
}
const ProductItem = ({product, listDataProduct})=>{
  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [brokenImage, setBrokenImage] = useState(false);

  const currentProduct = listDataProduct?.find(p=>p[objectProductSelection[0]] === product[objectProductSelection[0]])

  const imageUrl = useMemo(() => {
    return currentProduct?.[objectProductSelection[3]];
  }, [currentProduct]);

  useEffect(() => {
    if (typeof imageUrl === "string" && imageUrl) {
      setLoadingImage(true);
      const timer = setTimeout(()=>{
        setImage(imageUrl);
        setLoadingImage(false)
        setBrokenImage(false)
      },[1000])
      return ()=>clearTimeout(timer)
    }else{
      setLoadingImage(false)
    }
  },[imageUrl])

  const handleImageError = () =>{
    setLoadingImage(false)
    setBrokenImage(true)
  }

  return(
    <div className="bg-white product-item py-3">
      <Row className="w-100 gx-0 gy-4">
        <Col sm={8}>
          <Stack className="h-100 pe-2" gap={3}>
            <div>
              <Stack direction="horizontal" className="justify-content-between">
                <Stack direction="horizontal" gap={2}>
                  <p className="m-0 fw-bold">{currentProduct?.[objectProductSelection[1]]}</p>
                </Stack>
              </Stack>
            </div>
            <p className="m-0 fw-bold">Rp. {formatNumber(currentProduct?.[objectProductSelection[2]])}</p>
            <p className="m-0 mt-auto fw-normal">Quantity : {product?.[objectProductSelection[10]]}</p>
          </Stack>
        </Col>
        <Col sm={4} className="text-sm-end">
          <Stack className="h-100 justify-content-between" gap={3}>
            <div className="position-relative">
              {loadingImage && <LoadingSpinner color="secondary"/>}
              {brokenImage ?
                <PiImageBrokenFill  size={103} className={loadingImage ? "d-none" : ""} />
              :
                <Image 
                  src={currentProduct?.[objectProductSelection[3]]} 
                  className={loadingImage ? "d-none" : "object-fit-contain product-image"} 
                  width={100} 
                  height={100}
                  onError={handleImageError} 
                />
              }
              <p className="m-0 mt-2 fw-bold">Rp. {formatNumber(product?.[objectProductSelection[10]] * currentProduct?.[objectProductSelection[2]])}</p>
            </div>
          </Stack>
        </Col>
      </Row>
    </div>


  )
}
const OrderSummary = ({listDataPackage, listDataProduct, loadingProduct, loadingPackage, roomSelectionData, productSelectionData}) => {
  return (
    <>
      <div className="my-1 px-3 py-2 header-title">
        <Stack direction="horizontal" className="w-100 flex-wrap justify-content-between">
          <div className="fw-bold fs-5">Order Summary</div>
          <div className="fw-normal">{moment(roomSelectionData[objectRoomSelection[8]]).format("DD MMM YYYY")}</div>
        </Stack>
      </div>
      <div className="overflow-y-scroll overflow-x-hidden pe-3 scrollable-order-preview-section">
        <Stack className="list-menu w-100" gap={2}>
          {loadingPackage ?
            <LoadingSpinner color="secondary"/>
          :
            productSelectionData?.[objectPackageProductSelection[1]]?.map((item) =>
              <PackageItem key={item?.[objectPackageSelection[0]]} packageData={item} listDataPackage={listDataPackage}/>
            )
          }
          {loadingProduct ?
            <LoadingSpinner color="secondary"/>
          :
            productSelectionData?.[objectPackageProductSelection[0]]?.map((item) => 
              <ProductItem key={item?.[objectProductSelection[0]]} product={item} listDataProduct={listDataProduct}/>
            )
          }
        </Stack>
      </div>
    </>
  );
};

export default OrderSummary;
