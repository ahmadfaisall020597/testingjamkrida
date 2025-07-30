import { Col, Form, Row } from "react-bootstrap";


const InputDropdownComponent = ({
  value,
  onChange,
  label = "Input Data",
  formGroupClassName,
  labelXl = "3",
  ColXl = 12-Number(labelXl),
  listDropdown = [],
  readOnly,
  valueIndex,
  required,
  submitTrigger,
  name,
  colClassName,
  marginBottom = "4",
  disabledListOption = [],
  isInvalid = false
}) => {
  return (
    <Form.Group as={Row} className={`mb-${marginBottom} ${formGroupClassName}`}>
      {label && 
        <Form.Label column xl={labelXl}>
          {label}{required && <span className="text-danger">*</span>}
        </Form.Label>
      }
      <Col xl={ColXl} className={colClassName}>
        <Form.Select 
          onChange={(e)=>readOnly ? null : onChange(e)} 
          disabled={readOnly}
          required={required}
          value={value}
          name={name}
          isInvalid={isInvalid}
          // isInvalid={required && (value==null || value=="") && submitTrigger  ? true : false}
        >
          {
            listDropdown?.length > 0 && listDropdown.map((v, index)=>
              <option disabled={disabledListOption.includes(v.value)} key={index} value={valueIndex? v.value:v}>{valueIndex? v.label:v}</option>
            )
          }
        </Form.Select>
        {required && (value==null || value=="") && submitTrigger && <span className="text-danger">{label} is mandatory</span>}
      </Col>
    </Form.Group>
  );
};

export default InputDropdownComponent;
