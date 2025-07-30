import { Button, Col, Form, FormControl, InputGroup, Row } from "react-bootstrap";

const InputModalQueryComponent = ({
  value,
  onChange,
  buttonOnclick,
  componentButton = <div className="fw-bold">Q</div>,
  label = "Search Data",
  formGroupClassName,
  labelXl = "3",
  required,
  marginBottom = "3",
  disabled,
  defaultValue
}) => {
  const handleCLick = () =>{
    if(disabled){
      return
    }
    buttonOnclick()
  }
  return(
    <Form.Group as={Row} className={`mb-${marginBottom} ${formGroupClassName}`}>
      {label && 
        <Form.Label column xl={labelXl}>
          {label}{required && <span className="text-danger">*</span>}
        </Form.Label>
      }
      
      <Col xl={12-Number(labelXl)}>
        <InputGroup>
          <FormControl 
            type="text"
            aria-label="Search" 
            aria-describedby="search-icon" 
            value={value || ""}
            onClick={handleCLick} 
            onKeyDown={(e)=>e.preventDefault()}
            required={required}
            disabled={disabled}
            style={{caretColor:"transparent", cursor:"pointer"}}
            readOnly={true}
          />
          <Button variant="dark" onClick={handleCLick}>{componentButton}</Button>
        </InputGroup>
      </Col>
    </Form.Group>
  )
};

export default InputModalQueryComponent;
