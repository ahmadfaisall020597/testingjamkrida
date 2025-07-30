import { toast } from "react-toastify"
import { resendEmailforResetPassword } from "../../utils/api/apiResetPassword"
import objectRouter from "../../utils/router/objectRouter"
import { store } from "../../utils/store/combineReducers"
import { setShowLoadingScreen } from "../../utils/store/globalSlice"
import { History } from "src/utils/router"

export const fnResendEmailforResetPasword = async (body) => {
    store.dispatch(setShowLoadingScreen(true))
    resendEmailforResetPassword(body).then(res => {
        store.dispatch(setShowLoadingScreen(false))
        //toast.success(res.data.message)
        History.navigate(objectRouter.resendEmailSuccess.path, {
            state: { message: res.data.message }
        });
    }).catch(() => {
        store.dispatch(setShowLoadingScreen(false))
    })
} 