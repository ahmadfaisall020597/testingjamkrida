import { Toast, ToastContainer } from "react-bootstrap";

const ToastNotification = ({ message, show, onClose }) => {
  const currentTimestamp = new Date().toLocaleTimeString();
  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast onClose={onClose} show={show} delay={3000} autohide>
        <Toast.Header>
          <strong className="me-auto">Notification</strong>
          <small>{currentTimestamp}</small>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastNotification;
