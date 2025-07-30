/* eslint-disable no-unused-vars */
//here you can create shared function per page
import { store } from "src/utils/store/combineReducers"
import { setShowLoadingScreen } from "src/utils/store/globalSlice"
import { toast } from "react-toastify"
import { History } from "src/utils/router"
import { storeUserMitra, updateStatusApprovalUserMitra, updateUserMitra, updateUserMitraStatus, uploadExcelUserMitra } from "../../../utils/api/apiUserMitra"
import { objectRouterPortalAdmin } from "../../../utils/router/objectRouter.portalAdmin"

/**
 * Store a new user mitra
 * @param {object} body - The request body containing room details
 * @returns {void}
 */
export const fnStoreUserMitra = (body)=>{
  store.dispatch(setShowLoadingScreen(true))
  storeUserMitra(body).then(res=>{
    store.dispatch(setShowLoadingScreen(false))
    toast.success(res.data.message)
    History.navigate(objectRouterPortalAdmin.userMitra.path)
  }).catch(()=>{
    store.dispatch(setShowLoadingScreen(false))
  })
}

/**
 * Upload Excel a new user mitra
 * @param {object} body - The request body containing room details
 * @returns {void}
 */
export const fnUploadExcelUserMitra = (body)=>{
  // debugger;
  store.dispatch(setShowLoadingScreen(true))
  uploadExcelUserMitra(body).then(res=>{
    store.dispatch(setShowLoadingScreen(false))
    toast.success(res.data.message)
    History.navigate(objectRouterPortalAdmin.userMitra.path)
  }).catch(()=>{
    store.dispatch(setShowLoadingScreen(false))
  })
}

export const fnStoreUpdateUserMitra = (body, user_id)=>{
  store.dispatch(setShowLoadingScreen(true))
  updateUserMitra(body,user_id).then(res=>{
    store.dispatch(setShowLoadingScreen(false))
    toast.success(res.data.message)
    History.navigate(objectRouterPortalAdmin.userMitra.path)
  }).catch(()=>{
    store.dispatch(setShowLoadingScreen(false))
  })
} 

export const fnStoreUpdateStatusUserMitra = async (body, user_id)=>{
  store.dispatch(setShowLoadingScreen(true))
  updateUserMitraStatus(body,user_id).then(res=>{
    store.dispatch(setShowLoadingScreen(false))
    toast.success(res.data.message)
    History.navigate(objectRouterPortalAdmin.userMitra.path)
  }).catch(()=>{
    store.dispatch(setShowLoadingScreen(false))
  })
} 
export const fnStoreStatusApprovalUserMitra = async (body, user_id)=>{
  store.dispatch(setShowLoadingScreen(true))
  updateStatusApprovalUserMitra(body,user_id).then(res=>{
    store.dispatch(setShowLoadingScreen(false))
    toast.success(res.data.message)
    History.navigate(objectRouterPortalAdmin.userMitraVerification.path)
  }).catch(()=>{
    store.dispatch(setShowLoadingScreen(false))
  })
} 