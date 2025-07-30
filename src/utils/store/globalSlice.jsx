import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	listData: [],
	showLoadingScreen: false,
	showOffCanvasSideMenu: false,
	showModalAlert: false,
	contentModalAlert: {
		title: "",
		message: "",
		type: "",
		button: null
	},
	showModalQuery: false,
	contentModalQuery: {
		title: "",
		data: null,
		columnConfig: [],
		searchKey: "",
		searchLabel: "",
		usingPaginationServer: true,
		params:{}
	},
	selectableModalQuery: null,
	listRoleUsers:[],
	profileUsers:{},
	UsersRoleFunctionRequest:[],
	listPermissionPage:[],
	listMenu:[],
	loadingMenu: true,
	modalImage:{
		show: false,
		content:""
	},
	modalGlobal:{
		show:false,
		content:{
			captionText: "",
			questionText: "",
			buttonLeftText: "",
			buttonRightText: "",
			buttonLeftFn: null,
			buttonRightFn: null
		}
	},
	error: null,
	dataLogin: {
		email: "",
		user_id:"",
		mitra_id:"",
		name:"",
		password: "",
		role: "",
		token:""
	},
	notifPopupCloseDisabled: false,
	count: 0
};

const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers:{
			setResetGlobalState: () => initialState,
			setShowLoadingScreen:(state, action)=>{state.showLoadingScreen = action.payload},
			setShowOffCanvasSideMenu: (state, action) => { state.showOffCanvasSideMenu = action.payload },
			setListData(state, action){
					state.listData = action.payload
			},
			setShowModalAlert: (state, action) => {
				state.showModalAlert = action.payload.show;
				if (action.payload.content) {
					state.contentModalAlert = action.payload.content;
				} else {
					state.contentModalAlert = initialState.contentModalAlert;
				}
			},
			setShowModalQuery: (state, action)=>{
				state.showModalQuery = action.payload.show;
				if (action.payload.content) {
					state.contentModalQuery = action.payload.content;
				} else {
					state.contentModalQuery = initialState.contentModalQuery;
				}
			},
			setSelectableModalQuery: (state, action)=>{
				state.selectableModalQuery = action.payload
			},
			setListRolesUsers: (state, action)=>{
				state.listRoleUsers = action.payload
			},
			setProfileUsers:(state, action)=>{
				const sortMenuBySequence = (menuArray) => {
					return menuArray
						.map(menuItem => ({
							...menuItem,
							children: sortMenuBySequence(menuItem.children || [])
						}))
						.sort((a, b) => a.sequence - b.sequence)
				}

				state.profileUsers = action.payload
				if(action.payload.appRoles){
					const appRole = action.payload.appRoles
					const roleFunctionRequest = appRole?.find(v=>v.AppId == import.meta.env.VITE_APP_ID)?.Roles
					state.UsersRoleFunctionRequest = roleFunctionRequest
				}
				if(action.payload.listPermissionPage){
					state.listPermissionPage = action.payload.listPermissionPage
				}
				if(action.payload.menuWeb){
					const menu = sortMenuBySequence(action.payload.menuWeb)
					state.listMenu = menu
					state.loadingMenu = false
				}
			},
			setListMenu:(state, action)=>{
				state.listMenu = action.payload
				state.loadingMenu = false
			},
			setLoadingMenu:(state, action)=>{
				state.loadingMenu = action.payload
			},
			setModalImage:(state, action)=>{
				state.modalImage.show = action.payload.show
				state.modalImage.content = action.payload.content || ""
			},
			setShowModalGlobal(state, action){
				state.modalGlobal.show = action.payload.show
				state.modalGlobal.content = action.payload.content || initialState.modalGlobal.content
			},
			setError: (state, action) => {
				state.error = action.payload;
			},
			clearError: (state) => {
				state.error = null;
			},
			setDataLogin: (state, action) => {
				state.dataLogin = action.payload;
			},
			setNotifCount: (state, action) => {
				state.count = action.payload;
			},
			setDisableCloseNotifPopup: (state, action) => {
				state.notifPopupCloseDisabled = action.payload;
			}
    }
})

export const { 
	setResetGlobalState, 
	setShowLoadingScreen, 
	setShowOffCanvasSideMenu,
	setListData, 
	setShowModalAlert, 
	setShowModalQuery, 
	setSelectableModalQuery, 
	setListRolesUsers, 
	setProfileUsers, 
	setListMenu, 
	setLoadingMenu,
	setModalImage,
	setShowModalGlobal,
	setError,
	clearError,
	setDataLogin,
	setDisableCloseNotifPopup,
	setNotifCount
} = globalSlice.actions;

export default globalSlice.reducer;