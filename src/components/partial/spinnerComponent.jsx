import { Spinner } from "react-bootstrap";


const LoadingSpinner = ({
  color = "warning"
}) => {
  return (
    <div className="d-flex justify-content-center align-items-center p-sm-3 p-2">
      <Spinner animation="border" role="status" variant={color}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default LoadingSpinner;
