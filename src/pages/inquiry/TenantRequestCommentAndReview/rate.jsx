import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Form, Image, Row, Stack } from "react-bootstrap";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import moment from "moment";

import CardComponent from "src/components/partial/cardComponent";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import InputImageComponent from "src/components/partial/inputImageComponent";
import InputComponent from "src/components/partial/inputComponent";
import ButtonComponent from "src/components/partial/buttonComponent";

import { formatNumber } from "src/utils/helpersFunction";
import objectRouterInquiry from "src/utils/router/objectRouter.inquiry";
import { History } from "src/utils/router";
import dummyImage from "src/assets/image/dummy_image_preview.png";

import "./style.scss";
import { useSearchParams } from "react-router";
import { setShowLoadingScreen, setShowModalGlobal } from "src/utils/store/globalSlice";
import { decryptData } from "src/utils/cryptojs";
import { addCommentAndReview, tenantGetCommentAndReviewByProductId } from "src/utils/api/apiTransaction";
import { toast } from "react-toastify";
import { validateAndBuildReviewPayload } from "./tenantRequestCommentAndReviewFn";
import { PiImageBrokenFill } from "react-icons/pi";

const decrypt = (data) =>{
  try {
    return decryptData(decodeURIComponent(data))
  } catch {
    return null
  }
}
const TenantRateRequestCommentAndReview = () => {
  let [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const { listStar } = useSelector((state) => state.requestCommentAndReview);
  const [brokenImage, setBrokenImage] = useState(false);
  const [value, setValue] = useState({
    TENANT_ID: 1,
    TENANT_NAME: "",
    TENANT_IMAGE: dummyImage,
    ORDER_ID: "",
    PRODUCT_NAME: "",
    PRICE: "",
    QUANTITY_ORDER: "",
    DELIVERY_DATE: "",
    RATED: 5,
    IS_FAVOURITE: false,
    IMAGE_REVIEW: "",
    COMMENT: "",
    TYPE: "",
    PRODUCT_ID: ""
  });
  const [canEdit, setCanEdit] = useState(true);

  const fetchData =useCallback(() => {
    dispatch(setShowLoadingScreen(true))
    const data = decrypt(searchParams.get("q"))
    if(data === null){
      toast.error("Data not found")
      dispatch(setShowLoadingScreen(false))
      History.navigate(objectRouterInquiry.requestCommentAndReview.path)
    }else{
      const param = {
        id: data.PRODUCT_ID,
        orderId: data.ORDER_ID,
        sequence: data.SEQUENCE
      }
      setCanEdit(data?.isEdit)
      tenantGetCommentAndReviewByProductId(param).then((res) => {
        const response = res?.data?.data
        setValue(response)
      }).finally(()=>{
        dispatch(setShowLoadingScreen(false))
      })
    }
  },[dispatch, searchParams])

  useEffect(()=>{
    fetchData()
  },[fetchData])

  const handleChange = (key, newValue) => {
    setValue((prev) => ({ ...prev, [key]: newValue }));
  };

  const handleFileChange = (fileData) => {
    handleChange("IMAGE_REVIEW", fileData || null);
  };

  const handleSubmit = () => {
    const result = validateAndBuildReviewPayload(value);

    if (!result.success) {
      toast.error(result.errors[0]); // Menampilkan error pertama yang ada
      return;
    }
    dispatch(setShowLoadingScreen(true))

    const bodyFormData = new FormData();
    // Loop melalui objek 'value' dan append ke FormData
    Object.keys(value).forEach((key) => {
      if (key === "IMAGE_REVIEW") {
        console.log(value[key])
        // Cek apakah IMAGE_REVIEW adalah File (misalnya gambar)
        if (value[key] instanceof File) {
          bodyFormData.append("ImageReviewFile", value[key]); // Menambahkan file gambar
          bodyFormData.append("IMAGE_REVIEW", value?.[key]?.name); // Nama file gambar
        } else {
          bodyFormData.append("IMAGE_REVIEW", value[key] || ""); // Jika tidak ada gambar
        }
      } else {
        // Append semua value lain ke FormData
        if (value[key] !== null && value[key] !== undefined) {
          bodyFormData.append(key, value[key]);
        }
      }
    });

    if(value.TYPE === "product"){
      bodyFormData.append("PRODUCT_ID", value.PRODUCT_ID)
      bodyFormData.delete("PACKAGE_ID")
    }

    if(value.TYPE === "package"){
      bodyFormData.append("PACKAGE_ID", value.PRODUCT_ID)
      bodyFormData.delete("PRODUCT_ID")
    }

    addCommentAndReview(bodyFormData).then((res)=>{
      toast.success(res.data.message)
      History.navigate(objectRouterInquiry.requestCommentAndReview.path)
    }).finally(()=>{
      dispatch(setShowLoadingScreen(false))
    })

  };

  const confirmSubmit = (event)=>{
    event.preventDefault();

    dispatch(setShowModalGlobal({
      show: true,
      content: {
        captionText: `Once confirmed, your changes will be applied and cannot be undone.`,
        questionText: "Do you wish to continue?",
        buttonLeftText: "Yes",
        buttonRightText: "No",
        buttonLeftFn: ()=>handleSubmit(),
        buttonRightFn: null
      }
    }))
  }

  const handleImageError = () =>{
    setBrokenImage(true)
  }

  return (
    <Container fluid id="rate-request-page">
      <CardComponent title="Form Review" type="create">        
        <Form onSubmit={confirmSubmit} className="content">
          <Row>
            {/* Left Column */}
            <Col xl={6} className="pe-xl-4 create-col border-end border-3">
              <Stack gap={4}>
                <Stack direction="horizontal" gap={2}>
                  <div className="w-25">
                    {
                      brokenImage ?
                        <PiImageBrokenFill  size={103} />
                      :
                        <Image src={value.TENANT_IMAGE} width={120} height={120} onError={handleImageError} />
                    }
                  </div>
                  <div>
                    <p className="m-0 tenant-label">Tenant</p>
                    <p className="m-0 fw-bold h2">{value.TENANT_NAME}</p>
                  </div>
                </Stack>
                {[
                  { label: "Order ID", value: value.ORDER_ID },
                  { label: "Product", value: value.PRODUCT_NAME },
                  { label: "Price", value: formatNumber(value.PRICE) },
                  { label: "Quantity", value: `${value.QUANTITY_ORDER} Piece` },
                  { label: "Delivery Date", value: moment(value.DELIVERY_DATE).format("DD MMM YYYY") }
                ].map((item, index) => (
                  <Stack key={index} direction="horizontal" gap={2}>
                    <p className="m-0 fw-bold w-25">{item.label}</p>
                    <p className="m-0 fw-bold">: {item.value}</p>
                  </Stack>
                ))}
              </Stack>
              <Stack direction="horizontal" className="mt-3 w-100 flex-wrap justify-content-between" gap={2}>
                <InputDropdownComponent
                  onChange={(e) => handleChange("RATED", e.target.value)}
                  value={value.RATED}
                  label="Star Rating"
                  listDropdown={listStar}
                  labelXl="12"
                  valueIndex
                  readOnly={!canEdit}
                />
                <Stack direction="horizontal" gap={3}>
                  <p className="m-0 fw-bold">Favourite by Requestor</p>
                  {value.IS_FAVOURITE ? <MdFavorite color="#FF3232" size={25} /> : <MdFavoriteBorder size={25} />}
                </Stack>
              </Stack>
            </Col>
            {/* Right Column */}
            <Col xl={6} className="ps-xl-4 create-col">
              <Stack gap={2}>
                <InputImageComponent
                  type="file"
                  label="Food Picture"
                  labelXl="12"
                  value={value.IMAGE_REVIEW}
                  name="IMAGE_REVIEW"
                  onChange={handleFileChange}
                  formGroupClassName="gx-2"
                  marginBottom="0"
                  readOnly={!canEdit}
                  controlId="formImageReviewTenant"
                />
                <InputComponent
                  type="textarea"
                  label="Comment:"
                  labelXl="12"
                  placeholder="no records yet"
                  value={value.COMMENT}
                  onChange={(e) => handleChange("COMMENT", e.target.value)}
                  formGroupClassName="gx-2"
                  inputClassName="border-0 header-title fw-light"
                  readOnly={!canEdit}
                />
                {/* Submit & Cancel Buttons */}
                <Stack direction="horizontal" className="justify-content-end" gap={3}>
                  {canEdit && (
                    <ButtonComponent className="px-sm-5 fw-semibold" variant="warning" title="Submit" type="submit" />
                  )}
                  <ButtonComponent
                    className="px-sm-5 fw-semibold"
                    variant="outline-danger"
                    onClick={() => History.navigate(objectRouterInquiry.tenantRequestCommentAndReview.path)}
                    title="Cancel"
                  />
                </Stack>
              </Stack>
            </Col>
          </Row>
        </Form>
      </CardComponent>
    </Container>
  );
};

export default TenantRateRequestCommentAndReview;
