import { toast } from "react-toastify";
import { getSettingGeneral, storeSettingsUpdate } from "../../../../utils/api/apiSettings";
import { updateSelectedItems, mergeWithExistingData, setLoading, markAsSubmitted, clearModuleData, setGeneralSettings, updateGeneralSetting } from "./settingSlice";

export const handleItemsChange = (dispatch, module, items, allItems, mitra, product, isUserChange = true,key) => {
	dispatch(
		updateSelectedItems({
			module,
			items,
			allItems, 
			mitra,
			product,
			isUserChange,
			key
		})
	);
};

// export const handleItemsChangeWithStatus = (dispatch, module, selectedItems, allItems, mitra, product, isUserChange = true) => {
// 	dispatch(
// 		updateAllItemsWithStatus({
// 			module,
// 			allItems,
// 			selectedItems,
// 			mitra,
// 			product,
// 			isUserChange
// 		})
// 	);
// };

export const mergeDataWithExisting = (dispatch, module, fetchedItems, mitra, product) => {
	dispatch(
		mergeWithExistingData({
			module,
			items: fetchedItems,
			mitra,
			product
		})
	);
};

export const setDatatoGeneralModule = (dispatch, data) => {
	dispatch(
		setGeneralSettings({
			settings: data
		})
	);
};

export const changeGeneralSettingsValue = (dispatch, data) => {
	dispatch(
		setGeneralSettings({
			settings: data
		})
	);
};
// Perbaikan pada getExistingDataFromRedux function
export const getExistingDataFromRedux = (settingsState, module, mitra, product, data_key) => {
    const key = `${mitra}_${product}`;

    if (module === "KLAIM_SETTINGS") {
        const klaimModuleData = settingsState.modules[module];

        if (data_key === "lampiran") {
            return klaimModuleData?.dataLampiran?.[key] || null;
        }

        if (data_key === "reason_claim") {
            return klaimModuleData?.dataReasonClaim?.[key] || null;
        }

        return null;
    }

    // Untuk module selain KLAIM_SETTINGS
    const moduleData = settingsState.modules[module];
    return moduleData?.data?.[key] || null;
};

export const getDataForMitraModuleProduct = (settingsState, module, mitra, product) => {
	const key = `${mitra}_${product}`;
	const moduleData = settingsState.modules[module];

	if (moduleData && moduleData.data[key]) {
		return moduleData.data[key];
	}
	return null;
};

// Update submitAllPendingData untuk mengirim semua data dengan status
export const submitAllPendingData = async (dispatch, settingsState) => {
    const modules = settingsState.modules;
    const submissionData = {};

    Object.keys(modules).forEach(module => {
        if (module === "KLAIM_SETTINGS") {
            const klaimData = modules[module];
            
            if (Object.keys(klaimData.dataLampiran).length > 0 || Object.keys(klaimData.dataReasonClaim).length > 0) {
                submissionData[module] = {
                    lampiran: {},
                    reason_claim: {}
                };

                Object.keys(klaimData.dataLampiran).forEach(key => {
                    const moduleData = klaimData.dataLampiran[key];
                    submissionData[module].lampiran[key] = {
                        mitra: moduleData.mitra,
                        product: moduleData.product,
                        timestamp: moduleData.timestamp,
                        hasUserChanges: moduleData.hasUserChanges,
                        itemsToUpdate: moduleData.items || [],
                        allItemsWithStatus: moduleData.allItems || [],
                        summary: {
                            totalItems: moduleData.allItems?.length || 0,
                            itemsToUpdate: moduleData.items?.length || 0,
                            itemsNotUpdated: (moduleData.allItems?.length || 0) - (moduleData.items?.length || 0)
                        }
                    };
                });

                Object.keys(klaimData.dataReasonClaim).forEach(key => {
                    const moduleData = klaimData.dataReasonClaim[key];
                    submissionData[module].reason_claim[key] = {
                        mitra: moduleData.mitra,
                        product: moduleData.product,
                        timestamp: moduleData.timestamp,
                        hasUserChanges: moduleData.hasUserChanges,
                        itemsToUpdate: moduleData.items || [],
                        allItemsWithStatus: moduleData.allItems || [],
                        summary: {
                            totalItems: moduleData.allItems?.length || 0,
                            itemsToUpdate: moduleData.items?.length || 0,
                            itemsNotUpdated: (moduleData.allItems?.length || 0) - (moduleData.items?.length || 0)
                        }
                    };
                });
            }
        } else if (Object.keys(modules[module].data || {}).length > 0) {
            submissionData[module] = {};
            
            Object.keys(modules[module].data).forEach(key => {
                const moduleData = modules[module].data[key];
                submissionData[module][key] = {
                    mitra: moduleData.mitra,
                    product: moduleData.product,
                    timestamp: moduleData.timestamp,
                    hasUserChanges: moduleData.hasUserChanges,
                    itemsToUpdate: moduleData.items || [],
                    allItemsWithStatus: moduleData.allItems || [],
                    summary: {
                        totalItems: moduleData.allItems?.length || 0,
                        itemsToUpdate: moduleData.items?.length || 0,
                        itemsNotUpdated: (moduleData.allItems?.length || 0) - (moduleData.items?.length || 0)
                    }
                };
            });
        }
    });

    dispatch(setLoading(true));

    try {
        console.log("submissionData", submissionData);
		await storeSettingsUpdate(submissionData);
        toast.success("Data berhasil disimpan.");
    } catch (error) {
        console.error("Error submitting data:", error);
        toast.error("Terjadi kesalahan saat menyimpan data.");
    } finally {
        dispatch(setLoading(false));
    }
};


export const updateGeneralSettingsValue = (dispatch, data) => {
	console.log("updateGeneralSettingsValue", {items: data});
	dispatch(updateGeneralSetting({ items: data }));
};

export const fnGetlistSettingGeneral = dispatch => {
	getSettingGeneral()
		.then(res => {
			dispatch(setGeneralSettings({ settings: res }));
		})
		.catch(err => {
			console.log("jenis produk penjaminan err failed", err);
		});
};
