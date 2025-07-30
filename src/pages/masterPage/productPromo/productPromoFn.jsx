import { toast } from "react-toastify"
import { editProductPromo, storeProductPromo } from "src/utils/api/apiMasterPage"
import { History } from "src/utils/router"
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage"
import { store } from "src/utils/store/combineReducers"
import { setShowLoadingScreen } from "src/utils/store/globalSlice"

//here you can create shared function per page
export const fnStoreProductPromo = (body)=>{
  store.dispatch(setShowLoadingScreen(true))
  storeProductPromo(body).then(res=>{
    store.dispatch(setShowLoadingScreen(false))
    toast.success(res.data.message)
    History.navigate(objectRouterMasterPage.productPromo.path)
  }).catch(()=>{
    store.dispatch(setShowLoadingScreen(false))
  })
}

export const fnStoreEditProductPromo = (body, valueId)=>{
  store.dispatch(setShowLoadingScreen(true))
  editProductPromo(body,valueId).then(res=>{
    store.dispatch(setShowLoadingScreen(false))
    toast.success(res.data.message)
    History.navigate(objectRouterMasterPage.productPromo.path)
  }).catch(()=>{
    store.dispatch(setShowLoadingScreen(false))
  })
}