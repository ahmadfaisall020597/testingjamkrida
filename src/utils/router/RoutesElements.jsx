import DashboardPage from "src/pages/dashboard";
import DefaultPage from "src/pages/default";
import RoomIndexPage from "src/pages/masterPage/room";
import LookupValuePage from "src/pages/masterPage/lookupValue";
import CreateLookupValue from "src/pages/masterPage/lookupValue/create";
import EditLookupValue from "src/pages/masterPage/lookupValue/edit";
import OneTimeSetupPage from "src/pages/masterPage/oneTimeSetup";
import ProductPage from "src/pages/masterPage/product";
import ProductPackage from "src/pages/masterPage/productPackage";
import ProductPromo from "src/pages/masterPage/productPromo";
import CreateRoom from "src/pages/masterPage/room/create";
import TenantIndexPage from "src/pages/masterPage/tenant";
import EditRoom from "src/pages/masterPage/room/edit";
import CreateTenant from "src/pages/masterPage/tenant/create";
import EditTenant from "src/pages/masterPage/tenant/edit";
import CreateProduct from "src/pages/masterPage/product/create";
import LoginCallback from "src/pages/loginCallback";
import EditProduct from "src/pages/masterPage/product/edit";
import CreateProductPromo from "src/pages/masterPage/productPromo/create";
import EditProductPromo from "src/pages/masterPage/productPromo/edit";
import CreateProductPackage from "src/pages/masterPage/productPackage/create";
import EditProductPackage from "src/pages/masterPage/productPackage/edit";
import NewFunctionRequest from "src/pages/transaction/newFunctionRequest";
import CreateFunctionRequest from "src/pages/transaction/newFunctionRequest/submitNonBulk/create";
import IndexRequestTransactionList from "src/pages/transaction/RequestTransactionList";
import RequestCommentAndReview from "src/pages/inquiry/RequestCommentAndReview";
import OrderHistoryListPage from "src/pages/inquiry/orderHistoryList";
import RateRequestCommentAndReview from "src/pages/inquiry/RequestCommentAndReview/rate";
import EditRequestTransaction from "src/pages/transaction/RequestTransactionList/edit";
import EditOrViewFunctionRequest from "src/pages/transaction/newFunctionRequest/submitNonBulk/edit";
import EditOrderHistoryList from "src/pages/inquiry/orderHistoryList/edit";
import CreateBulkFunctionRequest from "src/pages/transaction/newFunctionRequest/submitBulk/create";
import ReportingCostControl from "src/pages/reporting/costControl";
import ReportingCampServices from "src/pages/reporting/campService";
import ReportingListPackage from "src/pages/reporting/listPackage";
import ReportingListProduct from "src/pages/reporting/listProduct";
import TenantRequestCommentAndReview from "src/pages/inquiry/TenantRequestCommentAndReview";
import TenantRateRequestCommentAndReview from "src/pages/inquiry/TenantRequestCommentAndReview/rate";
import TestParentPage from "src/pages/testParent";
//import RegisterMitraPage from "src/pages/registerMitra";
import PenjaminanMitraPage from "src/pages/mitra/penjaminan";
import UserMitraPage from "src/pages/portalAdmin/userMitra";
import UserMitraVerificationPage from "src/pages/portalAdmin/userMitra/verification";
import RegisterSubmitSuccessPage from "src/pages/registerMitra/registerSubmitSuccess";
import Login from "src/pages/login/login";
import LoginOTP from "src/pages/login/loginOtp";
import DashboardPagePortalAdmin from "src/pages/portalAdmin";
import RegisterFormMitraPage from "src/pages/register/register";
import DashboardPageMitra from "src/pages/mitra";
import CreatePenjaminan from "../../pages/mitra/penjaminan/create";
import PenjaminanMitraUploadExcelPage from "src/pages/mitra/penjaminan/uploadExcel";
import UserPage from "../../pages/portalAdmin/user";
import SettingsPage from "../../pages/portalAdmin/settings";
import ClaimMitraPage from "../../pages/mitra/claim";
import SubrogasiMitraPage from "../../pages/mitra/subrogasi";
import CreateClaim from "../../pages/mitra/claim/create";
import ClaimMitraUploadExcelPage from "../../pages/mitra/claim/uploadExcel";
import CreateSubrogasi from "../../pages/mitra/subrogasi/create";
import SubrogasiMitraUploadExcelPage from "../../pages/mitra/subrogasi/uploadExcel";
import DetailClaim from "../../pages/mitra/claim/detail";
import DetailPenjaminan from "../../pages/mitra/penjaminan/detail";
import CreateUserMitra from "../../pages/portalAdmin/userMitra/create";
import UploadExcelUserMitra from "../../pages/portalAdmin/userMitra/uploadExcel";
import NotifMitraPage from "../../pages/mitra/notification";
import EditUserMitra from "../../pages/portalAdmin/userMitra/edit";
import SubrogasiMitraPageDetail from "../../pages/mitra/subrogasi/detail";
import ResetPassword from "../../pages/resetPassword";
import LoginMitra from "../../pages/login/loginMitra";
import ClaimBandingPage from "../../pages/mitra/claim/claimBanding";
import ClaimRevisiLampiranPage from "../../pages/mitra/claim/claimRevisiLampiran";
import LanguagePage from "../../pages/language";
import ResendEmailforResetPassword from "../../pages/resendEmailforResetPassword/resendEmail";
import ResendEmailSuccess from "../../pages/resendEmailforResetPassword/resendEmailSuccess";
import ResetPasswordSuccessPage from "../../pages/resetPassword/resetPasswordSuccess";
const RoutesElements = {
	LoginCallback: () => <LoginCallback />,
	DefaultPage: () => <DefaultPage />,
	DashboardPage: () => <DashboardPage />,
	LookupValuePage: () => <LookupValuePage />,
	CreateLookupValue: () => <CreateLookupValue />,
	EditLookupValue: () => <EditLookupValue />,
	RoomIndexPage: () => <RoomIndexPage />,
	CreateRoom: () => <CreateRoom />,
	EditRoom: () => <EditRoom />,
	OneTimeSetupPage: () => <OneTimeSetupPage />,
	ProductPage: () => <ProductPage />,
	CreateProduct: () => <CreateProduct />,
	EditProduct: () => <EditProduct />,
	ProductPackage: () => <ProductPackage />,
	CreateProductPackage: () => <CreateProductPackage />,
	EditProductPackage: () => <EditProductPackage />,
	ProductPromo: () => <ProductPromo />,
	CreateProductPromo: () => <CreateProductPromo />,
	EditProductPromo: () => <EditProductPromo />,
	TenantIndexPage: () => <TenantIndexPage />,
	CreateTenant: () => <CreateTenant />,
	EditTenant: () => <EditTenant />,
	NewFunctionRequest: () => <NewFunctionRequest />,
	CreateFunctionRequest: () => <CreateFunctionRequest />,
	EditOrViewFunctionRequest: () => <EditOrViewFunctionRequest />,
	CreateBulkFunctionRequest: () => <CreateBulkFunctionRequest />,
	IndexRequestTransactionList: () => <IndexRequestTransactionList />,
	EditAndViewRequestTransaction: () => <EditRequestTransaction />,
	RequestCommentAndReview: () => <RequestCommentAndReview />,
	RateRequestCommentAndReview: () => <RateRequestCommentAndReview />,
	TenantRequestCommentAndReview: () => <TenantRequestCommentAndReview />,
	TenantRateRequestCommentAndReview: () => <TenantRateRequestCommentAndReview />,
	OrderHistoryListPage: () => <OrderHistoryListPage />,
	EditOrderHistoryListPage: () => <EditOrderHistoryList />,
	ReportingCostControl: () => <ReportingCostControl />,
	ReportingCampServices: () => <ReportingCampServices />,
	ReportingListPackage: () => <ReportingListPackage />,
	ReportingListProduct: () => <ReportingListProduct />,
	TestParentPage: () => <TestParentPage />,
	//RegisterMitraPage: () => <RegisterMitraPage />,
	PenjaminanMitraPage: () => <PenjaminanMitraPage />,
 	CreatePenjaminanMitraPage : () => <CreatePenjaminan/>,
	PenjaminanMitraUploadExcelPage: () => <PenjaminanMitraUploadExcelPage />,
	UserMitraPage: () => <UserMitraPage />,
	UserPage: () => <UserPage />,
	SettingsPage: () => <SettingsPage />,
	UserMitraVerificationPage: () => <UserMitraVerificationPage />,
	RegisterSubmitSuccessPage: () => <RegisterSubmitSuccessPage />,
	LoginPage: () => <Login />,
	LoginMitraPage : () => <LoginMitra/>,
	LoginOtpPage: () => <LoginOTP />,
	DashboardPagePortalAdmin: () => <DashboardPagePortalAdmin />,
	RegisterFormMitraPage: () => <RegisterFormMitraPage/>,
	RegisterFormAdminPage: () => <RegisterFormMitraPage/>,
	DashboardPageMitra: () => <DashboardPageMitra/>,
	ClaimMitraPage: () => <ClaimMitraPage/>,
	CreateClaimMitraPage: () => <CreateClaim/>,
	DetailClaimMitraPage: () => <DetailClaim />,
	ClaimMitraUploadExcelPage: () => <ClaimMitraUploadExcelPage />,
	SubrogasiMitraPage: () => <SubrogasiMitraPage/>,
	CreateSubrogasiMitraPage: () => <CreateSubrogasi/>,
	SubrogasiMitraUploadExcelPage: () => <SubrogasiMitraUploadExcelPage />,
	DetailPenjaminanMitraPage : () => <DetailPenjaminan/>,
	UserMitraCreatePage : () => <CreateUserMitra/>,
	UserMitraEditPage : () => <EditUserMitra/>,
	UserMitraUploadExcelPage : () => <UploadExcelUserMitra/>,
	NotifikasiMitraPage : () => <NotifMitraPage/>,
	SubrogasiMitraPageDetail : () => <SubrogasiMitraPageDetail/>,
	ResetPassword : () => <ResetPassword/>,
	ResetPasswordSuccess : () => <ResetPasswordSuccessPage/>,
	ResendEmailMitra : () => <ResendEmailforResetPassword/>,
	ResendEmailAdmin : () => <ResendEmailforResetPassword/>,
	ResendEmailSuccess : () => <ResendEmailSuccess/>,
	BandingClaim :() =><ClaimBandingPage/>,
	RevisiLampiranClaim : () => <ClaimRevisiLampiranPage />,
	LanguagePage : () => <LanguagePage />
};

export default RoutesElements;
