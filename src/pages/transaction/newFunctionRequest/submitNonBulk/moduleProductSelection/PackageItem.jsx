import { useEffect, useMemo, useState } from "react";
import { objectPackageSelection } from "../../newFunctionRequestFn";
import { formatNumber } from "src/utils/helpersFunction";
import { Col, Form, Image, Row, Stack } from "react-bootstrap";
import { MdFavoriteBorder } from "react-icons/md";
import LoadingSpinner from "src/components/partial/spinnerComponent";
import { PiImageBrokenFill } from "react-icons/pi";
import ProductCounter from "./productCounter";
import ButtonComponent from "src/components/partial/buttonComponent";

// 📌 Komponen Item Package
const PackageItem = ({packageProps, cart, setCart}) =>{
  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [brokenImage, setBrokenImage] = useState(false);

  const itemCount = useMemo(() => {
    const packageItem = cart.find(item => item[objectPackageSelection[0]] === packageProps[objectPackageSelection[0]]);
    return packageItem ? packageItem[objectPackageSelection[7]] : 0;
  }, [cart, packageProps]);

  const imageUrl = useMemo(() => {
    return packageProps[objectPackageSelection[2]];
  }, [packageProps]);

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

  const NOT_AVAILABLE = "Not Available";

  const handleIncrease = () => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      const packageId = packageProps[objectPackageSelection[0]];

      const existingIndex = newCart.findIndex(item => item[objectPackageSelection[0]] === packageId);

      if (existingIndex !== -1) {
        newCart[existingIndex] = { 
          ...newCart[existingIndex], 
          [objectPackageSelection[7]]: newCart[existingIndex][objectPackageSelection[7]] + 1 
        };
      } else {
        newCart.push({
          [objectPackageSelection[0]]: packageId,
          [objectPackageSelection[7]]: 1,
          [objectPackageSelection[4]]: []
        });
      }

      return newCart;
    });
  };

  const handleDecrease = () => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      const packageId = packageProps[objectPackageSelection[0]];

      const existingIndex = newCart.findIndex(item => item[objectPackageSelection[0]] === packageId);

      if (existingIndex !== -1) {
        if (newCart[existingIndex][objectPackageSelection[7]] > 1) {
          newCart[existingIndex] = { 
            ...newCart[existingIndex], 
            [objectPackageSelection[7]]: newCart[existingIndex][objectPackageSelection[7]] - 1 
          };
        } else {
          newCart.splice(existingIndex, 1); // Hapus package jika QUANTITY = 0
        }
      }

      return newCart;
    });
  };

  const handleManualChange = (value) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setCart((prevCart) => {
        const newCart = [...prevCart];
        const packageId = packageProps[objectPackageSelection[0]];

        const existingIndex = newCart.findIndex(item => item[objectPackageSelection[0]] === packageId);

        if (existingIndex !== -1) {
          if (numericValue === 0) {
            newCart.splice(existingIndex, 1); // Hapus package jika QUANTITY = 0
          } else {
            newCart[existingIndex] = { 
              ...newCart[existingIndex], 
              [objectPackageSelection[7]]: numericValue 
            };
          }
        } else if (numericValue > 0) {
          newCart.push({
            [objectPackageSelection[0]]: packageId,
            [objectPackageSelection[7]]: numericValue,
            [objectPackageSelection[4]]: []
          });
        }

        return newCart;
      });
    }
  };

  const handleCheckBox = (product, packageCategory) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      const packageId = packageProps[objectPackageSelection[0]];
      const categoryId = packageCategory[objectPackageSelection[5]];
      const productId = product[objectPackageSelection[9]];

      const existingIndex = newCart.findIndex(item => item.PACKAGE_ID === packageId);

      if (existingIndex === -1) {
        newCart.push({
          PACKAGE_ID: packageId,
          QUANTITY: 1,
          DETAILS_CATEGORY: [{ CATEGORY_PRODUCT: categoryId, listProduct: [productId] }]
        });
      } else {
        const updatedPackage = { ...newCart[existingIndex] };
        let updatedDetails = [...updatedPackage.DETAILS_CATEGORY];

        const categoryIndex = updatedDetails.findIndex(cat => cat.CATEGORY_PRODUCT === categoryId);

        if (categoryIndex !== -1) {
          let updatedProducts = [...updatedDetails[categoryIndex].listProduct];

          if (updatedProducts.includes(productId)) {
            updatedProducts = updatedProducts.filter(prod => prod !== productId);
          } else {
            updatedProducts.push(productId);
          }

          if (updatedProducts.length > 0) {
            updatedDetails[categoryIndex] = { CATEGORY_PRODUCT: categoryId, listProduct: updatedProducts };
          } else {
            updatedDetails.splice(categoryIndex, 1);
          }
        } else {
          updatedDetails.push({ CATEGORY_PRODUCT: categoryId, listProduct: [productId] });
        }

        updatedPackage.DETAILS_CATEGORY = updatedDetails;

        if (updatedPackage.DETAILS_CATEGORY.length === 0 && updatedPackage.QUANTITY === 1) {
          newCart.splice(existingIndex, 1);
        } else {
          newCart[existingIndex] = updatedPackage;
        }
      }

      return newCart;
    });
  };

  const isChecked = (product, packageCategory) => {
    const packageId = packageProps[objectPackageSelection[0]];
    const categoryId = packageCategory[objectPackageSelection[5]];
    const productId = product[objectPackageSelection[9]];

    const packageItem = cart.find(item => item[objectPackageSelection[0]] === packageId);
    if (!packageItem) return false;

    const category = packageItem[objectPackageSelection[4]].find(cat => cat[objectPackageSelection[5]] === categoryId);
    return category ? category.listProduct.includes(productId) : false;
  };

  const getPriceValue = () =>{
    // disini fungsi menentukan harga dari banyaknya quantity yang di add ke cart package per package, secara default ambil harga tertinggi dari array DETAILS_PRICE
    if (!packageProps[objectPackageSelection[11]] || packageProps[objectPackageSelection[11]].length === 0) {
      return formatNumber(0); // Jika tidak ada harga yang tersedia
    }
    
    // Cari harga berdasarkan jumlah item dalam cart
    let selectedPrice = packageProps[objectPackageSelection[11]].reduce((maxPrice, price) => {
      if (
        (itemCount >= price.PORTION_FROM && itemCount <= price.PORTION_THRU) ||
        (price.PORTION_THRU === 0 && itemCount >= price.PORTION_FROM)
      ) {
        return price[objectPackageSelection[12]];
      }
      return maxPrice;
    }, packageProps[objectPackageSelection[11]][0][objectPackageSelection[12]]);
    
    return formatNumber(selectedPrice);
  }

  const handleImageError = () =>{
    setLoadingImage(false)
    setBrokenImage(true)
  }

  return (
    <div className={`bg-white py-3 product-item ${!packageProps[objectPackageSelection[3]] ? "out-of-stock" : ""}`}>
      <Row className="w-100 gx-0 gy-4">
        <Col sm={9}>
          <Stack className="h-100 pe-2" gap={3}>
            <div>
              <Stack direction="horizontal" className="justify-content-between">
                <Stack direction="horizontal" gap={2}>
                <p className="m-0 fw-bold">{packageProps[objectPackageSelection[1]]}</p>
                {!packageProps[objectPackageSelection[3]] && <span className="badge bg-danger">{NOT_AVAILABLE}</span>}
                </Stack>
                {/* <MdFavoriteBorder size={30}/> */}
              </Stack>
            </div>
            <p className="m-0 fw-bold">Rp. {getPriceValue()}</p>
            {itemCount > 0 && packageProps[objectPackageSelection[3]] && (
              <p className="m-0 text-muted small">🛒 In Cart ({itemCount})</p>
            )}
            <div>
              {packageProps[objectPackageSelection[4]].map((packageCategory)=>
                <Row key={packageCategory[objectPackageSelection[5]]} className="mb-3">
                  <Col sm={6} className="custom-checkbox-table">
                    {
                      packageCategory[objectPackageSelection[8]].map((product)=>
                        <div key={product[objectPackageSelection[9]]}>
                          <Form.Check
                            type="checkbox"
                            checked={isChecked(product, packageCategory)}
                            onChange={() => handleCheckBox(product, packageCategory)}
                            className="me-2"
                            label={
                              product[objectPackageSelection[3]]?
                              (
                                <p className="m-0 ms-1 fs-7" onClick={()=>handleCheckBox(product, packageCategory)} role="button">{product[objectPackageSelection[10]]}</p>
                              )
                              :
                              (
                                <p className="m-0 ms-1 fs-7">{product[objectPackageSelection[10]]}</p>
                              )
                            }
                            disabled={!product[objectPackageSelection[3]]}
                          />
                        </div>
                      )
                    }
                  </Col>
                  <Col sm={6} className="align-self-center fw-normal">
                    <p className="m-0 desc-add-on fs-6 text-truncate">
                      {packageCategory[objectPackageSelection[6]]}
                    </p>
                    <p className="m-0 desc-add-on fs-6">
                      Qty. {packageCategory[objectPackageSelection[7]]}
                    </p>
                  </Col>
                </Row>
              )}
            </div>
          </Stack>
        </Col>
        <Col sm={3}>
          <Stack className="align-items-center" gap={2}>
            <div className="position-relative">
              {loadingImage && <LoadingSpinner color="secondary"/>}
              {brokenImage ?
                <PiImageBrokenFill  size={103} className={loadingImage ? "d-none" : ""} />
              :
                <Image 
                  src={image} 
                  className={loadingImage ? "d-none w-100 object-fit-contain product-image" :"w-100 object-fit-contain product-image"} 
                  height={120}
                  onError={handleImageError}
                />
              }
              {!packageProps[objectPackageSelection[3]] && <div className="overlay"></div>}
            </div>
            {packageProps[objectPackageSelection[3]] && (
              <ProductCounter count={itemCount} onIncrease={handleIncrease} onDecrease={handleDecrease} onManualChange={handleManualChange} className="w-100" />
            )}
            {itemCount > 0 && packageProps[objectPackageSelection[3]] ? (
              <ButtonComponent justifyContent="center" className="px-4 fw-semibold w-100" variant="outline-dark" title="Added" disabled />
            ) : (
              packageProps[objectPackageSelection[3]] &&
              <ButtonComponent justifyContent="center" className="px-4 fw-semibold w-100" variant={"warning"} onClick={handleIncrease} title={"Add"} />
            )}
          </Stack>
        </Col>
      </Row>
    </div>
  );
}

export default PackageItem