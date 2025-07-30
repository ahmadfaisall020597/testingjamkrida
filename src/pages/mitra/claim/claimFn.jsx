/* eslint-disable no-unused-vars */
//here you can create shared function per page
import { store } from "src/utils/store/combineReducers";
import { editRoom, getRoomDetails, storeRoom } from "src/utils/api/apiMasterPage";
import { setShowLoadingScreen } from "src/utils/store/globalSlice";
import { toast } from "react-toastify";
import { History } from "src/utils/router";
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage";
import { getDataClaim, getRejectedLampiranClaimApi, updateStatusClaim } from "../../../utils/api/apiClaim";
import { setListClaim, setDetailClaim, resetNewDocumentClaim, resetDetailLampiranClaim, setDetailLampiranClaimResult, setListProdukResult, resetListProduk } from "./claimSlice";
import objectRouter from "../../../utils/router/objectRouter";
import { getLampiranMappingApi, getlistproduct } from "../../../utils/api/apiSettings";
import { resetLampiranList, setLampiranResult } from "../penjaminan/penjaminanSlice";

/**
 * Store a new room
 * @param {object} body - The request body containing room details
 * @returns {void}
 */
export const fnStoreClaim = body => {
	store.dispatch(setShowLoadingScreen(true));
	storeRoom(body)
		.then(res => {
			store.dispatch(setShowLoadingScreen(false));
			toast.success(res.data.message);
			History.navigate(objectRouter.claimMitraPage.path);
		})
		.catch(() => {
			store.dispatch(setShowLoadingScreen(false));
		});
};

/**
 * Get claim details from the server
 * @param {string} claimId - The claim id to fetch
 * @returns {object|null} The claim details or null if the request failed
 */
export const fnGetClaimDetails = async roomId => {
	try {
		store.dispatch(setShowLoadingScreen(true));
		const response = await getRoomDetails({}, roomId);
		if (response) {
			store.dispatch(setShowLoadingScreen(false));
			const data = response.data.data;
			return data || null;
		}
		store.dispatch(setShowLoadingScreen(false));
	} catch (error) {
		store.dispatch(setShowLoadingScreen(false));
		return null;
	}
};

export const fnStoreEditRoom = (body, roomId) => {
	store.dispatch(setShowLoadingScreen(true));
	editRoom(body, roomId)
		.then(res => {
			store.dispatch(setShowLoadingScreen(false));
			toast.success(res.data.message);
			History.navigate(objectRouterMasterPage.room.path);
		})
		.catch(() => {
			store.dispatch(setShowLoadingScreen(false));
		});
};

export const fnGetList = param => {
	getDataClaim(param)
		.then(res => {
			console.log("list res", res);
			store.dispatch(setListClaim(res.data));
		})
		.catch(err => {
			console.log("list err", err);
			store.dispatch(setListClaim());
		});
};

export const fnStoreRejectedClaim = async (body, claim_no)=>{
  store.dispatch(setShowLoadingScreen(true))
  updateStatusClaim(body,claim_no).then(res=>{
	store.dispatch(setShowLoadingScreen(false))
	toast.success(res.data.message)
	History.navigate(objectRouter.ClaimMitraPage.path)
  }).catch(()=>{
	store.dispatch(setShowLoadingScreen(false))
  })
} 

export const fnGetNewLampiranClaim = (jenis_mitra, jenis_produk) => {
	store.dispatch(setShowLoadingScreen(true));
	const module = "claim";
	getLampiranMappingApi({
		jenis_mitra,
		jenis_produk,
		module}).then(res => {
			console.log("res map lampiran claim", res);
			store.dispatch(setLampiranResult(res.data.data));
			store.dispatch(setShowLoadingScreen(false));
	}).catch(err => {
		console.log("new lampiran claim err", err);
		store.dispatch(resetLampiranList());
		store.dispatch(setShowLoadingScreen(false));
	})
}

export const fnGetRejectedLampiranClaim = (claim_no) => {
	store.dispatch(setShowLoadingScreen(true));
	getRejectedLampiranClaimApi(claim_no).then(res => {
		console.log("success get rejected lampiran", res);
		store.dispatch(setLampiranResult(res.data.form));
		store.dispatch(setDetailLampiranClaimResult(res.data.lampiran));
		store.dispatch(setShowLoadingScreen(false));
	}).catch(err => {
		console.log("rejected lampiran err", err);
		store.dispatch(resetLampiranList());
		store.dispatch(resetDetailLampiranClaim());
		store.dispatch(setShowLoadingScreen(false));
	})
}


export const fnGetListProduk = () => {
  console.log("api produk");
  let produkList = [{ value: "", label: "-- Pilih Jenis Produk --" }];
  getlistproduct().then(res => {
	console.log("jenis produk res", res);
	produkList = produkList.concat(res.data.data);
	store.dispatch(setListProdukResult(produkList));
  }).catch(err => {
	console.log("jenis produk err failed", err);
	store.dispatch(setListProdukResult(produkList));
  });
}
