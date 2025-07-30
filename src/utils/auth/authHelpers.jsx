import { store } from "../store/combineReducers";
import { setError, setLoadingMenu, setProfileUsers } from "../store/globalSlice";
import menu from "src/utils/dummy/menu.json";
import listPermission from "src/utils/dummy/listPermission.json";
import userData from "src/utils/dummy/userData.json";
import { getProfileData } from "../api/apiGlobal";

const getProfile = async isDummy => {
	store.dispatch(setLoadingMenu(true));
	// panggil API get profile (ini isinya sekalian sama rolenya, permission list, dan get menu)
	// get menunya (baiknya satu API sama get profile tapi beda key objectnya)
	// call api here
	try {
		if (isDummy) {
			let data = userData;
			// let data = userData

			let menuAkses;
			let dataLoginString = localStorage.getItem("dataLogin");

			let dataJsonLogin = JSON.parse(dataLoginString);

			if (dataJsonLogin && dataJsonLogin.role == "admin") {
				menuAkses = menu.slice(1, 2);
			} else {
				menuAkses = menu.slice(0, 1);
			}

			data = { ...data, listPermissionPage: listPermission, menuWeb: menuAkses };
			if (data.listPermissionPage.length == 0) {
				store.dispatch(setError({ status: 401, message: "UNAUTHORIZED", data: { data: "", type: "loginError" } }));
			}
			store.dispatch(setProfileUsers(data));
		} else {
			const response = await getProfileData();
			if (response) {
				let data = response.data.data;
				// let data = userData
				// data = {...data, listPermissionPage:listPermission, menuWeb: menu}
				if (data.listPermissionPage.length == 0) {
					store.dispatch(setError({ status: 401, message: "UNAUTHORIZED", data: { data: "", type: "loginError" } }));
				}
				store.dispatch(setProfileUsers(data));
			}
		}
	} catch (e) {
		if (e?.response?.status == 400) {
			store.dispatch(setError({ status: 400, message: e?.response?.statusText, data: { data: e?.response?.data?.message + "", type: "loginError" } }));
		} else {
			store.dispatch(setError({ status: 500, message: "ERROR GET PROFILE USERS", data: { data: "", type: "loginError" } }));
		}
	}
};

export default getProfile;
