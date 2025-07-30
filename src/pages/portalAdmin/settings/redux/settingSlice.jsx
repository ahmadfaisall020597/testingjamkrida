import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	modules: {
		PENJAMINAN_SETTINGS: {
			selectedMitra: null,
			selectedProduct: null,
			selectedItems: [],
			pendingChanges: false,
			data: {}
		},
		KLAIM_SETTINGS: {
			selectedMitra: null,
			selectedProduct: null,
			selectedItems: [],
			selectedItemsLampiran: [],
			selectedItemsReasonClaim: [],
			pendingChanges: false,
			data: {},
			dataLampiran: {},
			dataReasonClaim: {}
		},
		SUBROGASI_SETTINGS: {
			selectedMitra: null,
			selectedProduct: null,
			selectedItems: [],
			pendingChanges: false,
			data: {}
		},
		GENERAL_SETTINGS: {
			pendingChanges: false,
			data: {},
			dataAPI: {}
		}
	},
	isLoading: false,
	error: null,
	lastUpdated: null
};

const settingsSlice = createSlice({
	name: "settings",
	initialState,
	reducers: {
		mergeWithExistingData: (state, action) => {
			const { module, items, mitra, product } = action.payload;
			const key = `${mitra}_${product}`;

			// console.log(` Merging data for ${module}:`, {
			// 	mitra,
			// 	product,
			// 	fetchedItems: items,
			// 	existingData: state.modules[module].data[key]
			// });

			if (state.modules[module]) {
				const existingChanges = state.modules[module].data[key];

				if (existingChanges && existingChanges.hasUserChanges) {
					state.modules[module].selectedItems = existingChanges.items;
				} else {
					state.modules[module].selectedItems = items;
					state.modules[module].data[key] = {
						mitra,
						product,
						items,
						hasUserChanges: false,
						timestamp: new Date().toISOString()
					};
				}
			}
		},

		dataGeneralSettings: (state, action) => {
			const settings = action.payload;
			state.modules.GENERAL_SETTINGS.data = settings;
			state.modules.GENERAL_SETTINGS.pendingChanges = false;
		},

		// Perbaikan pada updateSelectedItems reducer
		updateSelectedItems: (state, action) => {
			const { module, items, allItems, mitra, product, isUserChange = true, key } = action.payload;

			if (state.modules[module]) {
				state.modules[module].pendingChanges = true;
				state.modules[module].lastUpdated = new Date().toISOString();

				if (module === "GENERAL_SETTINGS") {
					state.modules[module].data = {
						...state.modules[module].data,
						[mitra]: {
							...state.modules[module].data[mitra],
							[product]: items
						}
					};
				} else if (module === "KLAIM_SETTINGS") {
					const dataKey = `${mitra}_${product}`;

					if (allItems && allItems.length > 0) {
						const itemsWithStatus = allItems.map(item => ({
							...item,
							isSelected: items.includes(item.value),
							willBeUpdated: items.includes(item.value),
							status: items.includes(item.value) ? "UPDATE" : "NO_UPDATE"
						}));

						if (key === "lampiran") {
							state.modules[module].dataLampiran[dataKey] = {
								mitra,
								product,
								items,
								allItems: itemsWithStatus,
								hasUserChanges: isUserChange,
								timestamp: new Date().toISOString()
							};
							state.modules[module].selectedItemsLampiran = items; // Update selectedItemsLampiran
						}

						if (key === "reason_claim") {
							state.modules[module].dataReasonClaim[dataKey] = {
								mitra,
								product,
								items,
								allItems: itemsWithStatus,
								hasUserChanges: isUserChange,
								timestamp: new Date().toISOString()
							};
							state.modules[module].selectedItemsReasonClaim = items; // Update selectedItemsReasonClaim
						}
					}
				} else {
					const dataKey = `${mitra}_${product}`;

					if (allItems && allItems.length > 0) {
						const itemsWithStatus = allItems.map(item => ({
							...item,
							isSelected: items.includes(item.value),
							willBeUpdated: items.includes(item.value),
							status: items.includes(item.value) ? "UPDATE" : "NO_UPDATE"
						}));

						state.modules[module].data[dataKey] = {
							mitra,
							product,
							items,
							allItems: itemsWithStatus,
							hasUserChanges: isUserChange,
							timestamp: new Date().toISOString()
						};
					} else {
						state.modules[module].data[dataKey] = {
							mitra,
							product,
							items,
							hasUserChanges: isUserChange,
							timestamp: new Date().toISOString()
						};
					}

					state.modules[module].selectedItems = items; // Update selectedItems untuk module lain
				}
			}
		},

		// // Tambahkan reducer baru untuk menyimpan semua data dengan status
		// updateAllItemsWithStatus: (state, action) => {
		// 	const { module, allItems, selectedItems, mitra, product, isUserChange = true } = action.payload;

		// 	if (state.modules[module]) {
		// 		const key = `${mitra}_${product}`;

		// 		// Kategorikan items berdasarkan status
		// 		const itemsWithStatus = allItems.map(item => ({
		// 			...item,
		// 			isSelected: selectedItems.includes(item.value),
		// 			willBeUpdated: selectedItems.includes(item.value),
		// 			status: selectedItems.includes(item.value) ? "UPDATE" : "NO_UPDATE"
		// 		}));

		// 		state.modules[module].selectedItems = selectedItems;
		// 		state.modules[module].pendingChanges = true;
		// 		state.modules[module].lastUpdated = new Date().toISOString();

		// 		state.modules[module].data[key] = {
		// 			mitra,
		// 			product,
		// 			items: selectedItems, // Items yang tercentang
		// 			allItems: itemsWithStatus, // Semua items dengan status
		// 			hasUserChanges: isUserChange,
		// 			timestamp: new Date().toISOString()
		// 		};
		// 	}
		// },

		getExistingData: (state, action) => {
			const { module, mitra, product } = action.payload;
			const key = `${mitra}_${product}`;

			if (state.modules[module] && state.modules[module].data[key]) {
				return state.modules[module].data[key];
			}
			return null;
		},

		setLoading: (state, action) => {
			state.isLoading = action.payload;
		},

		setError: (state, action) => {
			state.error = action.payload;
		},

		markAsSubmitted: (state, action) => {
			const { module } = action.payload;
			console.log(`Marking ${module} as submitted`);

			if (state.modules[module]) {
				state.modules[module].pendingChanges = false;
				Object.keys(state.modules[module].data).forEach(key => {
					state.modules[module].data[key].hasUserChanges = false;
				});
			}
		},

		clearModuleData: (state, action) => {
			Object.keys(state.modules).forEach(moduleKey => {
				if (moduleKey !== "GENERAL_SETTINGS") {
					state.modules[moduleKey].selectedItems = [];
					state.modules[moduleKey].selectedMitra = null;
					state.modules[moduleKey].selectedProduct = null;
					state.modules[moduleKey].data = {};
					state.modules[moduleKey].pendingChanges = false;
				}
			});
		},

		setModuleSelection: (state, action) => {
			const { module, mitra, product } = action.payload;

			if (state.modules[module]) {
				state.modules[module].selectedMitra = mitra;
				state.modules[module].selectedProduct = product;

				const key = `${mitra}_${product}`;
				if (state.modules[module].data[key]) {
					state.modules[module].selectedItems = state.modules[module].data[key].items;
				} else {
					state.modules[module].selectedItems = [];
				}
			}
		},

		setGeneralSettings: (state, action) => {
			const { settings } = action.payload;
			const existingData = settings.data.data;

			const generalData = {};
			existingData.forEach(setting => {
				generalData[setting.key] = setting.value;
			});

			console.log(
				"Testing General Settings",
				(state.modules.GENERAL_SETTINGS.dataAPI = {
					...generalData
				})
			);

			state.modules.GENERAL_SETTINGS.dataAPI = {
				...generalData
			};
			state.modules.GENERAL_SETTINGS.pendingChanges = false;
		},

		updateGeneralSetting: (state, action) => {
			const data = action.payload;
			console.log("updateGeneralSetting", data);
			state.modules.GENERAL_SETTINGS.data = { data };
		}
	}
});

export const {
	setSelectedMitra,
	setSelectedProduct,
	updateSelectedItems,
	mergeWithExistingData,
	getExistingData,
	setModuleSelection,
	clearModuleData,
	setLoading,
	setError,
	markAsSubmitted,
	getAllPendingData,
	setGeneralSettings,
	updateGeneralSetting,
	dataGeneralSettings
	// updateAllItemsWithStatus
} = settingsSlice.actions;

export default settingsSlice.reducer;
