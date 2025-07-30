import { getAllActiveUsers } from "src/utils/api/apiMasterPage"
import { getCourierListByTenantId, sendMessage } from "src/utils/api/apiTransaction"
import { decryptData, encryptData } from "src/utils/cryptojs"
import { store } from "src/utils/store/combineReducers"
import { setShowLoadingScreen, setShowModalQuery } from "src/utils/store/globalSlice"

export const titleModalQueryCourier = "List All Courier"
export const encryptDataId = (data, from)=>{
  const dataObject = {
    id: data,
    from: from
  }
  return encodeURIComponent(encryptData(dataObject))
}

export const decryptDataId = (data)=>{
  try {
    return decryptData(decodeURIComponent(data))
  } catch {
    return null
  }
}

export const handleModalOpenQueryCourier = () => {
  const data = getCourierListByTenantId;
  
  const columnConfig = [
    {
      name: "Email Address",
      selector: (row) => row.EMAIL_ADDRESS,
      sortable: true,
      sortField: "EMAIL_ADDRESS"
    },
    {
      name: "Name",
      selector: (row) => row.USER_NAME,
      sortable: true,
      sortField: "USER_NAME"
    },
    {
      name: "Badge ID",
      selector: (row) => row.USER_ID,
      sortable: true,
      sortField: "USER_ID"
    },
  ]
  store.dispatch(setShowModalQuery({show:true,
    content:{
      title: titleModalQueryCourier,
      data: data,
      columnConfig: columnConfig,
      searchKey: "fullName",
      searchLabel: "User Name",
      usingPaginationServer: true
    }
  }))
}

export const fnSendMessage = async (body, id)=>{
  try {
    store.dispatch(setShowLoadingScreen(true))
    const response = await sendMessage(id, body)
    if(response){
      store.dispatch(setShowLoadingScreen(false))
      return response
    }
  } catch {
    return null
  } finally {
    store.dispatch(setShowLoadingScreen(false))
  }
}