/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Col, Form, Row, FormControl } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";

// Komponen input tanggal manual
const DateFieldManual = ({ value, onChange, disabled, placeholder = "dd/mm/yyyy", min, max }) => {
  const hiddenInputRef = useRef();

  const handleOpenPicker = () => {
    if (!disabled && hiddenInputRef.current) {
      if (hiddenInputRef.current?.showPicker) {
        hiddenInputRef.current.showPicker();
      }
    }
  };

  const handleDateChange = (e) => {
    const val = e.target.value; // format yyyy-mm-dd
    if (val) {
      const [y, m, d] = val.split("-");
      const formattedDisplay = `${d}/${m}/${y}`; // untuk tampilan
      onChange(val); // ✅ kirim yyyy-mm-dd ke parent
    } else {
      onChange("");
    }
  };

  // 🔁 Convert yyyy-mm-dd → dd/mm/yyyy (untuk display)
  const displayValue = value && value.includes("-")
    ? value.split("-").reverse().join("/")
    : value;

  return (
    <div style={{ position: "relative", cursor: disabled ? "not-allowed" : "pointer" }}>
      <FormControl
        type="text"
        value={displayValue}
        readOnly
        disabled={disabled}
        placeholder={placeholder}
        onClick={handleOpenPicker}
        style={{ paddingRight: "2rem" }}
      />
      <FaCalendarAlt
        onClick={handleOpenPicker}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: disabled ? "none" : "auto",
          color: "#495057"
        }}
      />
      <input
        type="date"
        ref={hiddenInputRef}
        onChange={handleDateChange}
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          width: 0,
          height: 0
        }}
        disabled={disabled}
        min={min}
        max={max}
      />
    </div>
  );
};

const InputDateRangeComponent = ({
  labelXl = "3",
  labelXs = "4",
  formGroupClassName,
  startDate: initialStartDate,
  onChangeStartDate,
  endDate: initialEndDate,
  onChangeEndDate,
  required,
  readOnly,
  label,
  colEndDateClassName,
  colStartDateClassName,
  rowClassName,
  customLabelFrom,
  customLabelTo,
}) => {
  const [startDate, setStartDate] = useState(initialStartDate || "");
  const [endDate, setEndDate] = useState(initialEndDate || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setStartDate(initialStartDate || "");
    setEndDate(initialEndDate || "");
  }, [initialStartDate, initialEndDate]);

  // Validasi tanggal
  const validateDates = (start, end) => {
    const [sd, sm, sy] = start?.split("/") || [];
    const [ed, em, ey] = end?.split("/") || [];
    const sDate = start ? new Date(`${sy}-${sm}-${sd}`) : null;
    const eDate = end ? new Date(`${ey}-${em}-${ed}`) : null;

    if (sDate && eDate && sDate > eDate) {
      setError("End date cannot be earlier than start date.");
      return false;
    }
    setError("");
    return true;
  };

  // Convert dd/mm/yyyy → yyyy-mm-dd
  // const toISO = (val) => {
  //   const parts = val?.split("/");
  //   return parts?.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : "";
  // };

  return (
    <Row className={`${rowClassName}`}>
      {label &&
        <Col md={labelXs}>
          <Form.Label>
            {label}{required && <span className="text-danger">*</span>}
          </Form.Label>
        </Col>
      }

      {/* Start Date */}
      <Col md={label ? (12 - labelXs) / 2 : 6}>
        <Form.Group as={Row} className={`mb-3 ${formGroupClassName}`}>
          {!label && (
            <Form.Label column xl={labelXl}>
              {customLabelFrom || "Date from"}{required && <span className="text-danger">*</span>}
            </Form.Label>
          )}
          <Col xl={12 - Number(labelXl)} className="position-relative">
            <DateFieldManual
              value={startDate}
              onChange={(val) => {
                setStartDate(val);
                onChangeStartDate(val);
                if (!validateDates(val, endDate)) {
                  setEndDate(val);
                  onChangeEndDate(val);
                }
              }}
              max={endDate}
              required={required}
              disabled={readOnly}
            />
          </Col>
        </Form.Group>
      </Col>

      {/* End Date */}
      <Col md={label ? (12 - labelXs) / 2 : 6}>
        <Form.Group as={Row} className={`mb-3 ${formGroupClassName}`}>
          {!label && (
            <Form.Label column xl={labelXl}>
              {customLabelTo || "Date to"}{required && <span className="text-danger">*</span>}
            </Form.Label>
          )}
          <Col xl={12 - Number(labelXl)} className="position-relative">
            <DateFieldManual
              value={endDate}
              onChange={(val) => {
                setEndDate(val);
                onChangeEndDate(val);
                if (!validateDates(startDate, val)) {
                  setStartDate(val);
                  onChangeStartDate(val);
                }
              }}
              min={startDate}
              required={required}
              disabled={readOnly}
            />
            {error && <Form.Text className="text-danger">{error}</Form.Text>}
          </Col>
        </Form.Group>
      </Col>
    </Row>
  );
};

export default InputDateRangeComponent;
