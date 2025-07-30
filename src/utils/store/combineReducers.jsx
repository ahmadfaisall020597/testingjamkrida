import { configureStore } from "@reduxjs/toolkit";
import globalSlice from "./globalSlice";
import defaultSlice from "src/pages/default/defaultSlice";
import tenantSlice from "src/pages/masterPage/tenant/TenantSlice";
import productSlice from "src/pages/masterPage/product/productSlice";
import productPackageSlice from "src/pages/masterPage/productPackage/productPackageSlice";
import productPromoSlice from "src/pages/masterPage/productPromo/productPromoSlice";
import roomSlice from "src/pages/masterPage/room/roomSlice";
import lookupValueSetupSlice from "src/pages/masterPage/lookupValue/lookupValueSetupSlice";
import oneTimeSetupSlice from "src/pages/masterPage/oneTimeSetup/oneTimeSetupSlice";
import newFunctionRequest from "src/pages/transaction/newFunctionRequest/newFunctionRequestSlice";
import requestCommentAndReviewSlice from "src/pages/inquiry/RequestCommentAndReview/requestCommentAndReviewSlice";
import requestTransactionListSlice from "src/pages/transaction/RequestTransactionList/requestTransactionListSlice";
import orderHistoryListSlice from "src/pages/inquiry/orderHistoryList/orderHistoryListSlice";
import penjaminanSlice from "../../pages/mitra/penjaminan/penjaminanSlice";
import userMitraSlice from "../../pages/portalAdmin/userMitra/userMitraSlice";
import settingSlice from "../../pages/portalAdmin/settings/redux/settingSlice";
import loginSlice from  "../../pages/login/loginSlice";
import claimSlice from "../../pages/mitra/claim/claimSlice";
import languageSlice from "../../pages/language/languageSlice"

export const store = configureStore({
	reducer: {
		global: globalSlice,
		default: defaultSlice,
		tenant: tenantSlice,
		product: productSlice,
		productPackage: productPackageSlice,
		productPromo: productPromoSlice,
		room: roomSlice,
		lookupValueSetup: lookupValueSetupSlice,
		oneTimeSetup: oneTimeSetupSlice,
		newFunctionRequest: newFunctionRequest,
		requestCommentAndReview: requestCommentAndReviewSlice,
		requestTransactionList: requestTransactionListSlice,
		orderHistoryList: orderHistoryListSlice,
		penjaminan: penjaminanSlice,
		userMitra: userMitraSlice,
		settings: settingSlice,
		login: loginSlice,
		claim: claimSlice,
		language: languageSlice
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false
		})
});
