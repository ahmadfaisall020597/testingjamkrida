import { Form, Row } from "react-bootstrap";

const InputSwitchComponent = ({
  value,
  onChange,
  label,
  formGroupClassName,
  type = "switch",
  readOnly,
  required,
  errorMessage,
  name,
  marginBottom = "3",
  reverse,
  onClick
}) => {
  // **Handler untuk validasi onChange**
  const handleChange = (checked) => {
    if (readOnly) {
      console.warn("🔴 onChange prevented: Component is read-only.");
      return;
    }
    if (typeof checked !== "boolean") {
      console.error("🔴 Invalid value passed to onChange. Expected boolean.");
      return;
    }
    onChange?.(checked); // Panggil hanya jika valid dan onChange tersedia
  };

  // **Handler untuk validasi onClick**
  const handleClick = (checked) => {
    if (readOnly) {
      console.warn("🔴 onClick prevented: Component is read-only.");
      return;
    }
    if (typeof checked !== "boolean") {
      console.error("🔴 Invalid value passed to onClick. Expected boolean.");
      return;
    }
    onClick?.(checked); // Panggil hanya jika valid dan onClick tersedia
  };

  return (
    <Form.Group as={Row} className={`mb-${marginBottom} ${formGroupClassName}`}>
      <Form.Check
        className="fs-4"
        reverse={reverse}
        type={type}
        defaultChecked={value}
        disabled={readOnly}
        required={required}
        name={name}
        onChange={(e) => handleChange(e.target.checked)}
        label={
          label && (
            <p className="fs-6 m-0 mx-2">
              {label}{required && <span className="text-danger">*</span>}
            </p>
          )
        }
        onClick={(e) => handleClick(e.target.checked)}
      />
      <Form.Control.Feedback type="invalid">
        {errorMessage}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default InputSwitchComponent;
