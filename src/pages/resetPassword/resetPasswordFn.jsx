import { toast } from "react-toastify"
import { resetPasswordUserMitra } from "../../utils/api/apiResetPassword"
import objectRouter from "../../utils/router/objectRouter"
import { store } from "../../utils/store/combineReducers"
import { setShowLoadingScreen } from "../../utils/store/globalSlice"
import { History } from "src/utils/router" 

export const fnResetPasword = async (body, role)=>{
  store.dispatch(setShowLoadingScreen(true))
  resetPasswordUserMitra(body).then(res=>{
    store.dispatch(setShowLoadingScreen(false))
    //toast.success(res.data.message)
    History.navigate(objectRouter.resetPasswordSuccess.path, { state: { role } }); 
  }).catch(()=>{
    store.dispatch(setShowLoadingScreen(false))
  })
} 