import { Col, Form, Image, Modal, Row } from "react-bootstrap";
import ButtonComponent from "./buttonComponent";
import dummyImage from "src/assets/image/dummy_image_preview.png";
import closeImage from "src/assets/image/close_upload_image.png";
import { useEffect, useRef, useState } from "react";
import { truncateString } from "src/utils/helpersFunction";
import LoadingSpinner from "./spinnerComponent";
import { PiImageBrokenFill } from "react-icons/pi";
import { toast } from "react-toastify";
import { isNullOrEmptyString } from "../../utils/helpersFunction";
import { FaDownload, FaFileDownload } from "react-icons/fa";

const InputImageComponent = ({
  value,
  onChange,
  label = "Input Data",
  controlId = "formControlDataTable",
  termsConditionText = "Resolution image is 128x128 pixel with max. of 1 images only. Max. file size 2MB",
  formGroupClassName,
  readOnly,
  required,
  errorMessage,
  showImagePreview,
  marginBottom = "4",
  fileIsBase64 = false,
  fileBase64Name = ""
}) => {
  const [preview, setPreview] = useState(null);
  const [previewName, setPreviewName] = useState(null);
  const [brokenImage, setBrokenImage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null); // Loading state

  useEffect(() => {
    if (typeof value === "string" && value) {
      setLoading(true);
      const timer = setTimeout(()=>{
        setPreview(value);
        setPreviewName(value);
        setLoading(false)
        setBrokenImage(false)
      },[1000])
      return ()=>clearTimeout(timer)
    }else{
      setLoading(false)
    }
  }, [value]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const isImage = file.type.startsWith("image/");
      const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB limit

      if (isImage && isValidSize) {
        const reader = new FileReader();
        reader.onload = () => {
          setLoading(true);
          setPreview(reader.result);
          setPreviewName(file.name);
          
          // Set loading true saat membaca file
          setTimeout(()=>{
            setLoading(false)
            setBrokenImage(false)
          },[300])
          if (onChange) onChange(file);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Invalid file type or size. Please select a valid image.");
      }
    }
  };

  const handleRemoveImage = async () => {
    try {
      const response = await fetch(dummyImage);
      const blob = await response.blob();
      const dummyFile = new File([blob], "NO_IMAGE.jpg", { type: blob.type });
      setPreview(null);
      setPreviewName(null);
      setLoading(true);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset input file
      }
      setTimeout(()=>{
        setLoading(false)
        setBrokenImage(false)
      },[100])
      if (onChange) onChange(dummyFile);
    } catch (error) {
      console.error("Error loading dummy image:", error);
    }
  };

  const handleImageError = () =>{
    setLoading(false)
    setBrokenImage(true)
  }

  const handleDownloadBase64 = () => {
    if(value) {
      const link = document.createElement('a');
      link.href = value;
      link.download = fileBase64Name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    else {
      toast.error('Invalid base64 attachment');
    }
  }

  return (
    <Form.Group className={`mb-${marginBottom} ${formGroupClassName}`}>
      {label && (
      <Form.Label>
        {label}{required && <span className="text-danger">*</span>}
      </Form.Label>
      )}
      <Row className="my-1 gy-2">
        {
          readOnly ?
            null
          :
          <Col xl={3}>
            <ButtonComponent
              onClick={() => document.getElementById(`${controlId}-file-upload`).click()}
              type="button"
              variant="primary"
              title="Browse"
              className={"text-white w-100 justify-items-center"}
              rounded="2"
              disabled={readOnly}
            />
            
            <Form.Control
              id={`${controlId}-file-upload`}
              type="file"
              accept="image/*"
              className="d-none"
              onChange={handleFileChange}
              disabled={readOnly}
              ref={fileInputRef}
            />
          </Col>
        }

        <Col>
          <p className="m-0 fw-light fst-italic small lh-sm">{termsConditionText}</p>
        </Col>
      </Row>

      <Row className={`${label ? "my-3" : "mb-3"} gy-2`}>
        {showImagePreview && (
          <Col xl={3}>
            {loading && <LoadingSpinner color="secondary"/>}
            {brokenImage ?
              <PiImageBrokenFill  size={103} className={loading ? "d-none" : ""} />
            :
              <Image 
                src={preview || dummyImage} 
                width={103} 
                rounded 
                className={loading ? "d-none w-100" : "w-100"} 
                // onLoad={handleImageLoad} // Setelah gambar selesai dimuat, loading = false
                onError={handleImageError} // Jika gagal memuat gambar, tetap set false agar spinner tidak stuck
              />
            } 
            
          </Col>
        )}

        {previewName && !fileIsBase64 && (
          <Col>
            <p className="m-0 fst-italic lh-sm">
              <a className="link-underline-primary" role="button" onClick={() => setShowModal(true)}>
                {truncateString(previewName, 20)}
              </a>
              {
                readOnly ?
                null
                :
                <span className="ps-4" onClick={handleRemoveImage} style={{ cursor: "pointer" }}>
                  <Image src={closeImage} width={18} />
                </span>
              }

            </p>
          </Col>
        )}
        {previewName && fileIsBase64 && fileBase64Name && (
          <Col>
            <p className="m-0 fst-italic lh-sm">
              <a className="link-underline-primary" role="button" onClick={() => handleDownloadBase64(true)}>
                {fileBase64Name.length > 20 ? (truncateString(fileBase64Name, 20) + " ." + fileBase64Name.split('.').pop()) : fileBase64Name}
                <span><FaDownload className="mx-3"/></span>
              </a>
            </p>
          </Col>
        )}
        {fileIsBase64 && (isNullOrEmptyString(previewName) ||
          isNullOrEmptyString(fileBase64Name)) && (
            <Col>
              <p className="m-0 fst-italic lh-sm">
                No attachment or file is missing.
              </p>
            </Col>
        )}
      </Row>

      <Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>

      {/* Modal for showing the image */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        contentClassName="border-0 bg-transparent"
      >
        <Modal.Body className="p-0 d-flex justify-content-center align-items-center">
          <div className="position-relative">
            <div className="position-absolute top-0 start-100 translate-middle" onClick={() => setShowModal(false)} style={{ cursor: "pointer" }}>
              <Image src={closeImage} />
            </div>
            {preview ? (
              brokenImage ?
                <PiImageBrokenFill  size={103} className={loading ? "d-none" : ""} />
              :
                <Image src={preview} fluid style={{ maxHeight: "90vh", maxWidth: "100%" }} />
            ) : (
              <p className="bg-white p-3 m-0">No image uploaded</p>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </Form.Group>
  );
};

export default InputImageComponent;
