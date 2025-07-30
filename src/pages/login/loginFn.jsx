/* eslint-disable no-unused-vars */
import { toast } from "react-toastify";
import { store } from "../../utils/store/combineReducers";
import { setListGeneralSettings, setResentLoginOTPState } from "./loginSlice";
import { getSettingGeneral } from "../../utils/api/apiSettings";
import { getCountNotif } from "../../utils/api/apiNotif";
import { setDisableCloseNotifPopup, setNotifCount, setShowLoadingScreen } from "../../utils/store/globalSlice";

export const fnVerifyOTP = async body => {
	// store.dispatch(setShowLoadingScreen(true))
	// verifyOtp(body).then(res=>{
	//   store.dispatch(setShowLoadingScreen(false))
	//   toast.success(res.data.message)
	//   //History.navigate(objectRouterMitra.Dashboard.path)
	// }).catch(()=>{
	//   store.dispatch(setShowLoadingScreen(false))
	// })
};

export const fnGetlistSettingGeneralLogin = dispatch => {
	getSettingGeneral()
		.then(res => {
			const settingGeneralLogin = res.data.data;

			const maxFailedLogin = settingGeneralLogin.find(item => item.key === "MAX_FAILED_LOGIN_ATTEMP_GENERAL_SETTINGS");
			const failedLoginSuspended = settingGeneralLogin.find(item => item.key === "FAILED_LOGIN_SUSPENDED_GENERAL_SETTINGS");
			dispatch(
				setListGeneralSettings({
					maxFailedLogin: maxFailedLogin?.value ?? null,
					failedLoginSuspended: failedLoginSuspended?.value ?? null
				})
			);
		})
		.catch(err => {
			console.log("General setting err failed", err);
		});
};

export const fnGetResentOTPValue = (dispatch, value) => {
	console.log("fnGetResentOTPValue", value);
	dispatch(setResentLoginOTPState(value));
};

export const fnGetForceNotif = () => {
	const userLoginRaw = JSON.parse(localStorage.getItem("dataLogin")) || {};
	const userId = { id: userLoginRaw?.data?.user_id ?? null };
	let closeDisabled = false;

	// store.dispatch(setShowLoadingScreen(true));
	getSettingGeneral().then(res => {
		console.log("gen setting res", res);
		const dataArr = res.data.data;
		if(dataArr instanceof Array) {
			closeDisabled = dataArr.some(obj =>
				obj.key === "FORCE_NOTIVE_SHOW_GENERAL_SETTINGS" &&
				obj.value === "1");
		}
		console.log("value close disable", closeDisabled);
		store.dispatch(setDisableCloseNotifPopup(closeDisabled));
		getCountNotif(userId).then(countRes => {
			console.log("notif count res", countRes);
			store.dispatch(setNotifCount(countRes.data.data.count));
			// store.dispatch(setShowLoadingScreen(false));
		}).catch(countErr => {
			console.log("caught notif count err", countErr);
			store.dispatch(setNotifCount(0));
			// store.dispatch(setShowLoadingScreen(false));
		});
	}).catch(err => {
		console.log("caught gen setting err", err);
		store.dispatch(setDisableCloseNotifPopup(closeDisabled));
		getCountNotif(userId).then(countRes => {
			console.log("notif count res", countRes);
			store.dispatch(setNotifCount(countRes.data.data.count));
			// store.dispatch(setShowLoadingScreen(false));
		}).catch(countErr => {
			console.log("caught notif count err", countErr);
			store.dispatch(setNotifCount(0));
			// store.dispatch(setShowLoadingScreen(false));
		});
	});
}

