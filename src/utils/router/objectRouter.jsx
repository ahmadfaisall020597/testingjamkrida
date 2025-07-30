// tutorial this object router
// default: {
// 	title: "Default Page",
// 	path: "/default-page",
// 	element: <DefaultPage />,
// 	index: false,
// 	needAuth: true,
// 	header: true,
// 	footer: true,
// 	sidebar: true,
// },

// import { pathMitra } from "../variableGlobal/varPath";
import { store } from "../store/combineReducers";

const translationData = store.getState().language.translationData;
const code_lang = store.getState().language.selectedLanguage;
const translateTitle = translationData[code_lang];

const objectRouter = {
	// this template
	default: {
		title: "template dummy",
		path: "/template-dummy",
		stringElement: "DefaultPage",
		// if have children dont set the element parent
		index: false,
		needAuth: true,
		header: true,
		footer: true,
		sidebar: true
	},
	templateDummy1: {
		title: "template dummy 1",
		path: "/template-dummy/template-1",
		// if have children dont set the element parent
		// element: <UserIndexPage />,
		index: false,
		needAuth: true,
		header: true,
		footer: true,
		sidebar: true
	},
	readTemplateDummy1: {
		title: "template dummy 1 view",
		path: "/template-dummy/template-1/view",
		// if have children dont set the element parent
		// element: <UserEditPage />,
		index: false,
		needAuth: true,
		header: true,
		footer: true,
		sidebar: true
	},
	editTemplateDummy1: {
		title: "template dummy 1 edit",
		path: "/template-dummy/template-1/edit",
		// if have children dont set the element parent
		// element: <UserEditPage />,
		index: false,
		needAuth: true,
		header: true,
		footer: true,
		sidebar: true
	},
	createTemplateDummy1: {
		title: "template dummy 1 create",
		path: "/template-dummy/template-1/create",
		// if have children dont set the element parent
		// element: <UserCreatePage />,
		index: false,
		needAuth: true,
		header: true,
		footer: true,
		sidebar: true
	},
	// end this template
	login: {
		title: "Login",
		path: "/login-callback",
		stringElement: "LoginCallback",
		index: true,
		needAuth: false,
		header: false,
		footer: false,
		sidebar: false,
		notUsingBreadcrumb: true
	},
	loginPage: {
		title: "Login",
		path: "/login",
		stringElement: "LoginPage",
		index: true,
		needAuth: false,
		header: false,
		footer: false,
		sidebar: false,
		notUsingBreadcrumb: true,
		authType: 'admin'
	},
	loginMitraPage: {
		title: "Login Mitra",
		path: "/login-mitra",
		stringElement: "LoginMitraPage",
		index: true,
		needAuth: false,
		header: false,
		footer: false,
		sidebar: false,
		notUsingBreadcrumb: true,
		authType: 'mitra'
	},
	loginOtpPage: {
		title: "Login OTP",
		path: "/login-otp",
		stringElement: "LoginOtpPage",
		index: true,
		needAuth: false,
		header: false,
		footer: false,
		sidebar: false,
		notUsingBreadcrumb: true
	},
	resetPassword: {
		title: "ResetPasword",
		path: `/reset-password/:key`,
		stringElement: "ResetPassword",
		index: true,
		needAuth: false,
		header: false,
		footer: false,
		sidebar: false
	},
	resetPasswordSuccess: {
		title: "ResetPaswordSuccess",
		path: `/reset-password-success`,
		stringElement: "ResetPasswordSuccess",
		index: true,
		needAuth: false,
		header: false,
		footer: false,
		sidebar: false
	},
	resendEmailAdminforResetPassword: {
		title: "ResendEmailAdmin",
		path: `/resend-email-admin`,
		stringElement: "ResendEmailAdmin",
		index: true,
		needAuth: false,
		header: false,
		footer: false,
		sidebar: false
	},
	resendEmailMitraforResetPassword: {
		title: "ResendEmailMitra",
		path: `/resend-email-mitra`,
		stringElement: "ResendEmailMitra",
		index: true,
		needAuth: false,
		header: false,
		footer: false,
		sidebar: false
	},
	resendEmailSuccess: {
		title: "ResendEmailSuccess",
		path: `/resend-email-success`,
		stringElement: "ResendEmailSuccess",
		index: true,
		needAuth: false,
		header: false,
		footer: false,
		sidebar: false
	},
	registerFormAdminPage: {
		title: "Register Form Admin",
		path: "/register-admin",
		stringElement: "RegisterFormAdminPage",
		index: true,
		needAuth: false,
		header: false,
		footer: false,
		sidebar: false,
		notUsingBreadcrumb: true
	},
	registerFormMitraPage: {
		title: "Register Form Mitra",
		path: "/register-mitra",
		stringElement: "RegisterFormMitraPage",
		index: true,
		needAuth: false,
		header: false,
		footer: false,
		sidebar: false,
		notUsingBreadcrumb: true
	},
	dashboard: {
		title: "POC - Jamkrida Portal Mitra dan Portal Admin",
		path: "/",
		stringElement: "DashboardPage",
		index: true,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true,
		privileges: "R"
	},
	testPage: {
		title: "Test page bro",
		path: "/test-parent",
		stringElement: "TestParentPage",
		index: false,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true,
		privileges: "R"
	},
	// registerMitraPage: {
	// 	title: "Register",
	// 	path: "/register-mitra",
	// 	stringElement: "RegisterMitraPage",
	// 	index: false,
	// 	needAuth: true,
	// 	header: true,
	// 	footer: false,
	// 	sidebar: true,
	// 	privileges: "R"
	// },
	penjaminanMitraPage: {
		title: translateTitle.penjaminanMitra.text1 || "Penjaminan Mitra",
		path: "/mitra/penjaminan-mitra",
		stringElement: "PenjaminanMitraPage",
		index: false,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true,
		privileges: "R"
	},
	createPenjaminanMitraPage: {
		title: "Penjaminan Mitra",
		path: "/mitra/penjaminan-mitra/create",
		stringElement: "CreatePenjaminanMitraPage",
		index: false,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true,
		privileges: "R"
	},
	penjaminanMitraUploadExcelPage: {
		title: "Penjaminan Mitra",
		path: "/mitra/penjaminan-mitra/upload",
		stringElement: "PenjaminanMitraUploadExcelPage",
		index: false,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true,
		privileges: "R"
	},
	detailPenjaminanMitraPage: {
		title: "Detail Penjaminan Mitra",
		path: "/mitra/penjaminan-mitra/detail/:id",
		stringElement: "DetailPenjaminanMitraPage",
		index: false,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true,
		privileges: "R"
	},
	registerSubmitSuccessPage: {
		title: "Register Submit",
		path: "/register-submit-success",
		stringElement: "RegisterSubmitSuccessPage",
		index: true,
		needAuth: false,
		header: false,
		footer: false,
		sidebar: false,
		notUsingBreadcrumb: true
	},
	ClaimMitraPage: {
		title: "Claim Mitra",
		path: "/mitra/claim",
		stringElement: "ClaimMitraPage",
		index: true,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true
	},
	CreateClaimMitraPage: {
		title: "Claim Mitra",
		path: "/mitra/claim/create",
		stringElement: "CreateClaimMitraPage",
		index: false,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true,
		privileges: "R"
	},
	DetailClaimMitraPage: {
		title: "Claim Mitra",
		path: "/mitra/claim/detail/:id",
		stringElement: "DetailClaimMitraPage",
		index: false,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true,
		privileges: "R"
	},
	ClaimMitraUploadExcelPage: {
		title: "Claim Mitra",
		path: "/mitra/claim/upload",
		stringElement: "ClaimMitraUploadExcelPage",
		index: false,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true,
		privileges: "R"
	},
	ClaimBandingPage: {
		title: "Banding Claim Mitra",
		path: "/mitra/claim/banding/:id",
		stringElement: "BandingClaim",
		index: false,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true,
		privileges: "R"
	},
	ClaimRevisiLampiranPage: {
		title: "Revisi Lampiran Claim Mitra",
		path: "/mitra/claim/revisi-lampiran/:id",
		stringElement: "RevisiLampiranClaim",
		index: false,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true,
		privileges: "R"
	},
	SubrogasiMitraPage: {
		title: "Subrogasi Mitra",
		path: "/mitra/subrogasi",
		stringElement: "SubrogasiMitraPage",
		index: true,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true
	},
	CreateSubrogasiMitraPage: {
		title: "Subrogasi Mitra",
		path: "/mitra/subrogasi/create",
		stringElement: "CreateSubrogasiMitraPage",
		index: false,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true,
		privileges: "R"
	},
	SubrogasiMitraUploadExcelPage: {
		title: "Subrogasi Mitra",
		path: "/mitra/subrogasi/upload",
		stringElement: "SubrogasiMitraUploadExcelPage",
		index: false,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true,
		privileges: "R"
	},
	NotifikasiMitraPage: {
		title: "Notifikasi",
		path: "/mitra/notification",
		stringElement: "NotifikasiMitraPage",
		index: true,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true,
	},
	SubrogasiMitraPageDetail: {
		title: "Subrogasi Detail",
		path: "/mitra/subrogasi/detail/:id",
		stringElement: "SubrogasiMitraPageDetail",
		index: true,
		needAuth: true,
		header: true,
		footer: false,
		sidebar: true,
	},
};

export default objectRouter;
