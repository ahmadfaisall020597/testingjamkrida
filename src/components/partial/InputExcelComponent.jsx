import { Col, Form, Row, Stack } from "react-bootstrap";
import ButtonComponent from "./buttonComponent";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import closeImage from "src/assets/image/close_upload_image.png";
import { Image } from "react-bootstrap";
import { truncateString } from "src/utils/helpersFunction";

const InputExcelComponent = ({
  onChange,
  label = "Upload Excel File",
  controlId = "formControlExcelUpload",
  termsConditionText = "Only .csv files. Max file size: 5MB.",
  formGroupClassName,
  readOnly,
  required,
  errorMessage,
  marginBottom = "4",
  labelXl = "3",
  ColXl = 12 - Number(labelXl),
  colClassName,
  downloadTemplate
}) => {
  const [fileName, setFileName] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const isExcel = //file.type === "application/vnd.ms-excel" ||
        //file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "text/csv";
      const isValidSize = file.size <= 5 * 1024 * 1024;

      if (isExcel && isValidSize) {
        setFileName(file.name);
        setFile(file);
        if (onChange) onChange(file);
      } else {
        toast.error("Invalid file. Only Excel (.csv) files under 5MB are allowed.");
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
      URL.revokeObjectURL(url); // Clean up after download
    }
  };

  return (
    <Form.Group as={Row} className={`mb-${marginBottom} ${formGroupClassName} align-items-center`}>
      <Form.Label column xl={labelXl}>
        {label} {required && <span className="text-danger">*</span>}
      </Form.Label>
      {downloadTemplate && (
        <a
          href="/assets/Form_Upload_User_Mitra.csv"
          download
          className="d-flex align-items-center mb-2"
          title="Download Template Upload Excel"
        >
          <i className="fas fa-download me-1"></i>
          <span className="d-none d-md-inline">Download Template</span>
        </a>

      )}
      <Col xl={ColXl} className={colClassName}>
        <Stack direction="horizontal" className="flex-wrap" gap={2}>
          <ButtonComponent
            onClick={() => document.getElementById(`${controlId}-file-upload`).click()}
            type="button"
            variant="primary"
            title="Browse"
            className="text-white justify-items-center px-2"
            rounded="2"
            disabled={readOnly}
          />
          <Form.Control
            id={`${controlId}-file-upload`}
            type="file"
            accept=".csv,.xls,.xlsx"
            className="d-none"
            onChange={handleFileChange}
            disabled={readOnly}
            ref={fileInputRef}
          />
          <p className="m-0 fw-light fst-italic small lh-sm">{termsConditionText}</p>
          {fileName && (
            <p className="m-0 fst-italic lh-sm">
              <a className="link-underline-primary" role="button" onClick={handleDownloadFile}>
                {truncateString(fileName, 12)}
              </a>
              <span className="ps-3" onClick={handleRemoveFile} style={{ cursor: "pointer" }}>
                <Image src={closeImage} width={18} />
              </span>
            </p>
          )}
        </Stack>
        <Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>
      </Col>
    </Form.Group>
  );
};

export default InputExcelComponent;
