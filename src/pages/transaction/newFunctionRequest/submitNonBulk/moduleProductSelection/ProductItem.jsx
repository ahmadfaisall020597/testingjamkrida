import { useEffect, useMemo, useState } from "react";
import { objectProductSelection } from "../../newFunctionRequestFn";
import { Col, Image, Row, Stack } from "react-bootstrap";
import { MdFavoriteBorder } from "react-icons/md";
import { formatNumber } from "src/utils/helpersFunction";
import ProductCounter from "./productCounter";
import LoadingSpinner from "src/components/partial/spinnerComponent";
import { PiImageBrokenFill } from "react-icons/pi";
import ButtonComponent from "src/components/partial/buttonComponent";

// 📌 Komponen Item Produk
const ProductItem = ({ product, cart, setCart }) => {
  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [brokenImage, setBrokenImage] = useState(false);

  const itemCount = useMemo(() => {
    const foundItem = cart?.find(item => item[objectProductSelection[0]] === product[objectProductSelection[0]]);
    return foundItem ? foundItem[objectProductSelection[10]] : 0;
  }, [cart, product]);

  const imageUrl = useMemo(() => {
    return product[objectProductSelection[3]];
  }, [product]);

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

  const addOns = [
    product[objectProductSelection[5]], 
    product[objectProductSelection[6]], 
    product[objectProductSelection[7]], 
    product[objectProductSelection[8]], 
    product[objectProductSelection[9]]
  ]
  .filter(Boolean) // Remove null values
  .join(", ");

  const addOnText = addOns ? `Includes: ${addOns}.` : "No additional add-ons included.";

  const handleIncrease = () => {
    setCart((prevCart) => {
      const newCart = [...prevCart]; // Buat salinan array cart
      const existingIndex = newCart.findIndex(item => item[objectProductSelection[0]] === product[objectProductSelection[0]]);
  
      if (existingIndex !== -1) {
        // Buat salinan objek sebelum memodifikasi
        newCart[existingIndex] = { 
          ...newCart[existingIndex], 
          [objectProductSelection[10]]: newCart[existingIndex][objectProductSelection[10]] + 1 
        };
      } else {
        newCart.push({ [objectProductSelection[0]]: product[objectProductSelection[0]], [objectProductSelection[10]]: 1 });
      }
  
      return newCart;
    });
  };
  
  const handleDecrease = () => {
    setCart((prevCart) => {
      const newCart = [...prevCart]; // Buat salinan array cart
      const existingIndex = newCart.findIndex(item => item[objectProductSelection[0]] === product[objectProductSelection[0]]);
  
      if (existingIndex !== -1) {
        if (newCart[existingIndex][objectProductSelection[10]] > 1) {
          // Buat salinan objek sebelum memodifikasi
          newCart[existingIndex] = { 
            ...newCart[existingIndex], 
            [objectProductSelection[10]]: newCart[existingIndex][objectProductSelection[10]] - 1 
          };
        } else {
          newCart.splice(existingIndex, 1); // Hapus item jika QUANTITY menjadi 0
        }
      }
  
      return newCart;
    });
  };
  
  const handleManualChange = (value) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setCart((prevCart) => {
        const newCart = [...prevCart]; // Buat salinan array cart
        const existingIndex = newCart.findIndex(item => item[objectProductSelection[0]] === product[objectProductSelection[0]]);
  
        if (existingIndex !== -1) {
          if (numericValue === 0) {
            newCart.splice(existingIndex, 1); // Hapus item jika QUANTITY menjadi 0
          } else {
            newCart[existingIndex] = { 
              ...newCart[existingIndex], 
              [objectProductSelection[10]]: numericValue 
            };
          }
        } else if (numericValue > 0) {
          newCart.push({ [objectProductSelection[0]]: product[objectProductSelection[0]], [objectProductSelection[10]]: numericValue });
        }
  
        return newCart;
      });
    }
  };

  const handleImageError = () =>{
    setLoadingImage(false)
    setBrokenImage(true)
  }

  return (
    <div className={`bg-white py-3 product-item ${!product[objectProductSelection[4]] ? "out-of-stock" : ""}`}>
      <Row className="w-100 gx-0 gy-4">
        <Col sm={9}>
          <Stack className="h-100 pe-2" gap={3}>
            <div>
              <Stack direction="horizontal" className="justify-content-between">
                <Stack direction="horizontal" gap={2}>
                  <p className="m-0 fw-bold">{product[objectProductSelection[1]]}</p>
                  {!product[objectProductSelection[4]] && <span className="badge bg-danger">{NOT_AVAILABLE}</span>}
                </Stack>
                {/* <MdFavoriteBorder size={30}/> */}
              </Stack>
              <p className="m-0 desc-add-on fs-7">{addOnText}</p>
            </div>
            <p className="m-0 fw-bold">Rp. {formatNumber(product[objectProductSelection[2]])}</p>
            {itemCount > 0 && product[objectProductSelection[4]] && (
              <p className="m-0 text-muted small">🛒 In Cart ({itemCount})</p>
            )}
            {product[objectProductSelection[4]] && (
              <div className="mt-auto">
                <ProductCounter 
                  count={itemCount} 
                  onIncrease={handleIncrease} 
                  onDecrease={handleDecrease} 
                  onManualChange={handleManualChange} 
                />
              </div>
            )}
          </Stack>
        </Col>
        <Col sm={3} className="text-sm-end">
          <Stack className="h-100 justify-content-between" gap={3}>
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
              {!product[objectProductSelection[4]] && <div className="overlay"></div>}
            </div>
            {itemCount > 0 && product[objectProductSelection[4]] ? (
              <ButtonComponent justifyContent="center" className="px-4 fw-semibold w-100" variant="outline-dark" title="Added" disabled />
            ) : (
              product[objectProductSelection[4]] &&
              <ButtonComponent 
                justifyContent="center"
                className="px-4 fw-semibold w-100" 
                variant={product[objectProductSelection[4]] ? "warning" : "secondary"} 
                onClick={handleIncrease} 
                title={"Add"} 
                disabled={!product[objectProductSelection[4]]} 
              />
            )}
          </Stack>
        </Col>
      </Row>
    </div>
  );
};

export default ProductItem;