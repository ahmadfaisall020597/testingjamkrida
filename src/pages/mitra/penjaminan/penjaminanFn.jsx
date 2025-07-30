/* eslint-disable no-unused-vars */
//here you can create shared function per page
import { store } from "src/utils/store/combineReducers"
import { editRoom, getRoomDetails, storeRoom } from "src/utils/api/apiMasterPage"
import { setShowLoadingScreen } from "src/utils/store/globalSlice"
import { resetLampiranList, setLampiranResult, setListPenjaminan, setResetVerifyDukcapil, setVerifyDukcapilResult, setListProdukResult, resetListProduk, setShowPenjaminan } from "./penjaminanSlice"
import { toast } from "react-toastify"
import { History } from "src/utils/router"
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage"
import { list, verifyDukcapilApi, show } from "../../../utils/api/apiPenjaminan"
import { getLampiranMappingApi, getlistproduct } from "../../../utils/api/apiSettings"

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

export const fnResetVerifyDukcapil = () => {
  console.log("reset verif");
  store.dispatch(setResetVerifyDukcapil());
}

export const fnVerifyDukcapil = (nik) => {
  store.dispatch(setShowLoadingScreen(true));
  return verifyDukcapilApi({ nik }).then(res => {
    console.log("verif res", res);
    store.dispatch(setVerifyDukcapilResult(res.data.status));
    store.dispatch(setShowLoadingScreen(false));
  }).catch(err => {
    console.log("verif err", err);
    store.dispatch(setResetVerifyDukcapil());
    store.dispatch(setShowLoadingScreen(false));
  })
}

export const fnResetLampiranMitra = () => {
  store.dispatch(resetLampiranList());
}

export const fnGetLampiranPenjaminan = (mitra, jenisProduk) => {
  console.log("manggil API");
  store.dispatch(setShowLoadingScreen(true));
  getLampiranMappingApi({
    jenis_mitra: mitra,
    jenis_produk: jenisProduk,
    module: 'penjaminan'
  }).then((res) => {
    console.log("mapping lampiran jaminan res", res);
    store.dispatch(setLampiranResult(res.data.data));
    store.dispatch(setShowLoadingScreen(false));
  }).catch((err) => {
    console.log("mapping lampiran penjaminan err failed", err);
    store.dispatch(resetLampiranList());
    store.dispatch(setShowLoadingScreen(false));
  });
  // const dummyResponse = [
  // 	{
  // 		value: "ktp",
  // 		label: "Kartu Tanda Penduduk"
  // 	},
  // 	{
  // 		value: "npwp",
  // 		label: "Nomor Pokok Wajib Pajak"
  // 	},
  // 	{
  // 		value: "srtp",
  // 		label: "Surat Permohonan"
  // 	}
  // ];
}

export const fnGetListProdukPenjaminan = () => {
  console.log("api produk penjaminan");
  let produkList = [{ value: "", label: "-- Pilih Jenis Produk --" }];
  getlistproduct().then(res => {
    console.log("jenis produk jaminan res", res);
    produkList = produkList.concat(res.data.data);
    store.dispatch(setListProdukResult(produkList));
  }).catch(err => {
    console.log("jenis produk penjaminan err failed", err);
    store.dispatch(setListProdukResult(produkList));
  });
}

export const fnGetList = (param) => {
  list(param).then(res => {
    console.log("list res", res);
    store.dispatch(setListPenjaminan(res.data));
  }).catch(err => {
    console.log("list err", err);
    store.dispatch(setListPenjaminan());
  })
}

export const fnShowPenjaminan = (trx_no, param = {}) => {
  show(trx_no, param)
    .then(res => {
      console.log('show penjaminan : ', res);
      store.dispatch(setShowPenjaminan(res.data));
    })
    .catch(err => {
      console.log('error', err);
      store.dispatch(setShowPenjaminan());
    });
};