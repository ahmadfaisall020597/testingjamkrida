import { Container } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router"
import CardComponent from "src/components/partial/cardComponent"
import DetailBulk from "./detailBulk"
import { useEffect } from "react"
import objectRouterFunctionRequest from "src/utils/router/objectRouter.functionRequest"
import { getBulkListData, getBulkStepFunctionRequest } from "src/utils/localStorage"
import { setBulkStepNameComponent } from "../newFunctionRequestSlice"
import { setShowLoadingScreen } from "src/utils/store/globalSlice"
import ProductBulkSelection from "./productBulkSelection"
import { History } from "src/utils/router"
import OrderPreviewBulk from "./orderPreviewBulk"

const CreateBulkFunctionRequest = ()=>{
  const dispatch = useDispatch()
  const location = useLocation()
  const {bulkStepNameComponent} = useSelector(state => state.newFunctionRequest)

  const stepComponents = {
    DetailBulk,
    ProductBulkSelection,
    OrderPreviewBulk
  };

  const StepComponent = stepComponents[bulkStepNameComponent] || (() => <div>Step Not Found</div>);

  useEffect(()=>{
    if (location.pathname.includes(objectRouterFunctionRequest.submitBulkFunctionRequest.path)) {
      dispatch(setShowLoadingScreen(true))
      if(getBulkStepFunctionRequest()){
        dispatch(setBulkStepNameComponent(getBulkStepFunctionRequest()))
      }

      if(!getBulkListData()){
        History.navigate(objectRouterFunctionRequest.fnRequest.path)
      }

      setTimeout(()=>{
        dispatch(setShowLoadingScreen(false))
      },[500])
    }
  },[location, dispatch])

  return(
    <Container fluid id="create-function-request-page">
      <CardComponent
				title={`New Request`}
				type="create"
			>
        <StepComponent/>
      </CardComponent>
    </Container>
  )
}

export default CreateBulkFunctionRequest