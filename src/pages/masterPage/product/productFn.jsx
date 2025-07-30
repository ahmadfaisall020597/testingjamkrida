//here you can create shared function per page

import { toast } from "react-toastify"
import { editProducts, getProductDetails, storeProducts } from "src/utils/api/apiMasterPage"
import { History } from "src/utils/router"
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage"
import { store } from "src/utils/store/combineReducers"
import { setShowLoadingScreen } from "src/utils/store/globalSlice"

/**
 * Store a new room
 * @param {object} body - The request body containing room details
 * @returns {void}
 */
export const fnStoreProduct = (body)=>{
  store.dispatch(setShowLoadingScreen(true))
  storeProducts(body).then(res=>{
    store.dispatch(setShowLoadingScreen(false))
    toast.success(res.data.message)
    History.navigate(objectRouterMasterPage.product.path)
  }).catch(()=>{
    store.dispatch(setShowLoadingScreen(false))
  })
}

export const fnStoreEditProduct = (body, valueId)=>{
  store.dispatch(setShowLoadingScreen(true))
  editProducts(body,valueId).then(res=>{
    store.dispatch(setShowLoadingScreen(false))
    toast.success(res.data.message)
    History.navigate(objectRouterMasterPage.product.path)
  }).catch(()=>{
    store.dispatch(setShowLoadingScreen(false))
  })
}

export const fnGetProductDetails = async (body, productId) =>{
  try {
    store.dispatch(setShowLoadingScreen(true))
    const response = await getProductDetails(body, productId)
    if(response){
      store.dispatch(setShowLoadingScreen(false))
      const data = response.data.data
      return data || null
    }
    store.dispatch(setShowLoadingScreen(false))
    return null
  } catch (error) {
    store.dispatch(setShowLoadingScreen(false))
    return null
   
  }
}

export const setStylePriceStatus = (value, priceStatusProduct) =>{
  const selectedPriceStatus = priceStatusProduct.find(v => v.value === value);
  const textColorStyle = { color: selectedPriceStatus?.desc?.textColor || "black" };
  return { ...textColorStyle }
}