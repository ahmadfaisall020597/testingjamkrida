import { Stack } from "react-bootstrap";
import { isRouteErrorResponse, useRouteError } from "react-router";
import { MdReportProblem } from "react-icons/md";
import ButtonComponent from "../partial/buttonComponent";
import authInstance from "src/utils/keycloak/keycloak";

export function ErrorBoundary() {
  const errorRouter = useRouteError();

  if (isRouteErrorResponse(errorRouter)) {
    return(
      <Stack className="p-3 justify-content-center align-items-center flex-wrap vh-100" gap={2}>
        <MdReportProblem size={50} color={"#e00d0d"}/>
        <p className="m-0 fw-bold fs-3">
          {errorRouter.status} {errorRouter.statusText}
        </p>
        {
          typeof errorRouter.data == "string" &&
          <p className="m-0 ">{errorRouter.data}</p>
        }
      </Stack>
    ) 
  } else if (errorRouter instanceof Error && import.meta.env.VITE_CONF_ENV !== "PRD") {
    return(
      <div className="p-3">
        <h1>Unexpected Application Error!</h1>
        <p>{errorRouter.message}</p>
        <pre style={{padding: "0.5rem", backgroundColor: "rgba(200, 200, 200, 0.5)"}}>{errorRouter.stack}</pre>
      </div>
    )
  } else if (errorRouter?.type=="DataWithResponseInit"){
    console.log("masuk sini")

    return(
      <Stack className="p-3 justify-content-center align-items-center flex-wrap vh-100" gap={2}>
        <MdReportProblem size={50} color={"#e00d0d"}/>
        <p className="m-0 fw-bold fs-3">
          {errorRouter?.init?.status} {errorRouter?.init?.statusText}
        </p>
        {
          typeof errorRouter.data?.data == "string" &&
          <>
            <p className="m-0 ">{errorRouter.data?.data} {errorRouter?.data?.config?.url}</p>
            {
              errorRouter?.data?.type == "loginError" &&
              <ButtonComponent onClick={() => authInstance.logout()} title={"Click Here to Logout"}/>
            }
          </>
        }
        {
          typeof errorRouter.data == "object" &&
          <p className="m-0 ">{errorRouter.data?.config?.url}</p>
        }
      </Stack>
    )
  }

  return(
    <h1>Unknown Error</h1>
  )
  
}