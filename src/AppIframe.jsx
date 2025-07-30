import { createBrowserRouter, RouterProvider } from "react-router";
import "src/assets/style/index.scss";
import OrderHeader from "./pages/iframe/orderHeader";
import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "./components/partial/spinnerComponent";
import { Stack } from "react-bootstrap";
import { MdReportProblem } from "react-icons/md";
import { ErrorBoundary } from "./components/shared/errorPage";

const KEY_IFRAME = import.meta.env.VITE_SUBSCRIPTION_KEY;

const router = createBrowserRouter([
  {
    path: "/iframe-order",
    element: <OrderHeader/>,
    errorElement: <ErrorBoundary />
    
  },
]);

function AppIframe() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const getKeyFromURL = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('key'); // Mengambil parameter 'key'
  }, []);

  useEffect(()=>{
    if(window.location.pathname==='/iframe-order'){
      const key = getKeyFromURL()
      if(key == KEY_IFRAME){
        setAuthorized(true)
      }else{
        setAuthorized(false)
      }
      setLoading(false)
    }
  },[getKeyFromURL])

  if(loading){
    return <LoadingSpinner color="secondary"/>
  }
  if(!authorized){
    return (
      <Stack className="p-3 justify-content-center align-items-center flex-wrap vh-100" gap={2}>
        <MdReportProblem size={50} color={"#e00d0d"} />
        <p className="m-0 fw-bold fs-3">
          401 NOT AUTHORIZED
        </p>
        <p className="m-0">WRONG API KEY</p>
      </Stack>
    );
  }else{
    return <RouterProvider router={router} />
  }
}

export default AppIframe;
