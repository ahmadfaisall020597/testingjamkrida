//here you can create shared function per page

import { toast } from "react-toastify"
import { editLookupValue, getListLookupValue, getLookupValueDetails, storeLookupValue } from "src/utils/api/apiMasterPage"
import { History } from "src/utils/router"
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage"
import { store } from "src/utils/store/combineReducers"
import { setListRolesUsers, setShowLoadingScreen } from "src/utils/store/globalSlice"
import { setListAllLookupValue } from "./lookupValueSetupSlice"
import { 
  roomType, 
  productType, 
  productCategory, 
  productPriceStatus, 
  productClass, 
  addOn, 
  roleUsers,
  requestType,
  statusOrder,
  deliveryType,
  paymentMethod
} from "src/utils/variableGlobal/varLookupValue";
import { setTypeRoom } from "../room/roomSlice"
import { setAddonProduct, setCategoryProduct, setClassProduct, setPriceStatusProduct, setTypeProduct } from "../product/productSlice"
import { setDeliveryType, setRequestType, setStatusOrder } from "src/pages/transaction/newFunctionRequest/newFunctionRequestSlice"
import { setListPaymentMethod } from "src/pages/inquiry/orderHistoryList/orderHistoryListSlice"

// Pemetaan LOOKUP_ID ke Redux Action
const lookupMap = {
  [productType]: setTypeProduct,
  [productCategory]: setCategoryProduct,
  [productPriceStatus]: setPriceStatusProduct,
  [addOn]: setAddonProduct,
  [productClass]: setClassProduct,
  [roomType]: setTypeRoom,
  [roleUsers]: setListRolesUsers, // Jika ada setter lain, ubah di sini
  [requestType]: setRequestType,
  [statusOrder]: setStatusOrder,
  [deliveryType]: setDeliveryType,
  [paymentMethod]: setListPaymentMethod
};

// Fungsi untuk mengupdate Redux berdasarkan `LOOKUP_ID` dan `code_id`
export const updateLookupValues = (lookupData) => {
  lookupData.forEach(lookup => {
    const action = lookupMap[lookup.LOOKUP_ID];

    if (action && lookup.DETAILS?.length > 0) {
      // Misalkan `code_id` ada di dalam lookup.DETAILS
      const mappedDetails = lookup.DETAILS
      store.dispatch(action(mappedDetails));
    }
  });
};

export const getAllLookupValue = () =>{
  const params = {
    pageNumber: 1, 
    lookupName:"",
    pageSize:1,
    sortBy:"",
    order:"asc"
  }
  getListLookupValue(params).then(res=>{
    const totalData = res.data.totalData
    const newParams = {
      ...params,
      pageSize: totalData
    }
    getListLookupValue(newParams).then(res=>{
      // ONLY GET ACTIVE LOOKUP VALUE
      const data = res.data.data.filter(item=>item.STATUS)
      updateLookupValues(data)
      store.dispatch(setListAllLookupValue(data))
    }).catch(err=>{
      toast.error(err.response.data.message)
    })
  }).catch(err=>{
    toast.error(err.response.data.message)
  })
}

/**
 * Store new lookup value
 * @param {object} body - request body
 * @return {void}
 */
export const fnStoreLookupValue = (body)=>{
  store.dispatch(setShowLoadingScreen(true))
  storeLookupValue(body).then(res=>{
    store.dispatch(setShowLoadingScreen(false))
    toast.success(res.data.message)
    History.navigate(objectRouterMasterPage.lookupValue.path)
  }).catch(()=>{
    store.dispatch(setShowLoadingScreen(false))
  })
}

/**
 * Edit lookup value
 * @param {object} body - request body
 * @param {string} valueId - id of lookup value to edit
 * @return {void}
 */
export const fnStoreEditLookupValue = (body, valueId)=>{
  store.dispatch(setShowLoadingScreen(true))
  editLookupValue(body,valueId).then(res=>{
    store.dispatch(setShowLoadingScreen(false))
    toast.success(res.data.message)
    History.navigate(objectRouterMasterPage.lookupValue.path)
  }).catch(()=>{
    store.dispatch(setShowLoadingScreen(false))
  })
}

export const fnGetLookupValueDetails = async (valueId)=>{
  try {
    store.dispatch(setShowLoadingScreen(true))
    const response = await getLookupValueDetails({},valueId)
    if(response){
      store.dispatch(setShowLoadingScreen(false))
      const data = response.data.data
      if(data.STATUS){
        return data.details
      }else{
        return null
      }
    }
    store.dispatch(setShowLoadingScreen(false))
  } catch (error) {
    store.dispatch(setShowLoadingScreen(false))
    return null
  }
}

/**
 * Validasi CODE_ID di listData
 * @param {Array} data - array objek data yang punya property CODE_ID
 * @returns {Object} - { isValid: boolean, message: string|null }
 */
export const validateCodeIds = (data) => {
  // Cek ada yang kosong
  const hasEmptyCode = data.some(row => !row.CODE_ID || row.CODE_ID.trim() === "");
  if (hasEmptyCode) {
    return {
      isValid: false,
      message: "Please fill in all Code fields before proceeding."
    };
  }

  // Cek duplikat
  const codes = data.map(row => row.CODE_ID.trim());
  const uniqueCodes = new Set(codes);
  if (uniqueCodes.size !== codes.length) {
    return {
      isValid: false,
      message: "Duplicate Code detected. Please ensure all codes are unique."
    };
  }

  // Jika lolos validasi
  return {
    isValid: true,
    message: null
  };
}



