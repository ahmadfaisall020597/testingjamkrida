/* eslint-disable no-unused-vars */
//here you can create shared function per page
import { store } from "src/utils/store/combineReducers"
import { editRoom, getRoomDetails, storeRoom } from "src/utils/api/apiMasterPage"
import { setShowLoadingScreen } from "src/utils/store/globalSlice"
import { toast } from "react-toastify"
import { History } from "src/utils/router"
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage"
import { storeClaim, getDetailClaim } from "../../../utils/api/apiClaim"
import { setListData, setLoading } from "./claimSlice"

/**
 * Store a new room
 * @param {object} body - The request body containing room details
 * @returns {void}
 */
export const fnStorePenjaminan = (body) => {
  store.dispatch(setShowLoadingScreen(true))
  storeRoom(body).then(res => {
    store.dispatch(setShowLoadingScreen(false))
    toast.success(res.data.message)
    History.navigate(objectRouter.penjaminanMitraPage.path)
  }).catch(() => {
    store.dispatch(setShowLoadingScreen(false))
  })
}

/**
 * Get penjaminan details from the server
 * @param {string} penjaminanId - The penjaminan id to fetch
 * @returns {object|null} The penjaminan details or null if the request failed
 */
export const fnGetPenjaminanDetails = async (roomId) => {
  try {
    store.dispatch(setShowLoadingScreen(true))
    const response = await getRoomDetails({}, roomId)
    if (response) {
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

export const fnStoreEditRoom = (body, roomId) => {
  store.dispatch(setShowLoadingScreen(true))
  editRoom(body, roomId).then(res => {
    store.dispatch(setShowLoadingScreen(false))
    toast.success(res.data.message)
    History.navigate(objectRouterMasterPage.room.path)
  }).catch(() => {
    store.dispatch(setShowLoadingScreen(false))
  })
}

export const fnSubmitClaim = (params) => {
  store.dispatch(setShowLoadingScreen(true));

  storeClaim(params)
    .then((res) => {
      store.dispatch(setShowLoadingScreen(false));
      toast.success(res.data.message || "Klaim berhasil disimpan!");
      History.navigate("/mitra/claim");
    })
    .catch((err) => {
      store.dispatch(setShowLoadingScreen(false));
      toast.error("Gagal menyimpan klaim!");
      console.error("Error saat mengirim klaim:", err);
    });
};

export const fnGetClaimDetail = (claimNo) => {
  store.dispatch(setShowLoadingScreen(true));
  store.dispatch(setLoading(true));

  getDetailClaim(claimNo)
    .then((res) => {
      store.dispatch(setShowLoadingScreen(false));
      store.dispatch(setLoading(false));
      store.dispatch(setListData(res.data));
    })
    .catch((err) => {
      store.dispatch(setShowLoadingScreen(false));
      store.dispatch(setLoading(false));
      toast.error("Gagal mengambil data klaim!");
      console.error("Error saat mengambil klaim:", err);
    });
};