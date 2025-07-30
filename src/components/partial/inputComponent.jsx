import { useRef } from "react";
import { Col, Form, FormControl, Row } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";
import { formatNumberWithThousandSeparator } from "src/utils/helpersFunction";

const InputComponent = ({
  value,
  onChange,
  label = "Input Data",
  placeholder,
  formGroupClassName,
  labelXl = "3",
  ColXl = 12 - Number(labelXl),
  type,
  readOnly,
  required,
  errorMessage,
  name,
  disabled,
  marginBottom = "4",
  colClassName,
  inputClassName,
  rows = "4",
  style,
  needSeparator,
  onKeyDown,
  isInvalid = false,
}) => {
  const hiddenInputRef = useRef();

  // Format untuk tampilan tanggal dd/mm/yyyy
  const displayDate = (value && type === "date" && value.includes("-"))
    ? value.split("-").reverse().join("/")
    : value;

  const handleDateClick = () => {
    hiddenInputRef.current?.showPicker();
  };

  const handleDateChange = (e) => {
    onChange(e);
  };

  const handleInputChange = (e) => {
    let formattedValue = e.target.value;
    if (needSeparator) {
      let rawValue = e.target.value.replace(/\./g, "");
      formattedValue = formatNumberWithThousandSeparator(rawValue);
    }
    onChange(e, formattedValue);
  };

  return (
    <Form.Group as={Row} className={`mb-${marginBottom} ${formGroupClassName}`}>
      {label && (
        <Form.Label column xl={labelXl}>
          {label} {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}
      <Col xl={ColXl} className={colClassName}>
        {type === "date" ? (
          <div style={{ position: "relative", cursor: disabled ? "not-allowed" : "pointer" }}>
            <FormControl
              type="text"
              value={displayDate}
              placeholder="dd/mm/yyyy"
              readOnly
              disabled={disabled}
              onClick={handleDateClick}
              className={`${inputClassName} ${isInvalid ? "is-invalid" : ""}`}
              style={{ ...style, paddingRight: "2rem" }}
            />
            <FaCalendarAlt
              onClick={handleDateClick}
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
              name={name}
              disabled={disabled}
              required={required}
            />
          </div>
        ) : (
          <FormControl
            className={inputClassName}
            type={type}
            placeholder={placeholder}
            aria-label="input"
            onChange={disabled ? null : handleInputChange}
            value={value || ""}
            readOnly={readOnly}
            required={required}
            name={name}
            disabled={disabled}
            rows={type === "textarea" ? rows : null}
            as={type === "textarea" ? "textarea" : "input"}
            style={style}
            min={type === "number" ? 1 : null}
            onKeyDown={onKeyDown}
            isInvalid={isInvalid}
          />
        )}
        <Form.Control.Feedback type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      </Col>
    </Form.Group>
  );
};

export default InputComponent;
