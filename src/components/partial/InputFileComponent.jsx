import { Col, Form, Row, Stack } from "react-bootstrap";
import ButtonComponent from "./buttonComponent";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import closeImage from "src/assets/image/close_upload_image.png";
import { Image } from "react-bootstrap";
import { truncateString, isNullOrEmptyString } from "src/utils/helpersFunction";
import { FaDownload } from "react-icons/fa";

const InputFileComponent = ({
  onChange,
  label = "Upload File",
  controlId = "formControlFileUpload",
  // termsConditionText = "Allowed: .jpg, .jpeg, .png, .pdf, .doc, .docx, .xls, .xlsx. Max file size: 5MB.",
  termsConditionText = "Allowed: .pdf, .doc, .docx, .xls, .xlsx. Max file size: 5MB.",
  formGroupClassName,
  readOnly,
  required,
  errorMessage,
  marginBottom = "4",
  labelXl = "3",
  ColXl = 12 - Number(labelXl),
  colClassName,
  value,
  downloadTemplate,
  hideBrowseButton = false,
  fileIsBase64 = false,
  fileBase64Name = ""
}) => {
  const [fileName, setFileName] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/png",
    "image/jpg"
  ];

  const allowedExtensions = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".jpg", ".jpeg", ".png"];

  useEffect(() => {
    if (typeof value === "string" && value) {
      const timer = setTimeout(()=>{
        setFileName(value);
      },[1000])
      return ()=>clearTimeout(timer)
    }
  }, [value]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const isValidType = allowedTypes.includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;

      if (isValidType && isValidSize) {
        setFileName(file.name);
        setFile(file);
        if (onChange) onChange(file);
      } else {
        toast.error("Invalid file. Allowed types: .pdf, .doc(x), .xls(x), .jpg, .jpeg, .png. Max size: 5MB.");
        event.target.value = "";
      }
    }
  };

  const handleRemoveFile = () => {
    setFileName(null);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onChange) onChange(null);
  };

  const handleDownloadFile = () => {
    if (file) {
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    }else{
      if(fileName){
        const a = document.createElement("a");
        a.href = value;
        a.download = fileName;
        a.click();
      }
    }
  };

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
    <Form.Group as={Row} className={`mb-${marginBottom} ${formGroupClassName} align-items-center`}>
      <Form.Label column xl={labelXl}>
        {label} {required && <span className="text-danger">*</span>}
      </Form.Label>
      {downloadTemplate && (
             <a 
          href={downloadTemplate}
          download={downloadTemplate}
          className="d-flex align-items-center"
          title="Download Template Surat Permohonan"
        >
          <i className="fas fa-download me-1"></i>
          <span className="d-none d-md-inline">Download Template</span>
        </a> 

        )}
      <Col xl={ColXl} className={`gy-2 gx-2 ${colClassName}`}>
        <Stack direction="horizontal" gap={4}>
          {!hideBrowseButton && (
            <ButtonComponent
              onClick={() => document.getElementById(`${controlId}-file-upload`).click()}
              type="button"
              variant="primary"
              title="Browse"
              className="text-white justify-items-center px-2"
              rounded="2"
              disabled={readOnly}
            />
          )}
          <Form.Control
            id={`${controlId}-file-upload`}
            type="file"
            accept={allowedExtensions.join(",")}
            className="d-none"
            onChange={handleFileChange}
            disabled={readOnly}
            ref={fileInputRef}
          />
          <div>
            <p className="m-0 fw-light fst-italic small lh-sm">{termsConditionText}</p>
          </div>
        </Stack>
        {fileName && !fileIsBase64 && (
          <p className="m-0 fst-italic lh-sm mt-3">
            <a className="link-underline-primary" role="button" onClick={handleDownloadFile}>
              {truncateString(fileName, 45)}
            </a>
            <span className="ps-3" onClick={handleRemoveFile} style={{ cursor: "pointer" }}>
              <Image src={closeImage} width={18} />
            </span>
          </p>
        )}
        {fileName && fileIsBase64 && fileBase64Name && (
          <p className="m-0 fst-italic lh-sm mt-3">
            <a className="link-underline-primary" role="button" onClick={handleDownloadBase64}>
              {fileBase64Name.length > 45 ? (truncateString(fileBase64Name, 45) + " ." + fileBase64Name.split('.').pop()) : fileBase64Name}
              <span><FaDownload className="mx-3"/></span>
            </a>
          </p>
        )}
        {fileIsBase64 && (isNullOrEmptyString(fileName) ||
          isNullOrEmptyString(fileBase64Name)) && (
            <p className="m-0 fst-italic lh-sm mt-3">
              No attachment or file is missing.
          </p>
        )}
        <Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>
      </Col>
    </Form.Group>
  );
};

export default InputFileComponent;
