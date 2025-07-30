import { pathPortalAdmin } from "../variableGlobal/varPath";

const translationData = localStorage.getItem("translation_data");

if (translationData) {
	const parsedTranslation = JSON.parse(translationData);
	console.log(parsedTranslation);
}

export const objectRouterPortalAdmin = {
	DashboardPagePortalAdmin: {
		title: "Dashboard Page Portal Admin",
		path: `${pathPortalAdmin}/dashboard-admin`,
		stringElement: "DashboardPagePortalAdmin",
		index: true,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true
	},
	userMitra: {
		title: "User Mitra",
		path: `${pathPortalAdmin}/user-mitra`,
		stringElement: "UserMitraPage",
		index: true,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true
	},
	userMitraVerification: {
		title: "User Mitra Verification",
		path: `${pathPortalAdmin}/user-mitra/verification`,
		stringElement: "UserMitraVerificationPage",
		index: true,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true
	},
	createUserMitra: {
		title: "User Mitra",
		path: `${pathPortalAdmin}/user-mitra/create`,
		stringElement: "UserMitraCreatePage",
		index: true,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true
	},
	editUserMitra: {
		title: "User Mitra",
		path: `${pathPortalAdmin}/user-mitra/edit/:user_id`,
		stringElement: "UserMitraEditPage",
		index: true,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true
	},
	uploadExcelUserMitra: {
		title: "User Mitra",
		path: `${pathPortalAdmin}/user-mitra/upload-excel`,
		stringElement: "UserMitraUploadExcelPage",
		index: true,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true
	},
	user: {
		title: "User",
		path: `${pathPortalAdmin}/user`,
		stringElement: "UserPage",
		index: true,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true
	},
	settings: {
		title: "Settings",
		path: `${pathPortalAdmin}/settings`,
		stringElement: "SettingsPage",
		index: true,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true
	},
	language: {
		title: "Language",
		path: `${pathPortalAdmin}/language`,
		stringElement: "LanguagePage",
		index: true,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true
	}
};
