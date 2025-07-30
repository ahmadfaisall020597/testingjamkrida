/* eslint-disable no-unused-vars */
//here you can create shared function per page
import { store } from "src/utils/store/combineReducers"
import { editRoom, getRoomDetails, storeRoom } from "src/utils/api/apiMasterPage"
import { setShowLoadingScreen } from "src/utils/store/globalSlice"
import { toast } from "react-toastify"
import { History } from "src/utils/router"
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage"

/**
 * Store a new room
 * @param {object} body - The request body containing room details
 * @returns {void}
 */
export const fnStoreRoom = (body)=>{
  store.dispatch(setShowLoadingScreen(true))
  storeRoom(body).then(res=>{
    store.dispatch(setShowLoadingScreen(false))
    toast.success(res.data.message)
    History.navigate(objectRouterMasterPage.room.path)
  }).catch(()=>{
    store.dispatch(setShowLoadingScreen(false))
  })
}

/**
 * Get room details from the server
 * @param {string} roomId - The room id to fetch
 * @returns {object|null} The room details or null if the request failed
 */
export const fnGetRoomDetails = async (roomId)=>{
  try {
    store.dispatch(setShowLoadingScreen(true))
    const response = await getRoomDetails({},roomId)
    if(response){
      store.dispatch(setShowLoadingScreen(false))
      const data = response.data.data
      return data || null
    }
    store.dispatch(setShowLoadingScreen(false))
  } catch (error) {
    store.dispatch(setShowLoadingScreen(false))
    return null
  }
}

export const fnStoreEditRoom = (body, roomId)=>{
  store.dispatch(setShowLoadingScreen(true))
  editRoom(body,roomId).then(res=>{
    store.dispatch(setShowLoadingScreen(false))
    toast.success(res.data.message)
    History.navigate(objectRouterMasterPage.room.path)
  }).catch(()=>{
    store.dispatch(setShowLoadingScreen(false))
  })
} 