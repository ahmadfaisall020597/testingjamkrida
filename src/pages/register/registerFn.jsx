/* eslint-disable no-unused-vars */
//here you can create shared function per page
import { store } from "src/utils/store/combineReducers"
import { setShowLoadingScreen } from "src/utils/store/globalSlice"
import { toast } from "react-toastify"
import { History } from "src/utils/router"
import { storeRegister } from "../../utils/api/apiUserMitra"
import objectRouter from "../../utils/router/objectRouter"

/**
 * Store a new user mitra
 * @param {object} body - The request body containing room details
 * @returns {void}
 */
export const fnStoreRegister = (body)=>{
  store.dispatch(setShowLoadingScreen(true))
  storeRegister(body).then(res=>{
    store.dispatch(setShowLoadingScreen(false))
    toast.success(res.data.message)
    History.navigate(objectRouter.registerSubmitSuccessPage.path)
  }).catch(()=>{
    store.dispatch(setShowLoadingScreen(false))
  })
}