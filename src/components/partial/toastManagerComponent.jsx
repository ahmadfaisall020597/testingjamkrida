// src/components/ToastManager.jsx
import { ToastContainer } from 'react-toastify';

const ToastManager = () => (
  <ToastContainer 
    pauseOnFocusLoss={false} 
    position="top-center" 
    autoClose={3000} 
    hideProgressBar={false} 
    closeOnClick 
    closeButton={false} 
    stacked
  />
);

export default ToastManager;
