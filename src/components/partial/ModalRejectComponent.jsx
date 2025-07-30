import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalRejectComponent = ({ 
  show, 
  onHide, 
  onConfirm, 
  title = "Reject Data", 
  confirmText = "Ya, Reject", 
  cancelText = "Batal" 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onConfirm();
      onHide();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onHide();
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      centered
      backdrop={isLoading ? "static" : true}
      keyboard={!isLoading}
    >
      <Modal.Header closeButton className="border-bottom">
        <Modal.Title className="fw-bold text-danger">
          <i className="bi bi-x-circle me-2"></i>
          {title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <p className="text-muted mb-3">
              Apakah Anda yakin Reject data ini?
            </p>
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer className="border-top bg-light">
        <Button 
          variant="secondary" 
          onClick={handleClose} 
          disabled={isLoading}
          className="me-2"
        >
          <i className="bi bi-x-lg me-1"></i>
          {cancelText}
        </Button>

        <Button 
          variant="danger" 
          onClick={handleSubmit} 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Memproses...
            </>
          ) : (
            <>
              <i className="bi bi-check-lg me-1"></i>
              {confirmText}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRejectComponent;