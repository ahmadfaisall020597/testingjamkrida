import { Spinner, Stack } from "react-bootstrap";


const LoadingComponent = ({show}) =>{
  if(show){
    return (
      <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 bg-dark bg-opacity-75" style={{zIndex:1056}}>
        <Stack className="w-100 h-100 align-items-center justify-content-center">
          <Spinner animation="border" role="status" variant={"warning"}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Stack>
      </div>
    )
  }
  return null
}

export default LoadingComponent;