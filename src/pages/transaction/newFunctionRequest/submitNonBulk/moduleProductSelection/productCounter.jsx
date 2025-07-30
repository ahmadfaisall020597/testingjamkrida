import { Button, FormControl, InputGroup } from "react-bootstrap";
import { FaMinus, FaPlus } from "react-icons/fa";

const ProductCounter = ({ count, onIncrease, onDecrease, onManualChange, className  }) => {
  return (
    <InputGroup size="sm" className={`counter-container mb-1 ${className}`}>
      <Button 
        variant="outline-dark" 
        onClick={onDecrease} 
        disabled={count <= 0} 
        className={count <= 0 ? "disabled-btn" : ""}
      >
        <FaMinus />
      </Button>
      <FormControl 
        value={count} 
        className="text-center" 
        onChange={(e) => onManualChange(e.target.value)}
        onBlur={(e) => {
          if (!e.target.value || e.target.value < 0) {
            onManualChange(1); // Default ke 1 jika kosong atau negatif
          }
        }} 
      />
      <Button variant="outline-dark" onClick={onIncrease}>
        <FaPlus />
      </Button>
    </InputGroup>
  );
};

export default ProductCounter